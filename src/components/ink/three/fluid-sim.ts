import * as THREE from "three";
import {
  baseVertex,
  clearFrag,
  splatFrag,
  advectFrag,
  divergenceFrag,
  curlFrag,
  vorticityFrag,
  pressureFrag,
  gradientSubtractFrag,
  displayFrag,
} from "./fluid-shaders";

export interface FluidParams {
  /** Dye kept per frame (0.98 = fades fast, 0.997 = lingers). */
  dissipation: number;
  velocityDissipation: number;
  splatRadius: number;
  /** 0 free-flowing, 1 fully axis-locked to the plotter grid. */
  gridSnap: number;
  /** 0 smooth, 1 hard halftone. */
  dither: number;
  curl: number;
  pressureIterations: number;
  /** Accent colour, normalized RGB. */
  accent: [number, number, number];
  /** Global dye brightness multiplier. */
  intensity: number;
  /** Grid cell size in CSS px (matches .bg-grid). */
  gridPx: number;
}

const DEFAULTS: FluidParams = {
  dissipation: 0.985,
  velocityDissipation: 0.97,
  splatRadius: 0.0018,
  gridSnap: 0,
  dither: 0,
  curl: 8,
  pressureIterations: 18,
  accent: [0.8, 0.95, 0.3],
  intensity: 1,
  gridPx: 56,
};

interface DoubleFBO {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;
  texelSize: THREE.Vector2;
  swap: () => void;
}

/**
 * GPU ink simulation on a fullscreen quad. Owns its renderer; call
 * `render(dt)` from a rAF loop, `splat()` from pointer events, `drop()`
 * for idle blots, `dispose()` on unmount.
 */
export class FluidSim {
  readonly canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private quad: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private params: FluidParams;

  private velocity!: DoubleFBO;
  private dye!: DoubleFBO;
  private pressure!: DoubleFBO;
  private divergence!: THREE.WebGLRenderTarget;
  private curlRT!: THREE.WebGLRenderTarget;

  private mats: Record<string, THREE.ShaderMaterial>;
  private width = 1;
  private height = 1;
  private simRes = 128;
  private dyeRes = 768;
  private pendingSplats: { x: number; y: number; dx: number; dy: number; dye: number; radius: number }[] = [];

  constructor(canvas: HTMLCanvasElement, params: Partial<FluidParams> = {}) {
    this.canvas = canvas;
    this.params = { ...DEFAULTS, ...params };
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.autoClear = false;

    const mk = (frag: string, uniforms: Record<string, THREE.IUniform>) =>
      new THREE.ShaderMaterial({
        vertexShader: baseVertex,
        fragmentShader: frag,
        uniforms: { texelSize: { value: new THREE.Vector2() }, ...uniforms },
        depthTest: false,
        depthWrite: false,
        transparent: true,
        blending: THREE.NoBlending,
      });

    this.mats = {
      clear: mk(clearFrag, { uTexture: { value: null }, value: { value: 0.8 } }),
      splat: mk(splatFrag, {
        uTarget: { value: null },
        aspectRatio: { value: 1 },
        color: { value: new THREE.Vector3() },
        point: { value: new THREE.Vector2() },
        radius: { value: 0.002 },
      }),
      advect: mk(advectFrag, {
        uVelocity: { value: null },
        uSource: { value: null },
        dt: { value: 0.016 },
        dissipation: { value: 0.98 },
        gridSnap: { value: 0 },
      }),
      divergence: mk(divergenceFrag, { uVelocity: { value: null } }),
      curl: mk(curlFrag, { uVelocity: { value: null } }),
      vorticity: mk(vorticityFrag, {
        uVelocity: { value: null },
        uCurl: { value: null },
        curl: { value: 8 },
        dt: { value: 0.016 },
      }),
      pressure: mk(pressureFrag, { uPressure: { value: null }, uDivergence: { value: null } }),
      gradient: mk(gradientSubtractFrag, { uPressure: { value: null }, uVelocity: { value: null } }),
      display: mk(displayFrag, {
        uDye: { value: null },
        accent: { value: new THREE.Vector3() },
        gridSnap: { value: 0 },
        dither: { value: 0 },
        gridCells: { value: new THREE.Vector2(20, 12) },
        intensity: { value: 1 },
      }),
    };
    // The display pass composites over the page, so it needs real blending.
    this.mats.display.blending = THREE.NormalBlending;

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mats.display);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);

    this.resize();
    this.setParams(this.params);
  }

  setParams(p: Partial<FluidParams>) {
    this.params = { ...this.params, ...p };
    const d = this.mats.display.uniforms;
    d.accent.value.set(...this.params.accent);
    d.gridSnap.value = this.params.gridSnap;
    d.dither.value = this.params.dither;
    d.intensity.value = this.params.intensity;
    this.mats.advect.uniforms.gridSnap.value = this.params.gridSnap;
    this.mats.vorticity.uniforms.curl.value = this.params.curl;
    this.updateGrid();
  }

  private updateGrid() {
    const g = this.params.gridPx;
    this.mats.display.uniforms.gridCells.value.set(
      Math.max(1, this.width / g),
      Math.max(1, this.height / g)
    );
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    if (w === this.width && h === this.height && this.dye) return;
    this.width = w;
    this.height = h;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);

    const aspect = w / h;
    const simW = aspect >= 1 ? Math.round(this.simRes * aspect) : this.simRes;
    const simH = aspect >= 1 ? this.simRes : Math.round(this.simRes / aspect);
    const dyeW = aspect >= 1 ? Math.round(this.dyeRes * aspect) : this.dyeRes;
    const dyeH = aspect >= 1 ? this.dyeRes : Math.round(this.dyeRes / aspect);

    this.disposeTargets();
    this.velocity = this.createDouble(simW, simH);
    this.pressure = this.createDouble(simW, simH);
    this.dye = this.createDouble(dyeW, dyeH);
    this.divergence = this.createTarget(simW, simH);
    this.curlRT = this.createTarget(simW, simH);
    this.updateGrid();
  }

  private createTarget(w: number, h: number) {
    return new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      depthBuffer: false,
      stencilBuffer: false,
    });
  }

  private createDouble(w: number, h: number): DoubleFBO {
    const fbo = {
      read: this.createTarget(w, h),
      write: this.createTarget(w, h),
      texelSize: new THREE.Vector2(1 / w, 1 / h),
      swap() {
        const t = fbo.read;
        fbo.read = fbo.write;
        fbo.write = t;
      },
    };
    return fbo;
  }

  private disposeTargets() {
    for (const t of [this.velocity, this.pressure, this.dye]) {
      t?.read.dispose();
      t?.write.dispose();
    }
    this.divergence?.dispose();
    this.curlRT?.dispose();
  }

  private pass(mat: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null, texel: THREE.Vector2) {
    mat.uniforms.texelSize.value.copy(texel);
    this.quad.material = mat;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Push ink at (x, y) in 0..1 canvas coordinates (y up), with a velocity
   * impulse (dx, dy) and `dye` amount. Queued and applied on the next frame.
   */
  splat(x: number, y: number, dx: number, dy: number, dye = 0.6, radius?: number) {
    this.pendingSplats.push({ x, y, dx, dy, dye, radius: radius ?? this.params.splatRadius });
  }

  /** A big idle drop: dye plus a small radial burst so it spreads. */
  drop(x: number, y: number, size = 1) {
    const r = this.params.splatRadius * 12 * size;
    this.splat(x, y, 0, 0, 1.4 * size, r);
    const n = 6;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random();
      this.splat(x, y, Math.cos(a) * 220 * size, Math.sin(a) * 220 * size, 0, r * 0.6);
    }
  }

  private applySplats() {
    const s = this.mats.splat;
    const aspect = this.width / this.height;
    s.uniforms.aspectRatio.value = aspect;
    for (const p of this.pendingSplats) {
      s.uniforms.point.value.set(p.x, p.y);
      s.uniforms.radius.value = p.radius;
      if (p.dx !== 0 || p.dy !== 0) {
        s.uniforms.uTarget.value = this.velocity.read.texture;
        s.uniforms.color.value.set(p.dx, p.dy, 0);
        this.pass(s, this.velocity.write, this.velocity.texelSize);
        this.velocity.swap();
      }
      if (p.dye > 0) {
        s.uniforms.uTarget.value = this.dye.read.texture;
        s.uniforms.color.value.set(p.dye, 0, 0);
        this.pass(s, this.dye.write, this.dye.texelSize);
        this.dye.swap();
      }
    }
    this.pendingSplats.length = 0;
  }

  render(dt: number) {
    const step = Math.min(dt, 0.033);
    this.applySplats();

    const vel = this.velocity;
    const m = this.mats;

    m.curl.uniforms.uVelocity.value = vel.read.texture;
    this.pass(m.curl, this.curlRT, vel.texelSize);

    m.vorticity.uniforms.uVelocity.value = vel.read.texture;
    m.vorticity.uniforms.uCurl.value = this.curlRT.texture;
    m.vorticity.uniforms.dt.value = step;
    this.pass(m.vorticity, vel.write, vel.texelSize);
    vel.swap();

    m.divergence.uniforms.uVelocity.value = vel.read.texture;
    this.pass(m.divergence, this.divergence, vel.texelSize);

    m.clear.uniforms.uTexture.value = this.pressure.read.texture;
    m.clear.uniforms.value.value = 0.8;
    this.pass(m.clear, this.pressure.write, vel.texelSize);
    this.pressure.swap();

    m.pressure.uniforms.uDivergence.value = this.divergence.texture;
    for (let i = 0; i < this.params.pressureIterations; i++) {
      m.pressure.uniforms.uPressure.value = this.pressure.read.texture;
      this.pass(m.pressure, this.pressure.write, vel.texelSize);
      this.pressure.swap();
    }

    m.gradient.uniforms.uPressure.value = this.pressure.read.texture;
    m.gradient.uniforms.uVelocity.value = vel.read.texture;
    this.pass(m.gradient, vel.write, vel.texelSize);
    vel.swap();

    m.advect.uniforms.dt.value = step;
    m.advect.uniforms.uVelocity.value = vel.read.texture;
    m.advect.uniforms.uSource.value = vel.read.texture;
    m.advect.uniforms.dissipation.value = this.params.velocityDissipation;
    this.pass(m.advect, vel.write, vel.texelSize);
    vel.swap();

    m.advect.uniforms.uVelocity.value = vel.read.texture;
    m.advect.uniforms.uSource.value = this.dye.read.texture;
    m.advect.uniforms.dissipation.value = this.params.dissipation;
    this.pass(m.advect, this.dye.write, this.dye.texelSize);
    this.dye.swap();

    m.display.uniforms.uDye.value = this.dye.read.texture;
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.pass(m.display, null, this.dye.texelSize);
  }

  dispose() {
    this.disposeTargets();
    Object.values(this.mats).forEach((mat) => mat.dispose());
    this.quad.geometry.dispose();
    this.renderer.dispose();
  }
}
