// Shared primitives: liquid-glass surfaces, painting placeholders, status pills.

// useScroll — gives current scrollY for scroll-aware UI (nav morph, chip dock).
function useScroll() {
  const [y, setY] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => setY(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

// Painting — procedurally drawn placeholder that reads as a real artwork.
// Uses the work.grad + a few abstract overlays that suggest brushwork & room.
function Painting({ work, frame = true, aspect = "4/5", className = "", style = {} }) {
  const palette = work.palette || ["#FFD4B8", "#FF9A75", "#C44A1F", "#2C1208"];
  const seed = (work.id || "x").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  // a couple of pseudo-random transforms so each "painting" feels distinct
  const r = (n) => (seed * (n + 7) * 9301 + 49297) % 233280 / 233280;

  return (
    <div
      className={"painting " + className}
      style={{
        position: "relative",
        aspectRatio: aspect,
        background: work.grad,
        borderRadius: frame ? 4 : 0,
        overflow: "hidden",
        boxShadow: frame ?
        "0 30px 60px -20px rgba(26,20,16,0.35), 0 2px 8px rgba(26,20,16,0.08), inset 0 0 0 1px rgba(0,0,0,0.04)" :
        "inset 0 0 0 1px rgba(0,0,0,0.04)",
        ...style
      }}>
      
      {/* large soft brushy shape */}
      <div
        style={{
          position: "absolute",
          left: `${-15 + r(1) * 20}%`,
          top: `${20 + r(2) * 30}%`,
          width: `${50 + r(3) * 50}%`,
          height: `${40 + r(4) * 30}%`,
          background: `radial-gradient(ellipse at center, ${palette[0]}88 0%, ${palette[1]}44 40%, transparent 70%)`,
          filter: "blur(20px)",
          mixBlendMode: "soft-light"
        }} />
      
      {/* warm window of light */}
      <div
        style={{
          position: "absolute",
          right: `${5 + r(5) * 20}%`,
          top: `${10 + r(6) * 20}%`,
          width: `${15 + r(7) * 25}%`,
          height: `${25 + r(8) * 35}%`,
          background: `linear-gradient(180deg, ${palette[0]} 0%, ${palette[1]}aa 60%, transparent 100%)`,
          filter: "blur(8px)",
          borderRadius: "2px",
          opacity: 0.65
        }} />
      
      {/* dark grounding shape */}
      <div
        style={{
          position: "absolute",
          left: 0, right: 0, bottom: 0,
          height: `${20 + r(9) * 30}%`,
          background: `linear-gradient(180deg, transparent 0%, ${palette[3]}55 60%, ${palette[3]}88 100%)`
        }} />
      
      {/* canvas grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          mixBlendMode: "overlay",
          backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 2px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 2px)"
        }} />
      
      {/* faint signature in corner */}
      <div
        style={{
          position: "absolute",
          right: 10,
          bottom: 8,
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 10,
          color: "rgba(0,0,0,0.35)",
          letterSpacing: "0.02em"
        }}>
        
        R.K. {work.year}
      </div>
    </div>);

}

// GlassPill — base for chips, capsules, status pills
function GlassPill({ children, strong = false, tint = null, style = {}, className = "", ...rest }) {
  return (
    <div
      className={(strong ? "lg-strong " : "lg ") + className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 14px",
        borderRadius: 999,
        fontFamily: "var(--font-ui)",
        fontSize: 13,
        color: "var(--ink-1)",
        position: "relative",
        ...(tint ? { boxShadow: `var(--shadow-glass), inset 0 0 30px ${tint}` } : {}),
        ...style
      }}
      {...rest}>
      
      {children}
    </div>);

}

// StatusPill — Live-Activities-style "currently in the studio" indicator.
// Shows a pulsing dot, the studio state, and ticks through 3 micro-states.
function StatusPill() {
  const states = [
  { dot: "var(--accent-3, #FF7A3D)", label: "Painting", detail: "Hours, before noon" },
  { dot: "#8A9A5B", label: "On view", detail: "By appointment, Tue — Sun" },
  { dot: "var(--accent-2, #FFB347)", label: "Studio", detail: "Open · spring 2026" }];

  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % states.length), 4200);
    return () => clearInterval(t);
  }, []);
  const s = states[i];
  return (
    <GlassPill
      strong
      style={{
        padding: "10px 18px 10px 14px",
        gap: 12,
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "-0.005em"
      }}>
      
      <span
        style={{
          width: 8, height: 8, borderRadius: 999,
          background: s.dot,
          boxShadow: `0 0 0 4px ${s.dot}22, 0 0 12px ${s.dot}`,
          flex: "0 0 auto",
          animation: "statusPulse 2s ease-in-out infinite"
        }} />
      
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15, whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          {s.label}
        </span>
        <span style={{ color: "var(--ink-1)", fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14 }}>
          {s.detail}
        </span>
      </div>
      <style>{`
        @keyframes statusPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.25); opacity: 0.85; }
        }
      `}</style>
    </GlassPill>);

}

// pressAnim — gentle squish + bloom on release. Plays a Web-Animations
// keyframe each click so rapid taps still feel responsive.
function pressAnim(el) {
  if (!el || !el.animate) return;
  el.animate(
    [
      { transform: "scale(0.94)", offset: 0 },
      { transform: "scale(1.035)", offset: 0.5 },
      { transform: "scale(1)", offset: 1 }
    ],
    { duration: 380, easing: "cubic-bezier(0.34, 1.45, 0.5, 1)" }
  );
}

// usePressHandler — wraps an onClick to fire pressAnim + ripple
function usePressHandler(onClick) {
  return React.useCallback((e) => {
    pressAnim(e.currentTarget);
    // ripple — soft expanding circle from the click point
    const host = e.currentTarget;
    if (host && host.animate) {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const ripple = document.createElement("span");
      const size = Math.max(r.width, r.height) * 1.6;
      Object.assign(ripple.style, {
        position: "absolute",
        left: x - size / 2 + "px",
        top: y - size / 2 + "px",
        width: size + "px",
        height: size + "px",
        borderRadius: "50%",
        background: "currentColor",
        opacity: "0.18",
        pointerEvents: "none",
        transform: "scale(0)"
      });
      // ensure host clips the ripple
      const prevPos = host.style.position;
      const prevOverflow = host.style.overflow;
      if (!prevPos) host.style.position = "relative";
      if (!prevOverflow) host.style.overflow = "hidden";
      host.appendChild(ripple);
      const anim = ripple.animate(
        [
          { transform: "scale(0)", opacity: 0.22 },
          { transform: "scale(1)", opacity: 0 }
        ],
        { duration: 560, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
      anim.onfinish = () => { ripple.remove(); };
    }
    onClick && onClick(e);
  }, [onClick]);
}

// PrimaryBtn — dark pill button
function PrimaryBtn({ children, onClick, style = {}, ...rest }) {
  const handle = usePressHandler(onClick);
  return (
    <button
      className="press"
      onClick={handle}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "13px 22px",
        borderRadius: 999,
        background: "var(--ink-1)",
        color: "var(--bone)",
        border: 0,
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "-0.005em",
        ...style
      }}
      {...rest}>
      
      {children}
    </button>);

}

// GhostBtn — outlined pill
function GhostBtn({ children, onClick, style = {}, ...rest }) {
  const handle = usePressHandler(onClick);
  return (
    <button
      className="press"
      onClick={handle}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "13px 22px",
        borderRadius: 999,
        background: "transparent",
        color: "var(--ink-1)",
        border: "1px solid var(--mist)",
        fontSize: 14,
        fontWeight: 500,
        ...style
      }}
      {...rest}>
      
      {children}
    </button>);

}

// GlassBtn — translucent button, used over imagery
function GlassBtn({ children, onClick, style = {}, ...rest }) {
  const handle = usePressHandler(onClick);
  return (
    <button
      className="lg press"
      onClick={handle}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "12px 20px",
        borderRadius: 999,
        color: "var(--ink-1)",
        fontSize: 14,
        fontWeight: 500,
        border: 0,
        ...style
      }}
      {...rest}>
      
      {children}
    </button>);

}

// EnvelopeIcon — the only icon we use
function EnvelopeIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>);

}
function ArrowIcon({ size = 14, dir = "right" }) {
  const r = { right: 0, left: 180, up: -90, down: 90 }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${r}deg)` }}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>);

}
function CloseIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>);

}
function MenuIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>);

}

// Eyebrow — small caps mono label
function Eyebrow({ children, style = {} }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        color: "var(--ink-3)",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        ...style
      }}>
      
      {children}
    </div>);

}

Object.assign(window, {
  useScroll, Painting, GlassPill, StatusPill,
  PrimaryBtn, GhostBtn, GlassBtn,
  EnvelopeIcon, ArrowIcon, CloseIcon, MenuIcon, Eyebrow,
  pressAnim, usePressHandler
});