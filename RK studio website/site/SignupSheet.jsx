// SignupSheet — liquid-glass sheet for studio-update sign-ups.
// Mirrors InquireSheet's iOS 26 motion + chrome, with name / email / phone.

function SignupSheet({ open, onClose }) {
  const [mounted, setMounted] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      setSent(false);
      document.body.style.overflow = "hidden";
    } else {
      const t = setTimeout(() => setMounted(false), 320);
      document.body.style.overflow = "";
      return () => clearTimeout(t);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      onClick={onClose}
      className="signup-scrim"
      style={{
        position: "fixed", inset: 0,
        background: open ? "rgba(26,20,16,0.25)" : "transparent",
        backdropFilter: open ? "saturate(180%) blur(28px)" : "saturate(100%) blur(0px)",
        WebkitBackdropFilter: open ? "saturate(180%) blur(28px)" : "saturate(100%) blur(0px)",
        zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        transition: "all 320ms var(--ease-out)"
      }}>
      
      <div
        onClick={(e) => e.stopPropagation()}
        className="lg-strong"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 540,
          borderRadius: 32,
          overflow: "hidden",
          background: "var(--glass-bg-strong)",
          boxShadow: "var(--shadow-xl)",
          fontFamily: "var(--font-ui)",
          transform: open ? "scale(1) translateY(0)" : "scale(0.96) translateY(8px)",
          opacity: open ? 1 : 0,
          transition: "all 420ms var(--ease-spring)"
        }}>
        <div
          className="thin-scroll"
          style={{
            maxHeight: "calc(100vh - 48px)",
            overflow: "auto",
            padding: 36,
            borderRadius: "inherit"
          }}>
        
        <button
          onClick={onClose}
          aria-label="Close"
          className="press"
          style={{
            position: "absolute", top: 18, right: 18,
            width: 36, height: 36, borderRadius: 999,
            background: "var(--paper-2)", border: 0,
            color: "var(--ink-2)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
          
          <CloseIcon size={16} />
        </button>

        {sent ? <SignupSent onClose={onClose} /> :
        <>
            <Eyebrow style={{ marginBottom: 10 }}>Studio updates</Eyebrow>
            <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 34,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "var(--ink-1)"
          }}>
              Hear from the studio, <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}>quietly.</em>
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6, margin: "16px 0 28px", maxWidth: "44ch" }}>We send emails when something great is done and worth your time, and when I feel like it :)

          </p>

            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="sheet-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ gridColumn: "span 2" }}>
                <Field label="Your name" placeholder="" autoComplete="name" required />
              </div>
              <Field
                label="Email"
                type="email"
                placeholder="you@domain.com"
                autoComplete="email"
                inputMode="email"
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                title="Enter a valid email address, e.g. name@domain.com"
                required />
              <Field
                label="Phone"
                type="tel"
                placeholder="+1 555 000 0000"
                autoComplete="tel"
                inputMode="tel"
                pattern="\+?[\d][\d\s().\-]{6,19}"
                title="Enter a valid phone number with at least 7 digits — e.g. +1 555 000 0000" />
            </div>

            <div className="sheet-actions" style={{ display: "flex", gap: 8, marginTop: 24, alignItems: "center" }}>
              <PrimaryBtn type="submit" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <EnvelopeIcon size={13} /> Sign me up
              </PrimaryBtn>
              <button
              onClick={onClose}
              className="press"
              style={{
                padding: "13px 18px", borderRadius: 999, background: "transparent",
                color: "var(--ink-3)", border: 0, fontSize: 13, fontWeight: 500, cursor: "pointer"
              }}>
              Cancel</button>
              <div className="sheet-esc-hint" style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em" }}>

            </div>
            </div>

            <p style={{ marginTop: 22, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)", letterSpacing: "0.02em", lineHeight: 1.6 }}>wow you read small letters, very responsible of you . 

          </p>
            </form>
          </>
        }
        </div>
      </div>
    </div>);

}

function SignupSent({ onClose }) {
  return (
    <div style={{ padding: "24px 0 4px", textAlign: "center" }}>
      <div style={{
        width: 64, height: 64, borderRadius: 999,
        background: "var(--accent-grad-soft, var(--paper-2))",
        margin: "0 auto 22px",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.6)"
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ink-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </div>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: 30, fontWeight: 400,
        letterSpacing: "-0.02em",
        margin: "0 0 12px",
        color: "var(--ink-1)"
      }}>
        You're on the list.
      </h2>
      <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6, margin: "0 auto 28px", maxWidth: "32ch" }}>
        The next letter will arrive when there is something worth sending.
      </p>
      <PrimaryBtn onClick={onClose}>Close</PrimaryBtn>
    </div>);

}

Object.assign(window, { SignupSheet });