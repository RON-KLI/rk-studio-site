// InquireSheet — iOS 26 modal sheet.
// Strong-blur scrim, spring entrance, glass header chip with work context.

function InquireSheet({ open, onClose, work }) {
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
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 460,
          borderRadius: 28,
          overflow: "hidden",
          background: "var(--bone)",
          border: "1px solid var(--mist)",
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
            padding: 28,
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

        {sent ? <SentState onClose={onClose} /> :
        <>
            <Eyebrow style={{ marginBottom: 10 }}>Inquire</Eyebrow>
            <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 34,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "var(--ink-1)"
          }}>
              {work && work.title ? <>About <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}>{work.title}</em></> : "Write to the studio"}
            </h2>

            {/* Work context chip */}
            {work && work.title &&
          <div style={{
            marginTop: 20,
            display: "inline-flex", alignItems: "center", gap: 12,
            padding: "8px 16px 8px 8px",
            borderRadius: 999,
            background: "var(--bone)",
            boxShadow: "inset 0 0 0 1px var(--mist)"
          }}>
                <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: work.grad || "var(--accent-grad)",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)"
            }} />
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>{work.medium || "Work"}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14, color: "var(--ink-1)" }}>{work.size_in || "—"} · {work.year || ""}</span>
                </div>
              </div>
          }

            <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6, margin: "22px 0 28px" }}>
              Send a short note. The studio replies within a few days. There is no waiting list — only the work currently in the room.
            </p>

            <form noValidate={false} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="sheet-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Your name" placeholder="" autoComplete="name" required />
              <Field
                label="Email"
                type="email"
                placeholder="you@domain.com"
                autoComplete="email"
                inputMode="email"
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                title="Enter a valid email address, e.g. name@domain.com"
                required />
              <div style={{ gridColumn: "span 2" }}>
                <Field
                  label="Phone"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  autoComplete="tel"
                  inputMode="tel"
                  pattern="\+?[\d][\d\s().\-]{6,19}"
                  title="Enter a valid phone number with at least 7 digits — e.g. +1 555 000 0000"
                  required />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <Label>Note</Label>
                <textarea
                defaultValue=""
                rows={4}
                style={{
                  width: "100%", boxSizing: "border-box", padding: "12px 14px",
                  background: "var(--bone)",
                  border: "1px solid var(--mist)", borderRadius: 16,
                  fontSize: 14, color: "var(--ink-1)", outline: "none",
                  fontFamily: "var(--font-ui)", resize: "vertical", marginTop: 6
                }} />
              
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 24, alignItems: "center" }}>
              <PrimaryBtn type="submit" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <EnvelopeIcon size={13} /> Send inquiry
              </PrimaryBtn>
              <button
              onClick={onClose}
              className="press"
              style={{
                padding: "13px 18px", borderRadius: 999, background: "transparent",
                color: "var(--ink-3)", border: 0, fontSize: 13, fontWeight: 500, cursor: "pointer"
              }}>
              Cancel</button>
              <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em" }}>
                ESC TO CLOSE
              </div>
            </div>
            </form>
          </>
        }
        </div>
      </div>
    </div>);

}

function Label({ children }) {
  return (
    <div style={{
      fontFamily: "var(--font-mono)", fontSize: 9.5,
      color: "var(--ink-3)", letterSpacing: "0.1em",
      textTransform: "uppercase"
    }}>{children}</div>);

}

function Field({
  label,
  type = "text",
  placeholder = "",
  required = false,
  pattern,
  title,
  inputMode,
  autoComplete,
  name
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span aria-hidden style={{ color: "var(--sunrise)", marginLeft: 6 }}>*</span>}
      </Label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        aria-required={required || undefined}
        pattern={pattern}
        title={title}
        inputMode={inputMode}
        autoComplete={autoComplete}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: "12px 14px", marginTop: 6,
          background: "var(--bone)",
          border: "1px solid var(--mist)", borderRadius: 16,
          fontSize: 14, color: "var(--ink-1)", outline: "none",
          fontFamily: "var(--font-ui)"
        }} />
      
    </div>);

}

function SentState({ onClose }) {
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
        The studio has your note.
      </h2>
      <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6, margin: "0 auto 28px", maxWidth: "32ch" }}>
        I read replies in the order they arrive. You should hear back within a few days, often sooner.
      </p>
      <PrimaryBtn onClick={onClose}>Close</PrimaryBtn>
    </div>);

}

Object.assign(window, { InquireSheet });