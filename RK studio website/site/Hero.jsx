// Hero — three variants picked via the Tweaks panel.
//   - "centered": single full-bleed work, sunrise glow behind
//   - "editorial": asymmetric — display type left, painting floats right
//   - "stack":    liquid-glass card stack revealing the most recent painting

function Hero({ variant = "centered", onCta, onInquire, onSignup, onView }) {
  if (variant === "editorial") return <HeroEditorial onCta={onCta} onInquire={onInquire} onSignup={onSignup} onView={onView} />;
  if (variant === "stack") return <HeroStack onCta={onCta} onInquire={onInquire} onSignup={onSignup} onView={onView} />;
  return <HeroCentered onCta={onCta} onInquire={onInquire} onSignup={onSignup} onView={onView} />;
}

// ── Centered ────────────────────────────────────────────────────────────────
function HeroCentered({ onCta, onInquire, onSignup, onView }) {
  const works = window.ARTWORKS.slice(0, 5);
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((n) => (n + 1) % works.length), 5200);
    return () => clearInterval(t);
  }, [paused, works.length]);
  const prev = () => setIdx((n) => (n - 1 + works.length) % works.length);
  const next = () => setIdx((n) => (n + 1) % works.length);
  return (
    <section className="page-enter hero-centered" style={{ position: "relative", padding: "72px 24px 120px", maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      {/* Full-bleed background image — user-droppable. Fades into --paper at the bottom
          so the artwork carousel below sits on clean paper. */}
      <div
        aria-hidden
        className="hero-bg-bleed"
        style={{
          position: "absolute",
          top: -120,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          maxWidth: "100vw",
          height: 860,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none"
        }}>
        {/* The image-slot itself is masked: fully opaque at top, dissolving to
            zero alpha over the bottom ~55% of the frame. Because the alpha is
            on the image itself (not a paper-colored overlay), the handoff to
            whatever sits behind it is perfectly seamless — no banding, no edge,
            no visible cutoff. */}
        <image-slot
          id="hero-bg-sunrise"
          src="assets/hero-sunrise.jpg"
          placeholder="Drop a wide studio photo — wall, light, work-in-progress"
          shape="rect"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            "--image-slot-bg": "transparent",
            "--image-slot-border": "0",
            pointerEvents: "auto",
            WebkitMaskImage:
              "linear-gradient(to bottom, " +
              "rgba(0,0,0,1) 0%, " +
              "rgba(0,0,0,1) 38%, " +
              "rgba(0,0,0,0.92) 52%, " +
              "rgba(0,0,0,0.72) 64%, " +
              "rgba(0,0,0,0.46) 76%, " +
              "rgba(0,0,0,0.22) 86%, " +
              "rgba(0,0,0,0.08) 93%, " +
              "rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(to bottom, " +
              "rgba(0,0,0,1) 0%, " +
              "rgba(0,0,0,1) 38%, " +
              "rgba(0,0,0,0.92) 52%, " +
              "rgba(0,0,0,0.72) 64%, " +
              "rgba(0,0,0,0.46) 76%, " +
              "rgba(0,0,0,0.22) 86%, " +
              "rgba(0,0,0,0.08) 93%, " +
              "rgba(0,0,0,0) 100%)"
          }}>
        </image-slot>
        {/* Whisper-thin paper haze across the upper half so type stays legible
            without darkening the image — feathered, no visible boundary. */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(251,248,244,0.45) 0%, rgba(251,248,244,0.16) 32%, rgba(251,248,244,0) 58%)",
          pointerEvents: "none"
        }} />
      </div>

      {/* sunrise glow — kept as a soft halo behind the headline */}
      <div aria-hidden style={{
        position: "absolute",
        top: -40, left: "50%", transform: "translateX(-50%)",
        width: 820, height: 600, borderRadius: "50%",
        background: "radial-gradient(ellipse at center, rgba(255,254,251,0.65) 0%, rgba(244,239,232,0.35) 40%, transparent 70%)",
        filter: "blur(80px)",
        opacity: 0.9,
        pointerEvents: "none",
        zIndex: 0
      }} />

      <h1 style={{
        position: "relative", zIndex: 1,
        marginTop: 44,
        fontFamily: "var(--font-display)",
        fontSize: "clamp(39px, 5.6vw, 90px)",
        lineHeight: 1.0,
        letterSpacing: "-0.035em",
        margin: 0,
        fontWeight: 400,
        maxWidth: "16ch",
        textWrap: "balance"
      }}>
        Creating <em className="hero-art-gradient" style={{ fontStyle: "italic", fontSize: "70px", fontWeight: "100" }}>Art.
        </em><br />
        <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}></em>
      </h1>

      <style>{`
        .hero-art-gradient {
          display: inline-block;
          padding: 0.18em 0.32em 0.22em 0.4em;
          margin: -0.18em -0.32em -0.22em -0.4em;
          background-image: linear-gradient(
            100deg,
            var(--sunrise-soft) 0%,
            var(--gold-cream) 18%,
            var(--sunrise) 36%,
            var(--dawn-peach) 52%,
            var(--dawn-mauve) 68%,
            var(--amber) 84%,
            var(--sunrise-soft) 100%
          );
          background-size: 280% 100%;
          background-position: 0% 50%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: heroArtShift 36s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate;
        }
        @keyframes heroArtShift {
          0%   { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-art-gradient { animation: none; background-position: 30% 50%; }
        }
      `}</style>

      <p style={{ position: "relative", zIndex: 1, fontSize: 18, color: "var(--ink-2)", maxWidth: "44ch", marginTop: 44, lineHeight: 1.55, fontFamily: "\"Instrument Serif\"" }}>I could explain but its better if you just look for yourself...

      </p>

      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 10, marginTop: 36 }}>
        <PrimaryBtn onClick={onCta}>See what's on view</PrimaryBtn>
        <GhostBtn onClick={onSignup}>Sign up for updates</GhostBtn>
      </div>

      {/* Featured painting carousel */}
      <FeaturedCarousel
        works={works}
        idx={idx}
        onPrev={prev}
        onNext={next}
        onSelect={setIdx}
        onView={onView}
        onHover={(v) => setPaused(v)} />

      {/* Lately in the studio — recent work strip with see-more link */}
      <LatelyInTheStudio onSeeMore={onCta} onView={onView} />

      {/* Inline updates signup — name + phone */}
      <UpdatesInlineSignup />
    </section>);
}

// FeaturedCarousel — fades through the studio's top works with arrows + dots.
function FeaturedCarousel({ works, idx, onPrev, onNext, onSelect, onHover, onView }) {
  const work = works[idx];
  return (
    <div
      style={{ position: "relative", zIndex: 1, marginTop: 140, width: "min(820px, 92%)", display: "flex", flexDirection: "column", alignItems: "center" }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}>
      <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CarouselArrow dir="left" onClick={onPrev} ariaLabel="Previous work" />

        <div className="lift" style={{ position: "relative", width: "100%", maxWidth: 448 }}>
          <button
            onClick={() => onView && onView(work)}
            aria-label={`Open ${work.title}`}
            className="press"
            style={{
              position: "relative", aspectRatio: "5/6", width: "100%",
              background: "transparent", border: 0, padding: 0,
              cursor: onView ? "pointer" : "default",
              display: "block"
            }}>
            {works.map((w, i) =>
            <div
              key={w.id}
              aria-hidden={i !== idx}
              style={{
                position: "absolute", inset: 0,
                opacity: i === idx ? 1 : 0,
                transform: i === idx ? "scale(1)" : "scale(0.985)",
                transition: "opacity 700ms var(--ease-out), transform 700ms var(--ease-out)",
                pointerEvents: i === idx ? "auto" : "none"
              }}>
                <Painting work={w} aspect="5/6" />
              </div>
            )}
          </button>

          <div key={work.id} className="lg-strong" style={{
            position: "absolute",
            left: "50%", bottom: -28,
            transform: "translateX(-50%)",
            padding: "12px 18px 12px 16px",
            borderRadius: 999,
            display: "flex", alignItems: "center", gap: 14,
            whiteSpace: "nowrap",
            boxShadow: "var(--shadow-lg)",
            animation: "fadeInUp 500ms var(--ease-out) both"
          }}>
            <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17, color: "var(--ink-1)" }}>{work.title}</span>
            <span style={{ width: 1, height: 14, background: "var(--mist)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)", letterSpacing: "0.06em" }}>{work.medium.toUpperCase()} · {work.year}</span>
          </div>
        </div>

        <CarouselArrow dir="right" onClick={onNext} ariaLabel="Next work" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 56 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
          {String(idx + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
          {works.map((w, i) =>
          <button
            key={w.id}
            onClick={() => onSelect(i)}
            aria-label={`Show ${w.title}`}
            className="press"
            style={{
              width: i === idx ? 24 : 6,
              height: 6,
              padding: 0,
              border: 0,
              borderRadius: 999,
              background: i === idx ? "var(--ink-1)" : "var(--mist)",
              cursor: "pointer",
              transition: "width 380ms var(--ease-out), background 220ms var(--ease-out)"
            }} />
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>);
}

function CarouselArrow({ dir, onClick, ariaLabel }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        [dir]: -8,
        transform: "translateY(-50%)",
        zIndex: 3,
        pointerEvents: "none"
      }}>
      <button
        onClick={(e) => {
          if (window.pressAnim) window.pressAnim(e.currentTarget);
          onClick && onClick(e);
        }}
        aria-label={ariaLabel}
        className="lg press carousel-arrow"
        style={{
          pointerEvents: "auto",
          width: 48, height: 48,
          borderRadius: 999,
          border: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--ink-1)",
          cursor: "pointer",
          boxShadow: "var(--shadow-md)"
        }}>
        <ArrowIcon size={16} dir={dir} />
      </button>
    </div>);
}

// UpdatesInlineSignup — in-page CTA: "Get updates when I make something
// worth humanity's time." Name + phone, single-line on desktop.
// LatelyInTheStudio — a quiet strip of recent work below the carousel.
// Four newer pieces, each clickable to navigate into the on-view page.
// Hover lifts the card and steps up the shadow; the "see all" link
// underlines from the left, matching the rest of the site's link motion.
function LatelyInTheStudio({ onSeeMore, onView }) {
  // Newest works that aren't already in the featured carousel above.
  const lately = window.ARTWORKS.slice(5, 9);
  return (
    <section
      aria-label="Lately in the studio"
      style={{
        position: "relative",
        zIndex: 1,
        marginTop: 120,
        width: "min(1120px, 94%)",
        textAlign: "left"
      }}>
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 24,
        marginBottom: 36,
        flexWrap: "wrap"
      }}>
        <div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 3.4vw, 44px)",
            lineHeight: 1.08,
            letterSpacing: "-0.022em",
            margin: 0,
            fontWeight: 400,
            color: "var(--ink-1)",
            textWrap: "balance"
          }}>
            Lately, <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}>in the studio.</em>
          </h2>
        </div>
        <button
          onClick={onSeeMore}
          className="press lately-see-all"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 0",
            background: "transparent",
            border: 0,
            color: "var(--ink-1)",
            fontFamily: "var(--font-ui)",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "0.01em",
            cursor: "pointer"
          }}>
          See everything on view
          <span aria-hidden style={{ display: "inline-flex", transition: "transform 220ms var(--ease-out)" }} className="lately-arrow">
            <ArrowIcon size={14} dir="right" />
          </span>
        </button>
      </div>

      <div className="lately-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 28,
        textAlign: "left"
      }}>
        {lately.map((w, i) =>
          <button
            key={w.id}
            onClick={() => onView ? onView(w) : onSeeMore && onSeeMore()}
            aria-label={`Open ${w.title}`}
            className="lately-card press"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              padding: 0,
              background: "transparent",
              border: 0,
              textAlign: "left",
              cursor: "pointer",
              animation: `lateFadeUp 600ms var(--ease-out) ${i * 70}ms both`
            }}>
            <div className="lately-frame" style={{
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
              transition: "transform 420ms var(--ease-out), box-shadow 420ms var(--ease-out)"
            }}>
              <Painting work={w} aspect="4/5" frame={false} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 17,
                lineHeight: 1.2,
                color: "var(--ink-1)",
                textWrap: "balance"
              }}>{w.title}</span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-3)"
              }}>{w.medium} · {w.year}</span>
            </div>
          </button>
        )}
      </div>

      <style>{`
        .lately-card:hover .lately-frame {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        .lately-see-all { position: relative; }
        .lately-see-all::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          height: 1px;
          width: 100%;
          background: var(--ink-1);
          transform-origin: left center;
          transform: scaleX(0);
          transition: transform 220ms var(--ease-out);
        }
        .lately-see-all:hover::after { transform: scaleX(1); }
        .lately-see-all:hover .lately-arrow { transform: translateX(3px); }
        @keyframes lateFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 880px) {
          .lately-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; }
        }
        @media (max-width: 520px) {
          .lately-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>);
}

function UpdatesInlineSignup() {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [sent, setSent] = React.useState(false);

  return (
    <div style={{ position: "relative", zIndex: 1, marginTop: 120, width: "min(820px, 94%)", textAlign: "center" }}>
      <Eyebrow style={{ marginBottom: 16 }}>Studio updates</Eyebrow>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(28px, 3.4vw, 44px)",
        lineHeight: 1.08,
        letterSpacing: "-0.022em",
        margin: 0,
        fontWeight: 400,
        color: "var(--ink-1)",
        textWrap: "balance"
      }}>
        Get updates when I make something <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}>worth humanity's time.</em>
      </h2>
      <p style={{ fontSize: 15, color: "var(--ink-3)", lineHeight: 1.6, marginTop: 16, marginBottom: 32, maxWidth: "44ch", marginLeft: "auto", marginRight: "auto" }}>

      </p>

      {sent ?
      <div className="lg-strong" style={{
        display: "inline-flex", alignItems: "center", gap: 12,
        padding: "14px 22px",
        borderRadius: 999,
        fontFamily: "var(--font-ui)",
        fontSize: 14,
        color: "var(--ink-1)",
        animation: "signupSent 420ms var(--ease-spring) both"
      }}>
          <span style={{
          width: 22, height: 22, borderRadius: 999,
          background: "var(--ink-1)", color: "var(--bone)",
          display: "inline-flex", alignItems: "center", justifyContent: "center"
        }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
          </span>
          <span>You're on the list. I'll write when it's worth your time.</span>
        </div> :
      <form
        onSubmit={(e) => {e.preventDefault();setSent(true);}}
        className="lg-strong"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 6,
          padding: 8,
          borderRadius: 999,
          margin: "0 auto",
          maxWidth: 680,
          textAlign: "left"
        }}>
          <InlineField label="Name" value={name} onChange={setName} type="text" autoComplete="name" placeholder="Your name" grow={1} required />
          <span style={{ width: 1, height: 28, background: "var(--mist)", flex: "0 0 auto" }} aria-hidden />
          <InlineField
            label="Phone"
            value={phone}
            onChange={setPhone}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+1 555 000 0000"
            grow={1.1}
            pattern="\+?[\d][\d\s().\-]{6,19}"
            title="Enter a valid phone number with at least 7 digits — e.g. +1 555 000 0000"
            required />
          <PrimaryBtn type="submit" style={{ padding: "14px 22px", fontSize: 14, flex: "0 0 auto", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <EnvelopeIcon size={13} /> Notify me
          </PrimaryBtn>
        </form>
      }
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 18 }}>

      </p>
      <style>{`
        @keyframes signupSent {
          0% { opacity: 0; transform: translateY(8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>);
}

function InlineField({ label, value, onChange, type = "text", autoComplete, placeholder, grow = 1, pattern, title, inputMode, required = false }) {
  const id = React.useId();
  return (
    <label htmlFor={id} style={{
      display: "flex", flexDirection: "column",
      flex: `${grow} 1 180px`,
      padding: "6px 18px",
      cursor: "text"
    }}>
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9.5,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--ink-3)"
      }}>{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        pattern={pattern}
        title={title}
        required={required}
        aria-required={required || undefined}
        style={{
          background: "transparent",
          border: 0,
          outline: "none",
          padding: "4px 0 2px",
          fontFamily: "var(--font-ui)",
          fontSize: 15,
          color: "var(--ink-1)",
          width: "100%"
        }} />
    </label>);
}

// ── Editorial ───────────────────────────────────────────────────────────────
function HeroEditorial({ onCta, onInquire }) {
  const featured = window.ARTWORKS[2]; // "Hours, before noon"
  return (
    <section className="page-enter hero-pad" style={{ position: "relative", padding: "60px 32px 120px", maxWidth: 1280, margin: "0 auto" }}>
      <div className="hero-min-h" data-stack="sm" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 64, alignItems: "center", minHeight: "min(720px, 80vh)" }}>
        {/* left — type */}
        <div style={{ position: "relative" }}>
          <div style={{ marginBottom: 28 }}><StatusPill /></div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 6.5vw, 108px)",
            lineHeight: 0.96,
            letterSpacing: "-0.035em",
            margin: 0,
            fontWeight: 400,
            textWrap: "balance"
          }}>
            The room is<br />
            <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}>the painting.</em>
          </h1>
          <p style={{ fontSize: 18, color: "var(--ink-2)", maxWidth: "40ch", marginTop: 28, lineHeight: 1.55 }}>
            Nine oil paintings, made over fourteen months in a studio above an old pharmacy. The light there is the subject; the room is incidental, and not.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 36 }}>
            <PrimaryBtn onClick={onCta}>See the series</PrimaryBtn>
            <GhostBtn onClick={onInquire}>Inquire</GhostBtn>
          </div>
        </div>

        {/* right — painting */}
        <div style={{ position: "relative" }}>
          <div aria-hidden style={{
            position: "absolute",
            inset: "-10% -10% -10% -10%",
            background: "radial-gradient(circle at 60% 40%, var(--bone) 0%, var(--paper-2) 40%, transparent 70%)",
            filter: "blur(60px)",
            opacity: 0.9,
            zIndex: 0
          }} />
          <div style={{ position: "relative", zIndex: 1, transform: "rotate(-1.2deg)" }}>
            <Painting work={featured} aspect="3/4" />
          </div>
          {/* hovering caption */}
          <div className="lg-strong" style={{
            position: "absolute",
            left: -32, bottom: 36,
            padding: "14px 18px",
            borderRadius: 22,
            maxWidth: 240,
            zIndex: 2
          }}>
            <Eyebrow style={{ marginBottom: 4 }}>Currently painting</Eyebrow>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, lineHeight: 1.15, color: "var(--ink-1)" }}>
              {featured.title}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)", marginTop: 6, letterSpacing: "0.04em" }}>
              {featured.medium.toUpperCase()} · {featured.size_in.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </section>);

}

// ── Stack (liquid-glass card stack) ─────────────────────────────────────────
function HeroStack({ onCta, onInquire }) {
  const works = window.ARTWORKS.slice(0, 4);
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setActive((n) => (n + 1) % works.length), 5400);
    return () => clearInterval(t);
  }, [works.length]);

  return (
    <section className="page-enter hero-pad" style={{ position: "relative", padding: "60px 32px 120px", maxWidth: 1280, margin: "0 auto" }}>
      <div className="hero-min-h" data-stack="sm" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "center", minHeight: "min(720px, 80vh)" }}>
        <div>
          <div style={{ marginBottom: 28 }}><StatusPill /></div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 6vw, 96px)",
            lineHeight: 0.97,
            letterSpacing: "-0.035em",
            margin: 0,
            fontWeight: 400,
            textWrap: "balance"
          }}>
            A studio,<br />
            <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}>quietly working.</em>
          </h1>
          <p style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: "42ch", marginTop: 24, lineHeight: 1.55 }}>
            Below: the four paintings currently on the wall. They will be photographed once, and then the wall will hold something else.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 32 }}>
            <PrimaryBtn onClick={onCta}>Browse on view</PrimaryBtn>
            <GhostBtn onClick={onInquire}>Inquire</GhostBtn>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 40 }}>
            {works.map((w, i) =>
            <button
              key={w.id}
              onClick={() => setActive(i)}
              className="press"
              aria-label={w.title}
              style={{
                position: "relative",
                width: 56, height: 72,
                borderRadius: 6,
                background: w.grad,
                border: 0,
                cursor: "pointer",
                outline: i === active ? "2px solid var(--ink-1)" : "1px solid var(--mist)",
                outlineOffset: i === active ? 4 : 0,
                transition: "all 320ms var(--ease-out)",
                opacity: i === active ? 1 : 0.75
              }} />

            )}
          </div>
        </div>

        {/* Stack */}
        <div style={{ position: "relative", height: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {works.map((w, i) => {
            const offset = i - active;
            const z = works.length - Math.abs(offset);
            return (
              <div
                key={w.id}
                onClick={() => setActive(i)}
                style={{
                  position: "absolute",
                  width: 360,
                  transform: `translate(${offset * 28}px, ${Math.abs(offset) * 12}px) rotate(${offset * 1.5}deg) scale(${1 - Math.abs(offset) * 0.05})`,
                  zIndex: z,
                  opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.18,
                  transition: "all 600ms var(--ease-spring)",
                  cursor: i === active ? "default" : "pointer"
                }}>
                
                <Painting work={w} aspect="3/4" />
              </div>);

          })}
          {/* glowing aura behind stack */}
          <div aria-hidden style={{
            position: "absolute",
            inset: "-10%",
            background: `radial-gradient(circle at center, var(--bone) 0%, var(--paper-2) 40%, transparent 65%)`,
            filter: "blur(60px)",
            opacity: 0.9,
            zIndex: -1
          }} />
        </div>
      </div>
    </section>);

}

Object.assign(window, { Hero });