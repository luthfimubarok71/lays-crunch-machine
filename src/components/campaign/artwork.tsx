export function Brand({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`brand ${small ? "brand-small" : ""}`}
      aria-label="Lay’s Crunch Machine, identitas provisional"
    >
      <span className="brand-disc">
        <span>Lay’s</span>
      </span>
      <span className="brand-type">
        CRUNCH
        <br />
        MACHINE<span className="brand-dot">✳</span>
      </span>
    </div>
  );
}
export function Chip({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 140"
      className={`chip ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="chipFill">
          <stop stopColor="#ffe99a" />
          <stop offset=".7" stopColor="#efbd4d" />
          <stop offset="1" stopColor="#c99025" />
        </radialGradient>
      </defs>
      <path
        d="M14 67C14 30 54 8 90 15c42 8 66 36 71 69 4 27-24 40-62 36C56 116 15 100 14 67Z"
        fill="url(#chipFill)"
        stroke="#e2a632"
        strokeWidth="2"
      />
      <path
        d="M20 64c34 17 71 20 133 11M28 47c36 17 76 24 115 12"
        fill="none"
        stroke="#f8d573"
        strokeWidth="3"
      />
      <g fill="#c79131" opacity=".55">
        {Array.from({ length: 32 }, (_, i) => (
          <ellipse
            key={i}
            cx={35 + ((i * 29) % 108)}
            cy={35 + ((i * 17) % 62)}
            rx={1.3 + (i % 2)}
            ry="1"
            transform={`rotate(${i * 13} ${35 + ((i * 29) % 108)} ${35 + ((i * 17) % 62)})`}
          />
        ))}
      </g>
      <path
        d="M15 63c25 30 89 53 140 27-4 28-39 35-69 27-41-10-67-23-71-54Z"
        fill="#b98224"
        opacity=".2"
      />
    </svg>
  );
}
export function PackArt() {
  return (
    <div
      className="pack-scene"
      aria-label="Illustration provisional kemasan Lay’s"
    >
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <span className="scene-star star-one">✳</span>
      <span className="scene-star star-two">✦</span>
      <Chip className="chip-one" />
      <Chip className="chip-two" />
      <Chip className="chip-three" />
      <div className="crisp-pack">
        <div className="pack-crimp" />
        <span className="pack-small">
          A LITTLE CHIP.
          <br />A BIG MOMENT.
        </span>
        <span className="pack-logo">Lay’s</span>
        <span className="pack-flavour">CLASSIC</span>
        <Chip className="pack-chip" />
        <span className="pack-bottom">100% CRUNCH ENERGY</span>
        <div className="pack-crimp bottom" />
      </div>
      <div className="round-stamp">
        BITE IT.
        <br />
        <strong>OWN IT.</strong>
        <br />
        SHARE IT.
      </div>
      <div className="scene-note">YOUR CRUNCH. YOUR SPOTLIGHT.</div>
    </div>
  );
}
export function Waveform({
  animated = false,
  dark = false,
}: {
  animated?: boolean;
  dark?: boolean;
}) {
  return (
    <div
      className={`waveform ${animated ? "is-animated" : ""} ${dark ? "wave-dark" : ""}`}
      aria-label="Waveform simulasi"
    >
      <div className="wave-line" />
      {Array.from({ length: 53 }, (_, i) => (
        <i
          key={i}
          style={{
            height: `${12 + Math.abs(Math.sin(i * 0.79) * Math.cos(i * 0.23)) * 82}%`,
            animationDelay: `${i * -71}ms`,
          }}
        />
      ))}
    </div>
  );
}
