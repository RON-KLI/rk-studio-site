// ArtworkDetail — single work page.
// iOS 26 motifs:
//   - tinted glass panels that pick up the palette of the painting
//   - floating "Inquire" pill docked bottom-right
//   - related works dock at the bottom with squircle tiles

function ArtworkDetail({ work, onBack, onInquire, onSelect }) {
  if (!work) return null;
  const tint1 = work.palette && work.palette[0] || "#FFD4B8";
  const tint2 = work.palette && work.palette[1] || "#FF9A75";
  const tintDeep = work.palette && work.palette[3] || "#2A0A04";

  // related — same series, exclude self
  const related = window.ARTWORKS.filter((w) => w.id !== work.id && w.series === work.series).slice(0, 4);

  return (
    <section className="page-enter" style={{ position: "relative", paddingBottom: 140 }}>
      {/* Ambient tint behind the page */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 820,
        background:
          "radial-gradient(ellipse 90% 70% at 50% 0%, " +
            "var(--bone) 0%, " +
            "var(--bone) 20%, " +
            "var(--paper-2) 55%, " +
            "transparent 100%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div className="artwork-back-row" style={{ position: "relative", zIndex: 1, padding: "32px 32px 0", maxWidth: 1280, margin: "0 auto" }}>
        <button onClick={onBack} className="press ulink" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 0", color: "var(--ink-2)",
          fontFamily: "var(--font-ui)", fontSize: 13
        }}>
          <ArrowIcon size={13} dir="left" /> On view
        </button>
      </div>

      {/* Hero */}
      <div className="artwork-hero" data-stack="sm" style={{ position: "relative", zIndex: 1, padding: "32px 32px 80px", maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 80, alignItems: "center" }}>
        {/* Painting carousel */}
        <div style={{ position: "relative" }}>
          <div aria-hidden style={{
            position: "absolute",
            inset: "-8%",
            background: `radial-gradient(circle at 60% 50%, var(--bone) 0%, var(--paper-2) 40%, transparent 70%)`,
            filter: "blur(60px)",
            opacity: 0.9,
            zIndex: -1
          }} />
          <ArtworkCarousel work={work} tint1={tint1} tint2={tint2} tintDeep={tintDeep} />
        </div>

        {/* Meta */}
        <div>
          <Eyebrow style={{ marginBottom: 12 }}>{work.series} · {work.year}</Eyebrow>
          <h1 className="artwork-h1" style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(36px, 4.5vw, 64px)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            margin: 0,
            fontWeight: 400
          }}>{work.title}</h1>

          {/* Specs */}
          <div className="lg" style={{
            marginTop: 36,
            padding: "20px 24px",
            borderRadius: 22,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
            boxShadow: `var(--shadow-glass), inset 0 0 60px ${tint1}1A`
          }}>
            <SpecRow label="Medium" value={work.medium} />
            <SpecRow label="Year" value={String(work.year)} />
            <SpecRow label="Size" value={work.size_in} sub={work.size_cm} />
            <SpecRow label="Status" value={work.status} accent={work.status === "On view"} />
          </div>

          <p style={{ marginTop: 28, fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6, maxWidth: "40ch" }}>
            {work.note}
          </p>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 36, flexWrap: "wrap" }}>
            <PrimaryBtn onClick={() => onInquire(work)} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <EnvelopeIcon size={13} /> Inquire
            </PrimaryBtn>
            <GhostBtn onClick={() => onInquire({ ...work, intent: "home-rendering" })}>
              Request home rendering
            </GhostBtn>
          </div>
        </div>
      </div>


      {/* Related */}
      {related.length > 0 &&
      <div className="artwork-related" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, margin: 0, letterSpacing: "-0.02em" }}>View more</h2>
            </div>
          </div>
          <div className="artwork-related-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(related.length, 4)}, 1fr)`, gap: 18 }}>
            {related.map((r) =>
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className="lift press"
            style={{
              textAlign: "left",
              background: "var(--bone)",
              borderRadius: 18,
              overflow: "hidden",
              border: 0,
              padding: 16,
              cursor: "pointer",
              boxShadow: "var(--shadow-sm), 0 0 0 1px var(--mist)"
            }}>
            
                <Painting work={r} aspect="4/5" />
                <div style={{ padding: "14px 4px 2px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17, color: "var(--ink-1)", lineHeight: 1.15 }}>{r.title}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", marginTop: 6 }}>{r.medium.toUpperCase()} · {r.year}</div>
                </div>
              </button>
          )}
          </div>
        </div>
      }

      {/* Floating Inquire pill removed per request */}
    </section>);

}

function SpecRow({ label, value, sub, accent }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--ink-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{
        fontFamily: "var(--font-ui)",
        fontSize: 15,
        fontWeight: 500,
        color: accent ? "var(--status-positive)" : "var(--ink-1)",
        display: "inline-flex", alignItems: "center", gap: 6
      }}>
        {accent && <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--status-positive)", boxShadow: "0 0 0 3px rgba(138,154,91,0.18)" }} />}
        {value}
      </div>
      {sub && <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)", letterSpacing: "0.02em", marginTop: 2 }}>{sub}</div>}
    </div>);

}

Object.assign(window, { ArtworkDetail });

// ── ArtworkCarousel — paged image view with arrows, dots, and a thumbnail
// strip. Slides are: the finished painting, then three "studio wall" views
// (different framings + the in-progress stages).
function ArtworkCarousel({ work, tint1, tint2, tintDeep }) {
  const slides = React.useMemo(() => [
  { id: "final", label: "Final", caption: "On the studio wall, north light",
    work: work },
  { id: "detail", label: "Detail", caption: "Upper-right quadrant",
    work: { ...work, id: work.id + "-detail",
      grad: `linear-gradient(140deg, ${tint1} 0%, ${tint2} 60%, ${tintDeep}aa 100%)` } },
  { id: "day8", label: "Day 8", caption: "Window resolved",
    work: { ...work, id: work.id + "-day8",
      grad: `linear-gradient(160deg, ${tint1}cc 0%, ${tint2} 50%, ${tintDeep}aa 100%)` } },
  { id: "day2", label: "Day 2", caption: "Ground laid in",
    work: { ...work, id: work.id + "-day2",
      grad: `linear-gradient(160deg, #ECE5DB 0%, ${tint1}88 60%, ${tint2}99 100%)` } }],
  [work.id, tint1, tint2, tintDeep]);

  const [idx, setIdx] = React.useState(0);
  // reset when the work changes
  React.useEffect(() => {setIdx(0);}, [work.id]);

  const go = (n) => setIdx((n % slides.length + slides.length) % slides.length);
  const prev = () => go(idx - 1);
  const next = () => go(idx + 1);

  // keyboard
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, slides.length]);

  // swipe
  const touchRef = React.useRef(null);
  const onTouchStart = (e) => {touchRef.current = e.touches[0].clientX;};
  const onTouchEnd = (e) => {
    if (touchRef.current == null) return;
    const dx = e.changedTouches[0].clientX - touchRef.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchRef.current = null;
  };

  return (
    <div>
      {/* Stage */}
      <div
        className="artwork-carousel-stage"
        style={{ position: "relative", aspectRatio: "4/5", borderRadius: 4, overflow: "hidden" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}>
        
        {slides.map((s, i) =>
        <div key={s.id} style={{
          position: "absolute", inset: 0,
          opacity: i === idx ? 1 : 0,
          transform: i === idx ? "scale(1)" : "scale(1.015)",
          transition: "opacity 520ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: i === idx ? "auto" : "none"
        }}>
            <Painting work={s.work} aspect="4/5" />
          </div>
        )}

        {/* Caption capsule, bottom-left */}
        <div className="lg" style={{
          position: "absolute", left: 14, bottom: 14,
          padding: "8px 14px", borderRadius: 999,
          display: "inline-flex", alignItems: "center", gap: 10,
          fontFamily: "var(--font-ui)", fontSize: 12,
          color: "var(--ink-1)"
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)" }}>
            {idx + 1} / {slides.length}
          </span>
          <span style={{ width: 1, height: 12, background: "var(--mist, #E6DED2)" }} />
          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14 }}>
            {slides[idx].caption}
          </span>
        </div>

        {/* Arrows */}
        <button onClick={prev} aria-label="Previous" className="lg press" style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          width: 40, height: 40, borderRadius: 999, border: 0, cursor: "pointer",
          display: "grid", placeItems: "center", color: "var(--ink-1)"
        }}><ArrowIcon size={14} dir="left" /></button>
        <button onClick={next} aria-label="Next" className="lg press" style={{
          position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
          width: 40, height: 40, borderRadius: 999, border: 0, cursor: "pointer",
          display: "grid", placeItems: "center", color: "var(--ink-1)"
        }}><ArrowIcon size={14} dir="right" /></button>
      </div>

      {/* Thumbnail strip */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${slides.length}, 1fr)`, gap: 10, marginTop: 14 }}>
        {slides.map((s, i) =>
        <button key={s.id} onClick={() => go(i)} aria-label={s.label} style={{
          background: "transparent", border: 0, padding: 0, cursor: "pointer",
          textAlign: "left"
        }}>
            <div style={{
            aspectRatio: "4/5", borderRadius: 8,
            background: s.work.grad,
            boxShadow: i === idx ?
            "0 0 0 2px var(--sunrise), inset 0 0 0 1px rgba(0,0,0,0.04)" :
            "inset 0 0 0 1px rgba(0,0,0,0.06)",
            opacity: i === idx ? 1 : 0.78,
            transition: "opacity 220ms ease, box-shadow 220ms ease"
          }} />
          </button>
        )}
      </div>
    </div>);

}

Object.assign(window, { ArtworkCarousel });