// OnView — gallery grid of artworks.
// iOS 26 touches:
//   - filter chips dock as glass capsule on scroll
//   - cards have a tinted glow that picks up the painting's palette on hover
//   - "show only on view" toggle uses spring motion

function OnView({ onSelect, onInquire }) {
  const [filter, setFilter] = React.useState("all");
  const [view, setView] = React.useState("all"); // toggle removed; show all works
  const scrolled = useScroll() > 320;

  const works = window.ARTWORKS.filter((w) => {
    if (view === "on-view" && w.status !== "On view") return false;
    if (filter === "paintings" && !w.medium.toLowerCase().includes("oil")) return false;
    if (filter === "drawings" && !(w.medium.toLowerCase().includes("graphite") || w.medium.toLowerCase().includes("charcoal"))) return false;
    if (filter === "rooms" && w.series !== "Rooms at dawn") return false;
    if (filter === "interiors" && w.series !== "Interiors") return false;
    return true;
  });

  return (
    <section className="page-enter onview-pad" style={{ position: "relative", padding: "64px 32px 144px", maxWidth: 1280, margin: "0 auto" }}>
      {/* Page header */}
      <header className="onview-header" style={{ marginBottom: 56 }}>
        <Eyebrow>On view · 2026-7</Eyebrow>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 12, gap: 32, flexWrap: "wrap" }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 5vw, 76px)",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            margin: 0,
            fontWeight: 400,
            maxWidth: "16ch"
          }}>
            Currently in <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}>the studio</em>
          </h1>
        </div>
      </header>

      {/* Inline filter row */}
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", marginBottom: 40, opacity: scrolled ? 0 : 1, transform: scrolled ? "translateY(-8px)" : "translateY(0)", transition: "all 320ms var(--ease-out)" }}>
        <FilterChips value={filter} onChange={setFilter} />
      </div>

      {/* Floating glass dock — appears on scroll */}
      <div
        className="onview-filter-dock"
        style={{
          position: "fixed",
          left: 0, right: 0, top: 88,
          display: "flex", justifyContent: "center",
          pointerEvents: scrolled ? "auto" : "none",
          zIndex: 70,
          opacity: scrolled ? 1 : 0,
          transform: scrolled ? "translateY(0)" : "translateY(-12px)",
          transition: "all 420ms var(--ease-spring)"
        }}>
        
        <div className="lg-strong" style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "8px 8px 8px 16px",
          borderRadius: 999
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
            {works.length} works
          </span>
          <FilterChips value={filter} onChange={setFilter} compact />
        </div>
      </div>

      {/* Grid */}
      <div className="onview-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "var(--grid-gap, 32px)"
      }}>
        {works.map((w, i) =>
        <ArtworkCard key={w.id} work={w} index={i} onClick={() => onSelect(w)} onInquire={onInquire} />
        )}
      </div>

      {works.length === 0 &&
      <div style={{ padding: "80px 0", textAlign: "center", color: "var(--ink-3)", fontStyle: "italic", fontFamily: "var(--font-display)", fontSize: 20 }}>
          Nothing in this room, at the moment.
        </div>
      }
    </section>);

}

function FilterChips({ value, onChange, compact = false }) {
  const opts = [
  ["all", "All"],
  ["paintings", "Paintings"],
  ["rooms", "Sculptures"],
  ["interiors", "Installations"]];

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {opts.map(([id, label]) =>
      <button
        key={id}
        onClick={() => onChange(id)}
        className="press"
        style={{
          padding: compact ? "6px 12px" : "8px 14px",
          borderRadius: 999,
          border: 0,
          cursor: "pointer",
          fontFamily: "var(--font-ui)",
          fontSize: compact ? 12 : 13,
          fontWeight: 500,
          whiteSpace: "nowrap",
          background: value === id ? "var(--ink-1)" : compact ? "transparent" : "var(--bone)",
          color: value === id ? "var(--bone)" : "var(--ink-2)",
          boxShadow: value === id ? "var(--shadow-sm)" : compact ? "none" : "inset 0 0 0 1px var(--mist)",
          transition: "all 240ms var(--ease-out)"
        }}>
        
          {label}
        </button>
      )}
    </div>);

}

function ToggleChips({ value, onChange, options }) {
  return (
    <div style={{ display: "flex", gap: 4, padding: 3, borderRadius: 999, background: "var(--paper-2)", boxShadow: "inset 0 0 0 1px var(--mist)" }}>
      {options.map(([id, label]) =>
      <button
        key={id}
        onClick={() => onChange(id)}
        className="press"
        style={{
          padding: "6px 14px",
          borderRadius: 999,
          border: 0,
          background: value === id ? "var(--bone)" : "transparent",
          boxShadow: value === id ? "var(--shadow-xs)" : "none",
          color: value === id ? "var(--ink-1)" : "var(--ink-3)",
          cursor: "pointer",
          fontFamily: "var(--font-ui)",
          fontSize: 12.5,
          fontWeight: 500,
          transition: "all 220ms var(--ease-out)"
        }}>
        
          {label}
        </button>
      )}
    </div>);

}

function ArtworkCard({ work, index, onClick, onInquire }) {
  const [hover, setHover] = React.useState(false);
  const tint = work.palette[1] + "40"; // tinted glass picks up palette
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="lift"
      style={{
        textAlign: "left",
        background: "var(--bone)",
        borderRadius: 22,
        overflow: "hidden",
        border: 0,
        padding: 0,
        cursor: "pointer",
        fontFamily: "var(--font-ui)",
        position: "relative",
        boxShadow: hover ?
        `var(--shadow-md), 0 0 0 1px var(--mist), 0 30px 60px -20px ${tint}` :
        "var(--shadow-sm), 0 0 0 1px var(--mist)"
      }}>
      
      <div style={{ padding: "var(--card-pad, 24px) var(--card-pad, 24px) 0" }}>
        <div style={{
          position: "relative",
          transition: "transform 600ms var(--ease-out)",
          transform: hover ? "translateY(-4px)" : "translateY(0)"
        }}>
          <Painting work={work} aspect="4/5" />
        </div>
      </div>

      <div style={{ padding: "20px var(--card-pad, 24px) var(--card-pad, 24px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, marginBottom: 8 }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 22,
            lineHeight: 1.1,
            color: "var(--ink-1)",
            letterSpacing: "-0.01em"
          }}>{work.title}</div>
          <span style={{
            flex: "0 0 auto",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.08em",
            color: "var(--ink-3)"
          }}>№ {String(index + 1).padStart(2, "0")}</span>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.04em", marginBottom: 16 }}>
          {work.medium.toUpperCase()} · {work.size_in.toUpperCase()} · {work.year}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <StatusBadge status={work.status} />
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 500, color: "var(--ink-1)",
            opacity: hover ? 1 : 0.7,
            transform: hover ? "translateX(2px)" : "translateX(0)",
            transition: "all 280ms var(--ease-out)"
          }}>
            View work <ArrowIcon size={12} />
          </span>
        </div>
      </div>
    </button>);

}

function StatusBadge({ status }) {
  const onView = status === "On view";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      fontFamily: "var(--font-ui)",
      fontSize: 11,
      fontWeight: 500,
      color: onView ? "var(--status-positive)" : "var(--ink-3)"
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 999,
        background: onView ? "var(--status-positive)" : "var(--ink-4)",
        boxShadow: onView ? "0 0 0 3px rgba(138,154,91,0.18)" : "none"
      }} />
      {status}
    </span>);

}

Object.assign(window, { OnView, FilterChips, StatusBadge });