// Nav — three variants:
//   - "pill"    : floating glass pill, centered
//   - "island"  : dynamic-island morph; compacts to a tab + accent on scroll
//   - "bar"     : full-width glass bar
//
// All variants stay sticky, all live in liquid glass, all use the same items.

const NAV_ITEMS = [
{ id: "home", label: "Home" },
{ id: "onview", label: "Artworks" },
{ id: "exhibitions", label: "Exhibitions" },
{ id: "about", label: "About" }];


function Nav({ variant = "pill", current, onNav, onInquire }) {
  const scrolled = useScroll() > 24;
  const hidden = useHideOnScrollDown();
  const desktop = variant === "island"
    ? <NavIsland current={current} onNav={onNav} onInquire={onInquire} scrolled={scrolled} hidden={hidden} />
    : variant === "bar"
    ? <NavBar    current={current} onNav={onNav} onInquire={onInquire} scrolled={scrolled} hidden={hidden} />
    : <NavPill   current={current} onNav={onNav} onInquire={onInquire} scrolled={scrolled} hidden={hidden} />;
  return (
    <>
      <div className="nav-desktop">{desktop}</div>
      <NavMobile current={current} onNav={onNav} onInquire={onInquire} hidden={hidden} />
    </>
  );
}

// useHideOnScrollDown — returns `true` while the user is scrolling down past
// the threshold; flips to `false` the moment they scroll up by any amount.
// Always returns `false` near the top of the page.
function useHideOnScrollDown(threshold = 80) {
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    let lastY = window.scrollY || 0;
    let accumDown = 0;
    let accumUp = 0;
    let isHidden = false;
    const onScroll = () => {
      const y = window.scrollY || 0;
      const dy = y - lastY;
      lastY = y;

      // Near the top — always reveal, reset accumulators.
      if (y < threshold) {
        accumDown = 0;
        accumUp = 0;
        if (isHidden) { isHidden = false; setHidden(false); }
        return;
      }

      if (dy > 0) {
        accumDown += dy;
        accumUp = 0;
        if (!isHidden && accumDown > 24) {
          isHidden = true;
          setHidden(true);
        }
      } else if (dy < 0) {
        accumUp += -dy;
        accumDown = 0;
        // tiny upward swipe is enough to bring it back
        if (isHidden && accumUp > 6) {
          isHidden = false;
          setHidden(false);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return hidden;
}

// ── Mobile: hamburger + slide-down sheet ──────────────────────────────────
function NavMobile({ current, onNav, onInquire, hidden }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  const go = (id) => { onNav(id); setOpen(false); };
  return (
    <div className="nav-mobile" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 80,
      padding: "14px 16px 0",
      display: "none",
      transform: hidden && !open ? "translateY(-130%)" : "translateY(0)",
      transition: "transform 380ms cubic-bezier(0.22, 0.85, 0.32, 1)",
      willChange: "transform",
      pointerEvents: "none"
    }}>
      <div className="lg" style={{
        pointerEvents: "auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        height: 54,
        padding: "0 6px 0 14px",
        borderRadius: 999,
        width: "100%"
      }}>
        <button onClick={() => onNav("home")} style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <Monogram />
          <span className="nav-mobile-name" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17, color: "var(--ink-1)", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>Ron Klimovsky</span>
        </button>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: "0 0 auto" }}>
          <button onClick={onInquire} className="press" style={{
            background: "var(--ink-1)", color: "var(--bone)", border: 0,
            padding: "9px 16px", borderRadius: 999, fontFamily: "var(--font-ui)",
            fontSize: 13, fontWeight: 500, cursor: "pointer"
          }}>Inquire</button>
          <button onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} style={{
            width: 38, height: 38, borderRadius: 999, border: 0,
            background: "transparent",
            display: "grid", placeItems: "center", color: "var(--ink-1)", cursor: "pointer"
          }}>{open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}</button>
        </div>
      </div>

      {/* drawer */}
      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 90,
          pointerEvents: "auto",
          background: "rgba(26,20,16,0.28)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
        }}>
          <div onClick={(e) => e.stopPropagation()} className="lg-strong" style={{
            position: "absolute", top: 12, left: 12, right: 12,
            borderRadius: 28,
            padding: "20px 18px 22px",
            background: "rgba(251, 248, 244, 0.94)",
            animation: "navMobileIn 280ms cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <Eyebrow>Studio · menu</Eyebrow>
              <button onClick={() => setOpen(false)} aria-label="Close" style={{
                width: 36, height: 36, borderRadius: 999, border: 0,
                background: "var(--paper-2)", color: "var(--ink-2)", cursor: "pointer",
                display: "grid", placeItems: "center"
              }}><CloseIcon size={16} /></button>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              {NAV_ITEMS.map((it) => (
                <li key={it.id}>
                  <button onClick={() => go(it.id)} style={{
                    width: "100%", textAlign: "left", border: 0, cursor: "pointer",
                    background: current === it.id ? "var(--paper-2)" : "transparent",
                    padding: "14px 16px", borderRadius: 16,
                    fontFamily: "var(--font-display)", fontStyle: "italic",
                    fontSize: 24, color: "var(--ink-1)", letterSpacing: "-0.015em"
                  }}>{it.label}</button>
                </li>
              ))}
            </ul>
            <button onClick={() => { onInquire(); setOpen(false); }} className="press" style={{
              width: "100%", marginTop: 14,
              padding: "14px 18px", borderRadius: 999,
              background: "var(--ink-1)", color: "var(--bone)", border: 0,
              fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 500,
              cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8
            }}><EnvelopeIcon size={13} /> Inquire</button>
          </div>
          <style>{`@keyframes navMobileIn {
            from { transform: translateY(-12px); opacity: 0; }
            to   { transform: translateY(0); opacity: 1; }
          }`}</style>
        </div>
      )}
    </div>
  );
}

// ── Pill ────────────────────────────────────────────────────────────────────
function NavPill({ current, onNav, onInquire, scrolled, hidden }) {
  const currentLabel = (NAV_ITEMS.find((i) => i.id === current) || NAV_ITEMS[0]).label;
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 80, padding: "20px 24px 0",
      display: "flex", justifyContent: "center", pointerEvents: "none",
      transform: hidden ? "translateY(-130%)" : "translateY(0)",
      transition: "transform 380ms cubic-bezier(0.22, 0.85, 0.32, 1)",
      willChange: "transform"
    }}>
      <nav
        className="lg"
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 22,
          height: 58,
          padding: "0 8px 0 18px",
          borderRadius: 999,
          transition: "all 400ms var(--ease-spring)",
          transform: scrolled ? "translateY(0) scale(0.985)" : "translateY(0) scale(1)"
        }}>
        
        <button onClick={() => onNav("home")} aria-label="Ron Klimovsky — home"
        style={{ display: "flex", alignItems: "center", gap: 10, background: "transparent", border: 0, padding: 0, cursor: "pointer" }}>
          <Monogram />
        </button>
        <div style={{ display: "flex", gap: 4 }}>
          {NAV_ITEMS.slice(1).map((it) =>
          <NavLink key={it.id} item={it} active={current === it.id} onClick={() => onNav(it.id)} />
          )}
        </div>
        <button
          className="press"
          onClick={onInquire}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "9px 18px", borderRadius: 999,
            background: "var(--ink-1)", color: "var(--bone)", border: 0,
            fontSize: 13, fontWeight: 500, fontFamily: "\"Inter Tight\""
          }}>
          
          Inquire
        </button>
      </nav>
    </div>);

}

// ── Dynamic-Island morph ────────────────────────────────────────────────────
function NavIsland({ current, onNav, onInquire, scrolled, hidden }) {
  const [expanded, setExpanded] = React.useState(false);
  const open = !scrolled || expanded;
  const currentLabel = (NAV_ITEMS.find((i) => i.id === current) || NAV_ITEMS[0]).label;

  return (
    <div
      style={{
        position: "sticky", top: 0, zIndex: 80,
        padding: "16px 24px 0",
        display: "flex", justifyContent: "center",
        pointerEvents: "none",
        transform: hidden ? "translateY(-130%)" : "translateY(0)",
        transition: "transform 380ms cubic-bezier(0.22, 0.85, 0.32, 1)",
        willChange: "transform"
      }}
      onMouseLeave={() => setExpanded(false)}>
      
      <nav
        className="lg-strong"
        onMouseEnter={() => setExpanded(true)}
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          height: open ? 56 : 42,
          padding: open ? "0 6px 0 16px" : "0 14px",
          borderRadius: 999,
          gap: open ? 18 : 12,
          transition: "all 540ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          minWidth: open ? 540 : 220,
          overflow: "hidden",
          background: "var(--glass-bg-strong)"
        }}>
        
        <button onClick={() => onNav("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "transparent", border: 0, padding: 0, cursor: "pointer", flex: "0 0 auto" }}>
          <Monogram />
        </button>

        {open ?
        <>
            <div style={{ display: "flex", gap: 2 }}>
              {NAV_ITEMS.slice(1).map((it) =>
            <NavLink key={it.id} item={it} active={current === it.id} onClick={() => onNav(it.id)} />
            )}
            </div>
            <button
            className="press"
            onClick={onInquire}
            style={{
              marginLeft: "auto",
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "9px 18px", borderRadius: 999,
              background: "var(--ink-1)", color: "var(--bone)", border: 0,
              fontSize: 13, fontWeight: 500
            }}>
            
              Inquire
            </button>
          </> :

        <>
            <div style={{ width: 1, height: 18, background: "var(--mist)", margin: "0 4px" }} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>You're on</span>
              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>{currentLabel}</span>
            </div>
            <button
            onClick={onInquire}
            className="press"
            aria-label="Inquire"
            style={{
              marginLeft: "auto", width: 30, height: 30, borderRadius: 999,
              background: "var(--ink-1)", color: "var(--bone)", border: 0,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
            
              <EnvelopeIcon size={12} />
            </button>
          </>
        }
      </nav>
    </div>);

}

// ── Full-width bar ──────────────────────────────────────────────────────────
function NavBar({ current, onNav, onInquire, scrolled, hidden }) {
  return (
    <nav
      className="lg"
      style={{
        position: "sticky", top: 0, zIndex: 80,
        display: "flex", alignItems: "center",
        padding: "0 32px",
        height: 64,
        gap: 32,
        borderRadius: 0,
        borderLeft: 0, borderRight: 0, borderTop: 0,
        borderBottom: `1px solid var(--glass-border)`,
        transition: "height 320ms var(--ease-out), transform 380ms cubic-bezier(0.22, 0.85, 0.32, 1)",
        transform: hidden ? "translateY(-110%)" : "translateY(0)",
        willChange: "transform"
      }}>
      
      <button onClick={() => onNav("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "transparent", border: 0, padding: 0, cursor: "pointer" }}>
        <Monogram large />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05, textAlign: "left" }}>
          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>Ron Klimovsky</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)" }}>Studio · Est. 2014</span>
        </div>
      </button>
      <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
        {NAV_ITEMS.slice(1).map((it) =>
        <NavLink key={it.id} item={it} active={current === it.id} onClick={() => onNav(it.id)} />
        )}
      </div>
      <button
        className="press"
        onClick={onInquire}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderRadius: 999,
          background: "var(--ink-1)", color: "var(--bone)", border: 0,
          fontSize: 13, fontWeight: 500
        }}>
        
        Inquire
      </button>
    </nav>);

}

// ── Link ────────────────────────────────────────────────────────────────────
function NavLink({ item, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        position: "relative",
        background: active ? "var(--bone)" : hover ? "rgba(0,0,0,0.04)" : "transparent",
        boxShadow: active ? "var(--shadow-xs)" : "none",
        border: 0,
        cursor: "pointer",
        fontFamily: "var(--font-ui)",
        fontSize: 13,
        fontWeight: 500,
        color: active ? "var(--ink-1)" : "var(--ink-2)",
        padding: "8px 14px",
        borderRadius: 999,
        letterSpacing: "-0.005em",
        whiteSpace: "nowrap",
        transition: "all 220ms var(--ease-out)"
      }}>
      
      {item.label}
    </button>);

}

// Monogram — RK ligature logo
function Monogram({ large = false }) {
  const h = large ? 28 : 22;
  return (
    <img
      src="assets/logo.png"
      alt="Ron Klimovsky"
      style={{
        height: h,
        width: "auto",
        display: "block",
        flex: "0 0 auto"
      }} />);


}

Object.assign(window, { Nav });