/**
 * Shared SVG filters for the ink system, mounted once in the root layout.
 * Referenced from CSS as `filter: url(#ink-…)`.
 *
 * - ink-tear: engineer divider edge (fine, paper fibre)
 * - ink-bleed: poet divider edge (wet, soft)
 * - ink-text: hairline displacement for display type
 * - ink-stamp: ink-starved rubber-stamp edges
 * - ink-seal: soft wax-seal edge
 * - ink-blob: goo threshold for the 2D blot canvas
 */
export function InkDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <filter id="ink-tear" x="-5%" y="-200%" width="110%" height="500%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09 0.6" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="ink-bleed" x="-5%" y="-300%" width="110%" height="700%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.12" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="22" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.6" />
        </filter>

        <filter id="ink-text" x="-2%" y="-10%" width="104%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="ink-stamp" x="-8%" y="-20%" width="116%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feComponentTransfer in="d">
            <feFuncA type="discrete" tableValues="0 0 0.9 1 1" />
          </feComponentTransfer>
        </filter>

        <filter id="ink-seal" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="ink-blob" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b" />
          <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -10" />
        </filter>
      </defs>
    </svg>
  );
}
