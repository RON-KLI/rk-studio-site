function Footer({ onNav }) {
  return (
    <footer className="footer-pad" style={{
      position: "relative",
      marginTop: 96,
      padding: "72px 32px 36px",
      background: "var(--paper-2)",
      borderTop: "1px solid var(--mist)"
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 48, alignItems: "flex-start" }}>
          <div style={{ maxWidth: 380 }}>
            <div className="footer-monogram" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 44, color: "var(--ink-1)", letterSpacing: "-0.025em", lineHeight: 0.95, fontWeight: 400 }}>
              Ron Klimovsky<br />Studio
            </div>
            <p style={{ marginTop: 18, fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.6, maxWidth: "36ch" }}>I make things I want to exist and sell them to make more things I want to exist 

            </p>
          </div>

          <FooterCol title="Studio">
            <FooterLink onClick={() => onNav("home")}>Home</FooterLink>
            <FooterLink onClick={() => onNav("onview")}>On view</FooterLink>
            <FooterLink onClick={() => onNav("exhibitions")}>Exhibitions</FooterLink>
            <FooterLink onClick={() => onNav("about")}>About</FooterLink>
          </FooterCol>

          <FooterCol title="Contact">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)", letterSpacing: "0.04em", lineHeight: 1.8 }}>
              <div>studio@ronklimovsky.com</div>
              <div>+1 908 906 7615
(its my personal phone number,
please don't be spam)
</div>
              <div style={{ marginTop: 12, color: "var(--ink-3)" }}>somewhere on earth</div>
            </div>
          </FooterCol>
        </div>

        <div className="footer-bottom" style={{ marginTop: 64, paddingTop: 24, borderTop: "1px solid var(--mist)", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", gap: 16, flexWrap: "wrap" }}>
          <div>© 2026 RON KLIMOVSKY · ALL RIGHTS RESERVED</div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span>BANANAS AND STRAWBERRIES MIX WELL</span>
            <button onClick={() => onNav("admin")} style={{
              background: "transparent", border: 0, padding: 0, cursor: "pointer",
              fontFamily: "var(--font-mono)", letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: 0.6, transition: "opacity 220ms ease, color 220ms ease", color: "rgb(249, 228, 214)", fontWeight: "100", fontSize: "3px"
            }}
            onMouseEnter={(e) => {e.currentTarget.style.opacity = "1";e.currentTarget.style.color = "var(--sunrise)";}}
            onMouseLeave={(e) => {e.currentTarget.style.opacity = "0.6";e.currentTarget.style.color = "var(--ink-4, var(--ink-3))";}}
            title="Studio backstage — private">Admin ·</button>
          </div>
        </div>
      </div>
    </footer>);}function FooterCol({ title, children }) {return <div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>{title}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {React.Children.map(children, (c) => <li style={{ fontFamily: "\"Inter Tight\"" }}>{c}</li>)}
      </ul>
    </div>;

}

function FooterLink({ children, onClick }) {
  return (
    <button onClick={onClick} className="ulink" style={{
      background: "none", border: 0, padding: 0,
      fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 400,
      color: "var(--ink-2)", cursor: "pointer", textAlign: "left"
    }}>{children}</button>);

}

Object.assign(window, { Footer });