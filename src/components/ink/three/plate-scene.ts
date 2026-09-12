import * as THREE from "three";

const vert = /* glsl */ `
  varying vec2 vUv;
  uniform vec2 uTilt;
  void main () {
    vUv = uv;
    vec3 p = position;
    // A little perspective skew from the cursor's velocity.
    p.x += uTilt.x * (uv.y - 0.5) * 0.18;
    p.y += uTilt.y * (uv.x - 0.5) * 0.18;
    gl_Position = vec4(p.xy, 0.0, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform sampler2D uPrev;
  uniform float uProgress;
  uniform float uMix;
  uniform vec3 uAccent;
  uniform float uGrid;
  uniform float uTime;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main () {
    vec2 uv = vUv;
    vec2 cells = vec2(18.0, 11.0);
    vec2 nuv = mix(uv, (floor(uv * cells) + 0.5) / cells, uGrid);
    float n = fbm(nuv * 3.2 + uTime * 0.04);
    float d = distance(uv, vec2(0.5, 0.5));
    // ink starts around the middle and spreads with the noise
    float t = n * 0.75 + d * 0.55;
    float p = uProgress * 1.3;
    float edge = mix(0.09, 0.015, uGrid);

    float m = 1.0 - smoothstep(p - edge * 0.4, p, t);
    float rim = smoothstep(p - edge * 2.4, p - edge * 1.4, t) * (1.0 - smoothstep(p - edge * 0.6, p, t));

    vec4 cur = texture2D(uTex, uv);
    vec4 prev = texture2D(uPrev, uv);
    vec4 img = mix(prev, cur, uMix);
    // Slight ink tint over the whole plate so it sits in the palette.
    vec3 rgb = mix(img.rgb, img.rgb * (0.85 + 0.15 * uAccent), 0.35);
    rgb = mix(rgb, uAccent, rim * 0.95);
    gl_FragColor = vec4(rgb, m * 0.98);
  }
`;

/**
 * A small WebGL plate that follows the cursor over the project list and
 * dissolves each project's screenshot in through an ink threshold.
 * Engineer: blocky, grid-quantised threshold with a hard rim. Poet: soft
 * fbm threshold with a wet rim.
 */
export class PlateScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private mat: THREE.ShaderMaterial;
  private loader = new THREE.TextureLoader();
  private cache = new Map<string, THREE.Texture>();
  private blank: THREE.DataTexture;
  private progress = 0;
  private targetProgress = 0;
  private mix = 1;
  private time = 0;
  private current: string | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
    this.blank.needsUpdate = true;
    this.mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthTest: false,
      uniforms: {
        uTex: { value: this.blank },
        uPrev: { value: this.blank },
        uProgress: { value: 0 },
        uMix: { value: 1 },
        uAccent: { value: new THREE.Vector3(0.8, 0.95, 0.3) },
        uGrid: { value: 0 },
        uTime: { value: 0 },
        uTilt: { value: new THREE.Vector2() },
      },
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mat);
    quad.frustumCulled = false;
    this.scene.add(quad);
  }

  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false);
  }

  setTheme(accent: [number, number, number], grid: number) {
    this.mat.uniforms.uAccent.value.set(...accent);
    this.mat.uniforms.uGrid.value = grid;
  }

  setTilt(x: number, y: number) {
    this.mat.uniforms.uTilt.value.set(x, y);
  }

  private texture(src: string): THREE.Texture {
    let t = this.cache.get(src);
    if (!t) {
      t = this.loader.load(src);
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      this.cache.set(src, t);
    }
    return t;
  }

  preload(srcs: string[]) {
    srcs.forEach((s) => this.texture(s));
  }

  show(src: string) {
    if (this.current !== src) {
      this.mat.uniforms.uPrev.value = this.current ? this.texture(this.current) : this.blank;
      this.mat.uniforms.uTex.value = this.texture(src);
      this.mix = this.current ? 0 : 1;
      this.current = src;
    }
    this.targetProgress = 1;
  }

  hide() {
    this.targetProgress = 0;
  }

  /** Returns true while there's something to draw. */
  tick(dt: number, speed: number): boolean {
    this.time += dt;
    const k = 1 - Math.pow(0.001, dt * speed);
    this.progress += (this.targetProgress - this.progress) * k;
    this.mix += (1 - this.mix) * Math.min(1, dt * 6);
    if (this.progress < 0.003 && this.targetProgress === 0) {
      this.progress = 0;
      if (this.current) {
        this.current = null;
        this.mat.uniforms.uTex.value = this.blank;
        this.mat.uniforms.uPrev.value = this.blank;
      }
      return false;
    }
    const u = this.mat.uniforms;
    u.uProgress.value = this.progress;
    u.uMix.value = this.mix;
    u.uTime.value = this.time;
    this.renderer.render(this.scene, this.camera);
    return true;
  }

  dispose() {
    this.cache.forEach((t) => t.dispose());
    this.blank.dispose();
    this.mat.dispose();
    this.renderer.dispose();
  }
}
