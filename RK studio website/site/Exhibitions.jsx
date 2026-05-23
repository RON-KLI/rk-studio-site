// Exhibitions — events page. A vertical timeline; upcoming on top.
// iOS 26 touches: scroll-aware contextual chips at the head, glass cards.

function Exhibitions({ onInquire }) {
  const [filter, setFilter] = React.useState("all");
  const xs = window.EXHIBITIONS.filter((x) => {
    if (filter === "upcoming") return x.status === "Upcoming";
    if (filter === "current") return x.status === "On view";
    if (filter === "past") return x.status === "Past";
    return true;
  });

  return (
    <section className="page-enter exhibitions-pad" style={{ position: "relative", padding: "64px 32px 144px", maxWidth: 1280, margin: "0 auto" }}>
      <Eyebrow>Exhibitions & events</Eyebrow>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 12, gap: 32, flexWrap: "wrap", marginBottom: 48 }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1.0,
          letterSpacing: "-0.03em",
          margin: 0,
          fontWeight: 400,
          maxWidth: "18ch"
        }}>
          Calendar <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}></em>
        </h1>
        <p style={{ fontSize: 16, color: "var(--ink-3)", maxWidth: "32ch", margin: 0, lineHeight: 1.55 }}>I hate social gatherings but they photograph well so see you soon  

        </p>
      </div>

      {/* Featured upcoming */}
      <FeaturedShow x={window.EXHIBITIONS[0]} onInquire={onInquire} />

      <div className="exhibitions-filter-row" style={{ display: "flex", gap: 6, marginTop: 80, marginBottom: 28, flexWrap: "wrap" }}>
        {[["all", "All"], ["upcoming", "Upcoming"], ["current", "On view"], ["past", "Past"]].map(([id, label]) =>
        <button
          key={id}
          onClick={() => setFilter(id)}
          className="press"
          style={{
            padding: "8px 14px", borderRadius: 999, border: 0, cursor: "pointer",
            fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500,
            background: filter === id ? "var(--ink-1)" : "var(--bone)",
            color: filter === id ? "var(--bone)" : "var(--ink-2)",
            boxShadow: filter === id ? "var(--shadow-sm)" : "inset 0 0 0 1px var(--mist)",
            transition: "all 240ms var(--ease-out)"
          }}>
          {label}</button>
        )}
      </div>

      {/* Timeline list */}
      <div style={{ position: "relative" }}>
        {/* vertical rail */}
        <div className="exhibitions-rail" style={{ position: "absolute", left: 80, top: 28, bottom: 28, width: 1, background: "var(--mist)" }} />
        {xs.map((x, i) =>
        <ShowRow key={x.id} x={x} index={i} onInquire={onInquire} />
        )}
      </div>
    </section>);

}

function FeaturedShow({ x, onInquire }) {
  return (
    <div className="lg-strong next-show-card" data-stack="sm" style={{
      position: "relative",
      borderRadius: 32,
      padding: 32,
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr",
      gap: 40,
      overflow: "hidden"
    }}>
      {/* glow */}
      <div aria-hidden style={{
        position: "absolute", right: -100, top: -100,
        width: 420, height: 420, borderRadius: "50%",
        background: "radial-gradient(circle at center, var(--bone) 0%, var(--paper-2) 40%, transparent 70%)",
        filter: "blur(80px)", opacity: 0.9, pointerEvents: "none"
      }} />

      <div style={{ position: "relative" }}>
        <GlassPill style={{ padding: "6px 12px 6px 10px", fontSize: 11.5, marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent-3, var(--sunrise))", boxShadow: "0 0 0 4px var(--accent-glow, rgba(255,123,60,0.3))" }} />
          <span style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-2)" }}>Next show · {x.dates.split(",")[0]}</span>
        </GlassPill>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(32px, 4vw, 56px)",
          lineHeight: 1.0,
          letterSpacing: "-0.025em",
          margin: 0,
          fontWeight: 400,
          color: "var(--ink-1)"
        }}>{x.title}</h2>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", letterSpacing: "0.06em", marginTop: 16, lineHeight: 1.8 }}>
          {x.dates.toUpperCase()}<br />
          {x.venue.toUpperCase()}<br />
          {x.city.toUpperCase()}
        </div>
        <p style={{ marginTop: 24, fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6, maxWidth: "44ch" }}>
          {x.blurb}
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
          <PrimaryBtn onClick={onInquire} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <EnvelopeIcon size={13} /> RSVP
          </PrimaryBtn>
          <GhostBtn>Add to calendar</GhostBtn>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <Painting work={{
          id: x.id,
          year: x.year,
          palette: ["#FFE2C9", "#FF9A75", "#C44A1F", "#2C1208"],
          grad: "linear-gradient(155deg, #FFE2C9 0%, #FF9A75 38%, #C44A1F 78%, #3B1610 100%)"
        }} aspect="4/5" />
      </div>
    </div>);

}

function ShowRow({ x, index, onInquire }) {
  const dot = x.status === "On view" ? "var(--status-positive)" :
  x.status === "Upcoming" ? "var(--accent-3, var(--sunrise))" :
  "var(--ink-4)";
  return (
    <div className="show-row" style={{
      position: "relative",
      display: "grid",
      gridTemplateColumns: "120px 1fr 200px",
      gap: 24,
      alignItems: "center",
      padding: "28px 0",
      borderBottom: "1px solid var(--mist)"
    }}>
      {/* year + dot on the rail */}
      <div className="show-row__year-row" style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-2)", letterSpacing: "0.04em" }}>
          {x.year}
        </span>
        <span
          className={(x.status === "On view" || x.status === "Upcoming" ? "exhibition-dot--live " : "") + "show-row__dot"}
          style={{
            position: "absolute", left: 76, top: "50%", transform: "translateY(-50%)",
            width: 10, height: 10, borderRadius: 999,
            background: dot,
            boxShadow: `0 0 0 4px ${x.status === "On view" ? "rgba(138,154,91,0.18)" : x.status === "Upcoming" ? "var(--accent-glow, rgba(255,123,60,0.25))" : "transparent"}`,
            ["--dot-glow"]: x.status === "On view" ? "rgba(138,154,91,0.22)" : "var(--accent-glow, rgba(255,123,60,0.30))",
            ["--dot-glow-faded"]: x.status === "On view" ? "rgba(138,154,91,0.06)" : "rgba(255,123,60,0.10)",
            border: "2px solid var(--paper)",
            zIndex: 1
          }} />
      </div>

      {/* title + meta */}
      <div style={{ paddingLeft: 24 }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 24,
          color: "var(--ink-1)",
          lineHeight: 1.15,
          letterSpacing: "-0.015em"
        }}>{x.title}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.06em", marginTop: 6 }}>
          {x.venue.toUpperCase()} · {x.city.toUpperCase()}
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, maxWidth: "60ch" }}>
          {x.blurb}
        </p>
      </div>

      {/* status + dates */}
      <div style={{ textAlign: "right" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 11.5, fontWeight: 500,
          color: dot.startsWith("var") ? "var(--ink-1)" : "var(--ink-3)",
          padding: "5px 11px",
          borderRadius: 999,
          background: x.status === "Past" ? "var(--paper-2)" : "var(--bone)",
          boxShadow: "inset 0 0 0 1px var(--mist)"
        }}>
          {x.status}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)", letterSpacing: "0.04em", marginTop: 10, lineHeight: 1.5 }}>
          {x.dates}
        </div>
      </div>
    </div>);

}

Object.assign(window, { Exhibitions });