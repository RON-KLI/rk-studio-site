// App — main entry. Holds routing state, applies tweaks to <body>,
// and renders the Tweaks panel.

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "navStyle": "pill",
  "heroVariant": "centered",
  "accent": "burn",
  "glass": "medium",
  "density": "quiet",
  "theme": "light"
}/*EDITMODE-END*/;

function App() {
  const t = useTweaks(DEFAULTS);
  const tweaks = t.values;
  const setTweak = t.set;

  const [screen, setScreen] = React.useState("home");
  const [selectedWork, setSelectedWork] = React.useState(null);
  const [inquireOpen, setInquireOpen] = React.useState(false);
  const [inquireWork, setInquireWork] = React.useState(null);
  const [signupOpen, setSignupOpen] = React.useState(false);

  // Apply tweaks to <body> as data attributes
  React.useEffect(() => {
    document.body.dataset.accent  = tweaks.accent;
    document.body.dataset.glass   = tweaks.glass;
    document.body.dataset.density = tweaks.density;
    document.body.dataset.theme   = tweaks.theme;
  }, [tweaks.accent, tweaks.glass, tweaks.density, tweaks.theme]);

  // scroll-to-top on screen change
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [screen, selectedWork]);

  const openInquire = (work) => {
    setInquireWork(work && work.title ? work : null);
    setInquireOpen(true);
  };
  const closeInquire = () => setInquireOpen(false);

  const goWork = (w) => {
    setSelectedWork(w);
    setScreen("work");
  };
  const goBackFromWork = () => {
    setScreen("onview");
    setSelectedWork(null);
  };

  const handleNav = (id) => {
    setScreen(id);
    setSelectedWork(null);
  };

  // World tile click - go to On view filtered by series
  const handleWorldSelect = (world) => {
    setScreen("onview");
  };

  // Water-ripple cursor effect — physics-style wave that travels outward
  // beneath the page surface, displacing every element it passes through.
  React.useEffect(() => {
    const INTERACTIVE = "a, button, input, textarea, select, label, [role=button], [role=link], [role=tab], [role=switch], [role=menuitem], [contenteditable], [data-no-ripple]";
    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    layer.setAttribute("data-ripple-layer", "");
    Object.assign(layer.style, {
      position: "fixed", inset: "0",
      pointerEvents: "none",
      zIndex: "0",
      overflow: "hidden"
    });
    // Insert before #root so the visual rings sit *beneath* page content —
    // the page is the surface of the water, the ripple is below.
    const rootEl = document.getElementById("root");
    if (rootEl && rootEl.parentNode) {
      rootEl.parentNode.insertBefore(layer, rootEl);
    } else {
      document.body.appendChild(layer);
    }

    const styleId = "__ripple-style";
    if (!document.getElementById(styleId)) {
      const s = document.createElement("style");
      s.id = styleId;
      s.textContent = `
        @keyframes rippleWave {
          0%   { transform: translate(-50%, -50%) scale(0.06); opacity: 0; border-width: 2px; }
          12%  { opacity: var(--peak, 0.32); border-width: 1.4px; }
          70%  { opacity: calc(var(--peak, 0.32) * 0.22); border-width: 0.7px; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; border-width: 0.3px; }
        }
        @keyframes rippleSheen {
          0%   { transform: translate(-50%, -50%) scale(0.05); opacity: 0; }
          15%  { opacity: 0.22; }
          100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0; }
        }
        .__ripple-ring {
          position: absolute;
          border-style: solid;
          border-color: rgba(26, 20, 16, 0.55);
          border-radius: 999px;
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
          mix-blend-mode: multiply;
          animation-name: rippleWave;
          animation-timing-function: cubic-bezier(0.22, 0.85, 0.32, 1);
          animation-fill-mode: both;
          will-change: transform, opacity, border-width;
          pointer-events: none;
        }
        .__ripple-sheen {
          position: absolute;
          border-radius: 999px;
          background: radial-gradient(circle at 50% 50%,
            rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0) 70%);
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
          mix-blend-mode: screen;
          filter: blur(2px);
          animation: rippleSheen 1600ms cubic-bezier(0.22, 0.85, 0.32, 1) both;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .__ripple-ring, .__ripple-sheen { animation: none; opacity: 0; }
        }
      `;
      document.head.appendChild(s);
    }

    // ── Physics: propagation speed in px/sec. The wavefront advances over
    // time and pushes every element it crosses, radially outward from the
    // click point, with strength that decays with distance.
    const PROPAGATION_SPEED = 540;
    const MAX_DISTANCE = 380;

    const collectTargets = () => {
      const all = document.querySelectorAll("body *");
      const out = [];
      const SKIP_TAGS = new Set([
        "SCRIPT", "STYLE", "LINK", "META", "TITLE", "HEAD",
        "HTML", "BODY", "MAIN",
        // Don't push photos / SVGs — they should stay anchored
        "IMG", "PICTURE", "VIDEO", "CANVAS", "SVG"
      ]);
      all.forEach((el) => {
        if (el === layer || el.closest("[data-ripple-layer]")) return;
        if (el.closest("[data-edit-panel]")) return;
        if (SKIP_TAGS.has(el.tagName)) return;
        // Skip ONLY the gradient itself and anything inside it. Parents
        // that happen to contain it (the hero section, main, etc.) must
        // still be allowed to ripple — otherwise the whole home page is
        // exempt.
        if (el.classList && el.classList.contains("hero-art-gradient")) return;
        if (el.closest && el.closest(".hero-art-gradient")) return;
        // Skip the procedural Painting placeholder cards — they're images
        if (el.classList && el.classList.contains("painting")) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        // Skip page-spanning containers — they'd shake whole sections at once
        if (r.height > window.innerHeight * 0.85) return;
        if (r.width > window.innerWidth * 0.92 && r.height > 200) return;
        out.push({ el, cx: r.left + r.width / 2, cy: r.top + r.height / 2 });
      });
      return out;
    };

    const pushElement = (el, dx, dy, strength) => {
      if (!el.animate) return;
      // Direction normalized
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = dx / len;
      const ny = dy / len;
      // Peak displacement scales with strength (0..1)
      const peak = 2 * strength;       // pixels
      const peakScale = 1 + 0.003 * strength;
      const px = nx * peak;
      const py = ny * peak;
      el.animate(
        [
          { transform: "translate(0px, 0px) scale(1)" },
          { transform: `translate(${px * 0.5}px, ${py * 0.5}px) scale(${peakScale})`, offset: 0.18 },
          { transform: `translate(${px}px, ${py}px) scale(${peakScale})`, offset: 0.38 },
          { transform: `translate(${px * 0.35}px, ${py * 0.35}px) scale(1)`, offset: 0.65 },
          { transform: "translate(0px, 0px) scale(1)" }
        ],
        {
          duration: 820 + Math.random() * 120,
          easing: "cubic-bezier(0.22, 0.85, 0.32, 1)",
          composite: "add"
        }
      );
    };

    const spawn = (e) => {
      if (e.pointerType === "touch" && e.isPrimary === false) return;
      const tgt = e.target;
      if (!tgt || tgt.nodeType !== 1) return;
      if (tgt.closest && tgt.closest(INTERACTIVE)) return;
      if (tgt.closest("[data-edit-panel]")) return;

      const x = e.clientX;
      const y = e.clientY;

      // Visual rings beneath the page
      const rings = [
        { size: 130, delay: 0,    duration: 4500, peak: 0.12 },
        { size: 100, delay: 240,  duration: 4200, peak: 0.09 },
        { size: 72,  delay: 500,  duration: 3900, peak: 0.07 },
        { size: 48,  delay: 780,  duration: 3600, peak: 0.045 }
      ];
      rings.forEach((r) => {
        const ring = document.createElement("div");
        ring.className = "__ripple-ring";
        ring.style.left = x + "px";
        ring.style.top = y + "px";
        ring.style.width = r.size + "px";
        ring.style.height = r.size + "px";
        ring.style.animationDelay = r.delay + "ms";
        ring.style.animationDuration = r.duration + "ms";
        ring.style.setProperty("--peak", String(r.peak));
        layer.appendChild(ring);
        setTimeout(() => ring.remove(), r.duration + r.delay + 60);
      });

      // Surface meniscus at impact
      const sheen = document.createElement("div");
      sheen.className = "__ripple-sheen";
      sheen.style.left = x + "px";
      sheen.style.top = y + "px";
      sheen.style.width = "72px";
      sheen.style.height = "72px";
      sheen.style.animationDuration = "4200ms";
      layer.appendChild(sheen);
      setTimeout(() => sheen.remove(), 4300);

      // ── Physical interaction: every visible leaf element gets a push
      // when the wavefront reaches it. Closer = stronger + sooner.
      const targets = collectTargets();
      targets.forEach((t) => {
        const dx = t.cx - x;
        const dy = t.cy - y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > MAX_DISTANCE) return;
        const outX = dx, outY = dy;
        const norm = 1 - d / MAX_DISTANCE;
        const strength = norm * norm * 0.95 + 0.05;
        const arrival = (d / PROPAGATION_SPEED) * 1000;
        setTimeout(() => pushElement(t.el, outX, outY, strength), arrival);
      });
    };

    window.addEventListener("pointerdown", spawn, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", spawn);
      layer.remove();
    };
  }, []);

  return (
    <>
      {screen !== "admin" && <Nav
        variant={tweaks.navStyle}
        current={screen === "work" ? "onview" : screen}
        onNav={handleNav}
        onInquire={() => openInquire()}
      />}

      <main>
        {screen === "home" && <Hero variant={tweaks.heroVariant} onCta={() => handleNav("onview")} onInquire={() => openInquire()} onSignup={() => setSignupOpen(true)} onView={goWork} />}
        {screen === "onview" && <OnView onSelect={goWork} onInquire={openInquire} />}
        {screen === "work" && selectedWork && <ArtworkDetail work={selectedWork} onBack={goBackFromWork} onInquire={openInquire} onSelect={goWork} />}
        {screen === "worlds" && <Worlds onSelect={handleWorldSelect} onInquire={openInquire} />}
        {screen === "exhibitions" && <Exhibitions onInquire={() => openInquire()} />}
        {screen === "about" && <About onInquire={() => openInquire()} />}
        {screen === "admin" && <Admin onExit={() => handleNav("home")} />}
      </main>

      {screen !== "admin" && <Footer onNav={handleNav} />}

      {screen !== "admin" && <InquireSheet open={inquireOpen} onClose={closeInquire} work={inquireWork} />}
      {screen !== "admin" && <SignupSheet open={signupOpen} onClose={() => setSignupOpen(false)} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakRadio
            label="Nav style"
            value={tweaks.navStyle}
            options={[
              { value: "pill",   label: "Pill" },
              { value: "island", label: "Island" },
              { value: "bar",    label: "Bar" },
            ]}
            onChange={(v) => setTweak("navStyle", v)}
          />
          <TweakRadio
            label="Hero variant"
            value={tweaks.heroVariant}
            options={[
              { value: "centered",  label: "Centered" },
              { value: "editorial", label: "Editorial" },
              { value: "stack",     label: "Stack" },
            ]}
            onChange={(v) => setTweak("heroVariant", v)}
          />
          <TweakRadio
            label="Density"
            value={tweaks.density}
            options={[
              { value: "quiet",     label: "Quiet" },
              { value: "editorial", label: "Editorial" },
            ]}
            onChange={(v) => setTweak("density", v)}
          />
        </TweakSection>

        <TweakSection label="Atmosphere">
          <TweakRadio
            label="Theme"
            value={tweaks.theme}
            options={[
              { value: "light", label: "Paper" },
              { value: "dark",  label: "Ink" },
            ]}
            onChange={(v) => setTweak("theme", v)}
          />
          <TweakRadio
            label="Glass"
            value={tweaks.glass}
            options={[
              { value: "subtle", label: "Subtle" },
              { value: "medium", label: "Medium" },
              { value: "heavy",  label: "Heavy" },
            ]}
            onChange={(v) => setTweak("glass", v)}
          />
          <TweakSelect
            label="Accent band"
            value={tweaks.accent}
            options={[
              { value: "burn",  label: "Burn — deep red into orange" },
              { value: "dawn",  label: "Dawn — blue, mauve, peach" },
              { value: "gold",  label: "Gold — golden hour" },
              { value: "amber", label: "Amber — cream into amber" },
            ]}
            onChange={(v) => setTweak("accent", v)}
          />
        </TweakSection>

        <TweakSection label="Navigation">
          <TweakButton label="Home"        onClick={() => handleNav("home")} />
          <TweakButton label="On view"     onClick={() => handleNav("onview")} secondary />
          <TweakButton label="Worlds"      onClick={() => handleNav("worlds")} secondary />
          <TweakButton label="Exhibitions" onClick={() => handleNav("exhibitions")} secondary />
          <TweakButton label="About"       onClick={() => handleNav("about")} secondary />
          <TweakButton label="Open inquire sheet" onClick={() => openInquire()} secondary />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
