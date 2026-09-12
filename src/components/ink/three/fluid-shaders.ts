/**
 * GLSL for the ink fluid. A classic GPU "stable fluids" loop (splat →
 * curl/vorticity → divergence → pressure → gradient subtract → advect)
 * plus a display pass that turns dye density into ink: accent-coloured,
 * with a plotter grid + ordered dither for the engineer register and a
 * soft rim (the "coffee ring" of ink in water) for the poet register.
 */

export const baseVertex = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = uv;
    vL = uv - vec2(texelSize.x, 0.0);
    vR = uv + vec2(texelSize.x, 0.0);
    vT = uv + vec2(0.0, texelSize.y);
    vB = uv - vec2(0.0, texelSize.y);
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const header = /* glsl */ `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
`;

export const clearFrag = /* glsl */ `
  ${header}
  uniform sampler2D uTexture;
  uniform float value;
  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

export const splatFrag = /* glsl */ `
  ${header}
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

export const advectFrag = /* glsl */ `
  ${header}
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  uniform float gridSnap;
  void main () {
    vec2 vel = texture2D(uVelocity, vUv).xy;
    // Plotter register: ink prefers to run along one axis at a time.
    vec2 axial = abs(vel.x) > abs(vel.y) ? vec2(vel.x, 0.0) : vec2(0.0, vel.y);
    vel = mix(vel, axial, gridSnap);
    vec2 coord = vUv - dt * vel * texelSize;
    gl_FragColor = dissipation * texture2D(uSource, coord);
  }
`;

export const divergenceFrag = /* glsl */ `
  ${header}
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

export const curlFrag = /* glsl */ `
  ${header}
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

export const vorticityFrag = /* glsl */ `
  ${header}
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * dt;
    velocity = min(max(velocity, -1000.0), 1000.0);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

export const pressureFrag = /* glsl */ `
  ${header}
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

export const gradientSubtractFrag = /* glsl */ `
  ${header}
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

export const displayFrag = /* glsl */ `
  ${header}
  uniform sampler2D uDye;
  uniform vec3 accent;
  uniform float gridSnap;
  uniform float dither;
  uniform vec2 gridCells;
  uniform float intensity;

  // 4x4 ordered dither threshold
  float bayer(vec2 p) {
    vec2 q = floor(mod(p, 4.0));
    float x = q.x;
    float y = q.y;
    float m = 0.0;
    if (y == 0.0) m = (x == 0.0) ? 0.0 : (x == 1.0) ? 8.0 : (x == 2.0) ? 2.0 : 10.0;
    else if (y == 1.0) m = (x == 0.0) ? 12.0 : (x == 1.0) ? 4.0 : (x == 2.0) ? 14.0 : 6.0;
    else if (y == 2.0) m = (x == 0.0) ? 3.0 : (x == 1.0) ? 11.0 : (x == 2.0) ? 1.0 : 9.0;
    else m = (x == 0.0) ? 15.0 : (x == 1.0) ? 7.0 : (x == 2.0) ? 13.0 : 5.0;
    return (m + 0.5) / 16.0;
  }

  void main () {
    vec2 uv = vUv;
    // Plotter register: sample partly from the grid cell centre so ink
    // reads as blocks that sit on the 56px grid.
    vec2 cellUv = (floor(uv * gridCells) + 0.5) / gridCells;
    uv = mix(uv, cellUv, gridSnap * 0.22);

    float d = texture2D(uDye, uv).r * intensity;
    float density = clamp(d, 0.0, 1.5);

    float alpha = smoothstep(0.02, 0.55, density);
    // Poet register: a darker rim where the ink thins (ink in water).
    float rim = smoothstep(0.02, 0.10, density) * (1.0 - smoothstep(0.10, 0.34, density));
    vec3 col = accent * (0.55 + 0.45 * smoothstep(0.25, 1.1, density));
    col = mix(col, col * 0.45, rim * (1.0 - gridSnap) * 0.8);

    // Engineer register: threshold through an ordered dither = halftone ink.
    float t = bayer(gl_FragCoord.xy / 2.0);
    float dithered = step(t, alpha);
    alpha = mix(alpha, dithered * max(alpha, 0.6), dither);

    gl_FragColor = vec4(col, alpha * 0.8);
  }
`;
