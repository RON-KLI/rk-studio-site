// About — the artist page.
// Editorial layout, quiet density, one big paragraph of biography,
// a CV strip, and a sunrise-tinted portrait placeholder.

function About({ onInquire }) {
  return (
    <section className="page-enter about-pad" style={{ position: "relative", padding: "64px 32px 144px", maxWidth: 1280, margin: "0 auto" }}>
      <Eyebrow>About</Eyebrow>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(40px, 5vw, 76px)",
        lineHeight: 1.0,
        letterSpacing: "-0.03em",
        margin: "12px 0 56px",
        fontWeight: 400,
        maxWidth: "20ch"
      }}>
         <span style={{ fontStyle: "normal", color: "rgb(0, 0, 0)", fontFamily: "\"Instrument Serif\"" }}>I create art.</span>
      </h1>

      <div data-stack="sm" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 80, alignItems: "flex-start" }}>
        {/* Portrait */}
        <div className="about-portrait" style={{ position: "sticky", top: 100 }}>
          <PortraitPlate />
          <div style={{ marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.06em", lineHeight: 1.6 }}>
            <div>RON KLIMOVSKY</div>
            <div></div>
            <div></div>
            <div style={{ marginTop: 12 }}>STUDIO@RONKLIMOVSKY.COM</div>
          </div>
        </div>

        {/* Bio */}
        <div style={{ maxWidth: 620 }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 26, lineHeight: 1.4, letterSpacing: "-0.012em", color: "var(--ink-1)", margin: "0 0 28px" }}>I create art I want for myself that will last for my kids to remember me by.   

          </p>
          <div data-stack="sm-tight" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, columnGap: 36 }}>
            <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>
              I'm Ron (a.k.a. ARC), a multidisciplinary visual artist working mainly in the US. I'm curious and discreet by nature, and prefer to let the ideas and the work speak for themselves.
            </p>
            <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>
              I grew up in a family of second-generation gallerists, getting to see the art world from the inside. Surrounded by artists at home, I came to deeply understand how the art world works — or more precisely, why it doesn't.
            </p>
            <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>
              That's why my approach to art is radically different from the rest of the art world. I begin every thought about art through a first-principles approach.
            </p>
            <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>
              Ron Klimovsky Studio is my way of financing the creation of art, so I can make more and greater art.
            </p>
          </div>

          {/* CV */}
          <div style={{ marginTop: 64 }}>
            <Eyebrow style={{ marginBottom: 20 }}>Selected exhibitions</Eyebrow>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 0 }}>
              {[
              ["2026", "Rooms at dawn — open studio", "Tarrytown, NY"],
              ["2025", "Drawings, in conversation", "Galería Pequeña, Mexico City"],
              ["2025", "Interiors, 2018 — 2024", "Marta-Eve Project Space, Berlin"]].
              map(([y, t, p], i) =>
              <li key={i} style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr auto",
                alignItems: "baseline",
                padding: "16px 0",
                borderTop: i === 0 ? "1px solid var(--mist)" : "none",
                borderBottom: "1px solid var(--mist)",
                gap: 16
              }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" }}>{y}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, color: "var(--ink-1)", letterSpacing: "-0.005em" }}>{t}</span>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-3)" }}>{p}</span>
                </li>
              )}
            </ul>
          </div>

          <div style={{ marginTop: 56, display: "flex", gap: 10 }}>
            <PrimaryBtn onClick={onInquire} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <EnvelopeIcon size={13} /> Write to the studio
            </PrimaryBtn>
          </div>
        </div>
      </div>
    </section>);

}

function PortraitPlate() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
      <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", aspectRatio: "4/5", background: "var(--paper-2)", boxShadow: "var(--shadow-md)" }}>
        <img
          src="assets/studio-portrait.png"
          alt="Ron Klimovsky in the studio, 2024"
          loading="lazy"
          decoding="async"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
        
      </div>
      <div className="lg" style={{
        position: "absolute", left: 16, bottom: -22,
        padding: "10px 14px 10px 12px", borderRadius: 999,
        display: "inline-flex", alignItems: "center", gap: 10,
        fontSize: 12
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent-3, var(--sunrise))", boxShadow: "0 0 6px var(--accent-glow, rgba(255,123,60,0.5))" }} />
        <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14, color: "var(--ink-1)" }}>Studio Portrait, 2026</span>
      </div>
    </div>);

}

Object.assign(window, { About });