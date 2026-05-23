// Worlds — bodies of work. App-icon-style squircle tiles (iOS 26 motif).
// Each tile is a specular liquid-glass app-icon with a "world" inside.

function Worlds({ onSelect, onInquire }) {
  return (
    <section className="page-enter" style={{ position: "relative", padding: "64px 32px 144px", maxWidth: 1280, margin: "0 auto" }}>
      <Eyebrow> </Eyebrow>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 12, gap: 32, flexWrap: "wrap", marginBottom: 64 }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1.0,
          letterSpacing: "-0.03em",
          margin: 0,
          fontWeight: 400,
          maxWidth: "18ch"
        }}>
          Explore <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}>WORLDS</em>
        </h1>
        <p style={{ fontSize: 16, color: "var(--ink-3)", maxWidth: "32ch", margin: 0, lineHeight: 1.55 }}>Worlds are artistic themes applied to various mediums in a coherent form. 

        </p>
      </div>

      {/* Big app-icon grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 32,
        marginBottom: 96
      }}>
        {window.WORLDS.map((w) =>
        <WorldTile key={w.id} world={w} onClick={() => onSelect(w)} />
        )}
      </div>

      {/* Editions strip — same app-icon language, but smaller, denser */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24, gap: 24, flexWrap: "wrap" }}>
          <div>
            <Eyebrow>Editions & prints</Eyebrow>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 400, letterSpacing: "-0.02em", margin: "6px 0 0" }}>
              Hand-pulled, numbered, never re-issued
            </h2>
          </div>
          <p style={{ fontSize: 14, color: "var(--ink-3)", maxWidth: "28ch", margin: 0, lineHeight: 1.55 }}>
            Six editions currently in the room. Each comes signed, numbered, and packed flat.
          </p>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 22
        }}>
          {window.EDITIONS.map((e) =>
          <EditionTile key={e.id} edition={e} onInquire={onInquire} />
          )}
        </div>
      </div>
    </section>);

}

// Pick a couple of secondary gradients for the stack-behind tiles,
// based on the world's main grad family (lighter / quieter variants).
function stackGrads(world) {
  // Use the world id to pick deterministic offsets so each tile looks distinct
  const grads = {
    "wl-1": [
      "linear-gradient(165deg, #FFE2C9 0%, #FFC4A0 60%, #E89B6F 100%)",
      "linear-gradient(150deg, #FFF1E0 0%, #FFD9B8 100%)",
    ],
    "wl-2": [
      "linear-gradient(160deg, #E8DDEC 0%, #C99AAF 60%, #6E96C4 100%)",
      "linear-gradient(150deg, #EFE6EE 0%, #BCD6EA 100%)",
    ],
    "wl-3": [
      "linear-gradient(160deg, #ECE5DB 0%, #B8A893 50%, #5A4E40 100%)",
      "linear-gradient(155deg, #F4EFE8 0%, #C8B8A0 100%)",
    ],
    "wl-4": [
      "linear-gradient(155deg, #F4E4B8 0%, #C99A3D 50%, #6B4A2A 100%)",
      "linear-gradient(150deg, #FFF4DC 0%, #E2C896 100%)",
    ],
  };
  return grads[world.id] || [world.grad, world.grad];
}

// Big squircle world tile — rendered as a photo-library stack:
// two rotated "polaroid" tiles peek out behind the main tile.
function WorldTile({ world, onClick }) {
  const [hover, setHover] = React.useState(false);
  const [back2, back1] = stackGrads(world);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="press"
      style={{
        position: "relative",
        textAlign: "left",
        background: "transparent",
        border: 0,
        padding: 0,
        cursor: "pointer",
        fontFamily: "var(--font-ui)"
      }}>
      {/* Stack container — gives room for back tiles to fan out */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1/1",
        padding: "6% 8% 4%",
        boxSizing: "border-box",
      }}>
        {/* Back tile 2 — rotated further, palest */}
        <div className="squircle" style={{
          position: "absolute",
          left: "12%", right: "12%",
          top: "10%", bottom: "8%",
          background: back2,
          borderRadius: 38,
          transform: hover ? "rotate(-10deg) translateY(-3px)" : "rotate(-8deg)",
          transformOrigin: "50% 100%",
          boxShadow: "0 8px 20px -10px rgba(26,20,16,0.25), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.06)",
          transition: "transform 400ms var(--ease-spring)",
          opacity: 0.95,
        }} />
        {/* Back tile 1 — rotated the other way */}
        <div className="squircle" style={{
          position: "absolute",
          left: "8%", right: "8%",
          top: "8%", bottom: "6%",
          background: back1,
          borderRadius: 40,
          transform: hover ? "rotate(7deg) translateY(-2px)" : "rotate(5deg)",
          transformOrigin: "50% 100%",
          boxShadow: "0 12px 26px -10px rgba(26,20,16,0.28), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.06)",
          transition: "transform 400ms var(--ease-spring)",
        }} />
        {/* Front tile — the main one with content */}
        <div className="squircle specular" style={{
          position: "absolute",
          inset: "4% 4% 0",
          background: world.grad,
          borderRadius: 42,
          overflow: "hidden",
          boxShadow: hover ?
          "0 30px 60px -16px rgba(26,20,16,0.32), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.08)" :
          "0 20px 40px -16px rgba(26,20,16,0.22), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.08)",
          transform: hover ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
          transition: "all 380ms var(--ease-spring)"
        }}>
          {/* tiny specular sweep */}
          <div style={{
            position: "absolute", left: "10%", top: "8%",
            width: "60%", height: "30%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.15) 50%, transparent 80%)",
            filter: "blur(8px)",
            pointerEvents: "none"
          }} />
          {/* number */}
          <div className="lg-strong" style={{
            position: "absolute", left: 18, top: 18,
            padding: "5px 10px",
            borderRadius: 999,
            fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: "0.08em",
            color: "var(--ink-1)"
          }}>
            {world.count} works
          </div>
          {/* title overlay */}
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 0,
            padding: "26px 24px 22px",
            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 100%)"
          }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 400,
              color: "#FFFEFB",
              letterSpacing: "-0.02em",
              lineHeight: 1.05
            }}>{world.title}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "rgba(255,254,251,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>
              {world.years}
            </div>
          </div>
        </div>
      </div>
      <p style={{
        margin: "20px 8px 0",
        fontSize: 14,
        lineHeight: 1.55,
        color: "var(--ink-2)",
        maxWidth: "32ch"
      }}>
        {world.blurb}
      </p>
    </button>);

}

// Small edition app-icon tile
function EditionTile({ edition, onInquire }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => onInquire({ title: edition.title, medium: "Edition", year: 2025, palette: ["#FFD4B8", "#FF9A75"] })}
        className="press"
        style={{
          position: "relative",
          background: "transparent",
          border: 0,
          padding: 0,
          cursor: "pointer"
        }}>
        
        <div className="squircle specular" style={{
          position: "relative",
          aspectRatio: "1/1",
          background: edition.grad,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: hover ?
          "0 20px 40px -12px rgba(26,20,16,0.32), inset 0 1px 0 rgba(255,255,255,0.5)" :
          "0 12px 24px -10px rgba(26,20,16,0.22), inset 0 1px 0 rgba(255,255,255,0.4)",
          transform: hover ? "scale(1.02)" : "scale(1)",
          transition: "all 320ms var(--ease-spring)"
        }}>
          <div style={{
            position: "absolute", left: "14%", top: "10%",
            width: "55%", height: "25%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.55) 0%, transparent 70%)",
            filter: "blur(6px)"
          }} />
          <div className="lg-strong" style={{
            position: "absolute", right: 10, top: 10,
            padding: "4px 9px",
            borderRadius: 999,
            fontFamily: "var(--font-mono)", fontSize: 9,
            letterSpacing: "0.06em",
            color: "var(--ink-1)"
          }}>
            {edition.price}
          </div>
        </div>
      </button>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, color: "var(--ink-1)", lineHeight: 1.15, letterSpacing: "-0.005em" }}>
          {edition.title}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)", letterSpacing: "0.04em", marginTop: 6 }}>
          {edition.ed.toUpperCase()} · {edition.size.toUpperCase()}
        </div>
      </div>
    </div>);

}

Object.assign(window, { Worlds, WorldTile, EditionTile });