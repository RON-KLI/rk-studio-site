// Admin — private, password-protected studio backstage.
// Four sections: Artworks, Inquiries, Mailing & phone list, Exhibitions & events.
// Plus bulk Google Sheets import/export for artworks.
//
// NOTE: This is a prototype. The "password gate" is client-side only and not
// real security. For production, this page must sit behind a real auth layer
// (server-side session, OAuth, or a static-site password proxy like Cloudflare
// Access). Treat the gate below as visual scaffolding only.

const ADMIN_PASSWORD = /*EDITMODE-BEGIN*/{ "password": "3690" }/*EDITMODE-END*/;
const ADMIN_SESSION_KEY = "rk_admin_session_v1";

// When true, the login card shows the password in plain sight (useful while
// designing). Auto-disabled on production hostnames so the deployed site
// never leaks the hint. Override by setting window.RK_SHOW_ADMIN_HINT = true.
const ADMIN_SHOW_PROTOTYPE_HINT = (() => {
  try {
    if (typeof window !== "undefined" && window.RK_SHOW_ADMIN_HINT === true) return true;
    if (typeof window === "undefined" || !window.location) return false;
    const h = window.location.hostname || "";
    return h === "localhost" || h === "127.0.0.1" || h.endsWith(".local") ||
           h.includes("claudeusercontent.com") || h.includes("vercel.app") || h.includes("netlify.app");
  } catch (e) { return false; }
})();

// ── Mock inquiries (would come from form submissions in production) ───────
const MOCK_INQUIRIES = [
  { id: "i-1", from: "Inés Vidal",          email: "ines@galeriapequena.mx",  phone: "+52 55 1234 5678", date: "2026-05-19", subject: "Two-person show, autumn 2026", work: "Hours, before noon", body: "Ron — I'm planning a second iteration of the autumn show. Would you have three new paintings ready by September? Also asking about Hours, before noon — is it still available? — Inés", status: "new" },
  { id: "i-2", from: "Marcus Thiele",       email: "m.thiele@kammer12.at",     phone: "",                  date: "2026-05-17", subject: "Studio visit — June",       work: null, body: "Hello Ron, I'll be in NY the second week of June for the Frieze opening. Would love to come by the studio if you're around. — M", status: "new" },
  { id: "i-3", from: "Aki Tanaka",          email: "aki.tanaka@protonmail.com", phone: "+81 90 8765 4321", date: "2026-05-15", subject: "An open door, again — purchase inquiry", work: "An open door, again", body: "Hello — I saw the piece on your site and would like to ask about acquiring it. I'm based in Tokyo. Could you share availability and shipping options? Thank you, Aki", status: "replied" },
  { id: "i-4", from: "Helena Brookings",    email: "helena@bellweatherbooks.com", phone: "+1 718 555 0114", date: "2026-05-12", subject: "Re-hanging the bookshop wall", work: null, body: "Ron — the wall is empty again. Want to send us three for the summer? Same terms as last time. — Helena", status: "read" },
  { id: "i-5", from: "Jonas Frey",          email: "jonas.frey@gmail.com",      phone: "",                  date: "2026-05-10", subject: "Edition print — Sunrise, study I", work: null, body: "Hi, is the first edition still available? Specifically number 4 or lower if possible. Thank you.", status: "replied" },
  { id: "i-6", from: "Priya Raghavan",      email: "priya@artquarterly.com",    phone: "+1 212 555 0177", date: "2026-05-04", subject: "Studio profile — autumn issue", work: null, body: "Ron, we're putting together a profile of artists working outside the gallery system. Would you sit for a short interview and let our photographer in for an afternoon? Deadline mid-July. — Priya, Art Quarterly", status: "read" },
  { id: "i-7", from: "Anonymous (no name)", email: "lex@protonmail.com",        phone: "",                  date: "2026-04-29", subject: "Commission",                 work: null, body: "Would you accept a commission for a large interior painting? I can provide reference and budget on a call.", status: "archived" },
];

// ── Mock mailing list ─────────────────────────────────────────────────────
const MOCK_SUBSCRIBERS = [
  { id: "s-1",  name: "Inés Vidal",        email: "ines@galeriapequena.mx",       phone: "+52 55 1234 5678", source: "Inquire form",   joined: "2024-09-12", tags: ["gallerist", "press"] },
  { id: "s-2",  name: "Marcus Thiele",     email: "m.thiele@kammer12.at",          phone: "+43 660 555 0188",  source: "Studio visit",   joined: "2023-11-04", tags: ["gallerist"] },
  { id: "s-3",  name: "Aki Tanaka",        email: "aki.tanaka@protonmail.com",     phone: "+81 90 8765 4321",  source: "Edition shop",   joined: "2025-02-22", tags: ["collector"] },
  { id: "s-4",  name: "Helena Brookings",  email: "helena@bellweatherbooks.com",   phone: "+1 718 555 0114",   source: "Show opening",   joined: "2024-01-30", tags: ["venue"] },
  { id: "s-5",  name: "Jonas Frey",        email: "jonas.frey@gmail.com",          phone: "",                   source: "Newsletter",     joined: "2025-06-18", tags: ["collector"] },
  { id: "s-6",  name: "Priya Raghavan",    email: "priya@artquarterly.com",        phone: "+1 212 555 0177",   source: "Inquire form",   joined: "2025-10-02", tags: ["press"] },
  { id: "s-7",  name: "Alex Manning",      email: "alex.manning@martaeve.de",       phone: "+49 30 9876 5432",  source: "Show opening",   joined: "2025-06-04", tags: ["gallerist"] },
  { id: "s-8",  name: "Sofia Ricci",       email: "sofia.ricci@gmail.com",          phone: "",                   source: "Newsletter",     joined: "2025-12-11", tags: [] },
  { id: "s-9",  name: "Theo Park",         email: "theopark@studio-park.kr",       phone: "+82 10 2233 4455",   source: "Edition shop",   joined: "2026-01-08", tags: ["collector"] },
  { id: "s-10", name: "Naomi Bertrand",    email: "n.bertrand@maison-art.fr",       phone: "+33 6 12 34 56 78", source: "Press",          joined: "2026-03-20", tags: ["press"] },
  { id: "s-11", name: "Dana Wexler",       email: "dana@wexlerprojects.com",        phone: "+1 415 555 0166",   source: "Studio visit",   joined: "2026-04-14", tags: ["gallerist", "collector"] },
  { id: "s-12", name: "Renata Lima",       email: "renata.lima@gmail.com",          phone: "",                   source: "Newsletter",     joined: "2026-05-01", tags: [] },
];

// ── Shared layout primitives ──────────────────────────────────────────────

function adminToken(text, mono = false, color = "var(--ink-3)") {
  return { fontFamily: mono ? "var(--font-mono)" : "var(--font-ui)", fontSize: mono ? 10.5 : 11, color, letterSpacing: mono ? "0.14em" : "0.04em", textTransform: mono ? "uppercase" : "none" };
}

function AdminLogin({ onAuth }) {
  const [pw, setPw] = React.useState("");
  const [err, setErr] = React.useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD.password) {
      try { sessionStorage.setItem(ADMIN_SESSION_KEY, "ok"); } catch (e) {}
      onAuth();
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 400);
    }
  };
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, position: "relative" }}>
      {/* faint sunrise halo behind card */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 40% at 50% 38%, rgba(255,122,61,0.10) 0%, transparent 70%)" }}></div>

      <form onSubmit={submit} className="lg-strong admin-login" style={{
        position: "relative",
        width: "min(420px, 100%)",
        padding: "44px 36px 32px",
        borderRadius: 32,
        boxShadow: "var(--shadow-glass)",
        animation: err ? "adminShake 0.4s ease-in-out" : "none"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 4, marginBottom: 28 }}>
          <Eyebrow>Studio · private</Eyebrow>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 38, color: "var(--ink-1)", letterSpacing: "-0.02em", lineHeight: 1, marginTop: 8 }}>
            Backstage
          </div>
          <p style={{ marginTop: 12, fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.55, maxWidth: "32ch" }}>
            For the studio's use only. If you have wandered in by accident, the front door is over there ↗
          </p>
        </div>

        <label style={{ display: "block" }}>
          <span style={{ ...adminToken(null, true), display: "block", marginBottom: 8 }}>Password</span>
          <input
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="—"
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 16,
              border: "1px solid var(--mist, var(--border, #E6DED2))",
              background: "var(--paper)",
              fontFamily: "var(--font-ui)",
              fontSize: 15,
              color: "var(--ink-1)",
              outline: "none",
              transition: "border-color 220ms ease"
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--sunrise)"}
            onBlur={(e) => e.target.style.borderColor = "var(--mist, var(--border, #E6DED2))"}
          />
        </label>

        <PrimaryBtn style={{ width: "100%", marginTop: 18, justifyContent: "center", display: "flex" }} onClick={submit}>
          Enter the studio
        </PrimaryBtn>

        <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid var(--mist, #E6DED2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-4, var(--ink-3))", textAlign: "center" }}>
          Private · authorized studio personnel only
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("rk-admin-exit")); }}
          style={{ display: "block", textAlign: "center", marginTop: 14, fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}>
          ← Back to the site
        </a>

        <style>{`@keyframes adminShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }`}</style>
      </form>
    </div>
  );
}

// ── Sidebar nav ───────────────────────────────────────────────────────────

function AdminSidebar({ section, onSection, onLogout, onExit, counts }) {
  const items = [
    { id: "analytics",   label: "Analytics",            sub: "Last 30 days" },
    { id: "artworks",    label: "Artworks",            sub: counts.artworks + " in catalog" },
    { id: "inquiries",   label: "Inquiries",           sub: counts.inquiriesNew + " new · " + counts.inquiries + " total" },
    { id: "mailing",     label: "Mailing & phone list", sub: counts.subscribers + " contacts" },
    { id: "exhibitions", label: "Exhibitions & events", sub: counts.exhibitions + " entries" },
  ];
  return (
    <aside className="admin-sidebar" style={{
      position: "sticky", top: 0,
      width: 260, flex: "0 0 260px",
      height: "100vh",
      background: "var(--bone)",
      borderRight: "1px solid var(--mist, #E6DED2)",
      padding: "32px 22px",
      display: "flex", flexDirection: "column", gap: 28
    }}>
      <div className="admin-sidebar__header">
        <Eyebrow>Ron Klimovsky Studio</Eyebrow>
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 28, color: "var(--ink-1)", letterSpacing: "-0.02em", marginTop: 6, lineHeight: 1 }}>
          Backstage
        </div>
      </div>

      <nav className="admin-sidebar__nav" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((it) => {
          const active = section === it.id;
          return (
            <button key={it.id} onClick={() => onSection(it.id)}
              className="admin-sidebar__nav-item"
              style={{
                textAlign: "left",
                background: active ? "var(--paper-2)" : "transparent",
                border: 0,
                padding: "12px 14px",
                borderRadius: 16,
                cursor: "pointer",
                fontFamily: "var(--font-ui)",
                color: active ? "var(--ink-1)" : "var(--ink-2)",
                display: "flex", flexDirection: "column", gap: 2,
                transition: "background 180ms ease, color 180ms ease"
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--paper-2)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
              <span style={{ fontSize: 14.5, fontWeight: 500, letterSpacing: "-0.005em", display: "flex", alignItems: "center", gap: 8 }}>
                {active && <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--sunrise)" }}></span>}
                {it.label}
              </span>
              <span className="admin-sidebar__nav-item-sub" style={{ ...adminToken(null, true), fontSize: 10, color: "var(--ink-3)" }}>{it.sub}</span>
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar__footer" style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={onExit} style={{
          background: "transparent", border: "1px solid var(--mist, #E6DED2)",
          padding: "10px 14px", borderRadius: 999, fontFamily: "var(--font-ui)",
          fontSize: 13, color: "var(--ink-2)", cursor: "pointer"
        }}>← Back to the site</button>
        <button onClick={onLogout} style={{
          background: "transparent", border: 0,
          padding: "8px 14px",
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "var(--ink-3)", cursor: "pointer",
          textAlign: "left"
        }}>Lock backstage</button>
      </div>
    </aside>
  );
}

// ── Section header — used at top of each section ───────────────────────────

function SectionHeader({ eyebrow, title, blurb, actions }) {
  return (
    <header className="admin-section-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
      <div style={{ maxWidth: 600 }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 48, color: "var(--ink-1)", letterSpacing: "-0.025em", margin: "8px 0 0", lineHeight: 1.02, fontWeight: 400 }}>
          {title}
        </h1>
        {blurb && <p style={{ marginTop: 12, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.6, maxWidth: "48ch" }}>{blurb}</p>}
      </div>
      <div className="admin-header-actions" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>
    </header>
  );
}

// ── Small UI atoms used inside admin ──────────────────────────────────────

function AdminBtn({ children, onClick, kind = "secondary", style = {} }) {
  const bg = kind === "primary" ? "var(--ink-1)" : kind === "ghost" ? "transparent" : "var(--bone)";
  const color = kind === "primary" ? "var(--bone)" : "var(--ink-1)";
  const border = kind === "ghost" ? "0" : "1px solid var(--mist, #E6DED2)";
  return (
    <button onClick={onClick} style={{
      background: bg, color, border,
      padding: "10px 16px", borderRadius: 999,
      fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500,
      cursor: "pointer", letterSpacing: "-0.005em",
      transition: "transform 120ms ease, background 220ms ease",
      ...style
    }}
      onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
      onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
      {children}
    </button>
  );
}

function StatusTag({ status }) {
  const map = {
    "On view":   { bg: "rgba(80,140,90,0.10)",  fg: "#4A7A52" },
    "Sold":      { bg: "var(--paper-2)",         fg: "var(--ink-3)" },
    "Available": { bg: "rgba(255,122,61,0.10)",  fg: "var(--sunrise)" },
    "Upcoming":  { bg: "rgba(80,140,90,0.10)",  fg: "#4A7A52" },
    "Past":      { bg: "var(--paper-2)",         fg: "var(--ink-3)" },
    "new":       { bg: "rgba(255,122,61,0.12)", fg: "var(--sunrise)" },
    "read":      { bg: "var(--paper-2)",         fg: "var(--ink-3)" },
    "replied":   { bg: "rgba(80,140,90,0.10)",  fg: "#4A7A52" },
    "archived":  { bg: "var(--paper-3)",         fg: "var(--ink-4, var(--ink-3))" },
  };
  const m = map[status] || { bg: "var(--paper-2)", fg: "var(--ink-3)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: 999,
      background: m.bg, color: m.fg,
      fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.10em",
      textTransform: "uppercase", whiteSpace: "nowrap"
    }}>{status}</span>
  );
}

// ── Sheets dialog — bulk import / export via Google Sheets ─────────────────

// Per-entity configuration so the dialog speaks accurately whether it's
// syncing artworks or the mailing list — correct nouns, columns, and the
// candidate sheets shown in the picker.
const SHEETS_ENTITIES = {
  artworks: {
    nounPlural: "artworks",
    catalogNoun: "catalog",
    headerHint: "title, medium, dimensions, year, series, status, price",
    columns: [
      ["title", "Title"],
      ["medium", "Medium"],
      ["size_in / size_cm", "Dimensions"],
      ["year", "Year"],
      ["series", "Series"],
      ["status", "Status (On view / Sold / Available)"],
      ["price", "Price"],
    ],
    sheets: [
      { name: "Studio catalog — master", updated: "May 18, 2026", rows: 42, selected: true },
      { name: "2025 inventory",          updated: "Jan 9, 2026",  rows: 28 },
      { name: "Editions ledger",         updated: "Apr 22, 2026", rows: 6 },
    ],
  },
  subscribers: {
    nounPlural: "contacts",
    catalogNoun: "list",
    headerHint: "name, email, phone, source, tags, joined",
    columns: [
      ["name", "Name"],
      ["email", "Email"],
      ["phone", "Phone"],
      ["source", "Source"],
      ["tags", "Tags"],
      ["joined", "Joined"],
    ],
    sheets: [
      { name: "Mailing & phone list — master", updated: "May 21, 2026", rows: 12, selected: true },
      { name: "Newsletter signups — 2025",      updated: "Dec 30, 2025", rows: 38 },
      { name: "Open studio RSVPs",               updated: "Apr 16, 2026", rows: 21 },
    ],
  },
};

function SheetsDialog({ open, mode, onClose, onComplete, sheetName = "Artworks", entity = "artworks", count = 0 }) {
  const cfg = SHEETS_ENTITIES[entity] || SHEETS_ENTITIES.artworks;
  const [step, setStep] = React.useState("connect"); // connect → pick → map → done
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (open) { setStep("connect"); setProgress(0); }
  }, [open, mode]);

  if (!open) return null;

  const advance = () => {
    if (step === "connect") setStep("pick");
    else if (step === "pick") setStep("map");
    else if (step === "map") {
      setStep("syncing");
      // fake progress
      let p = 0;
      const t = setInterval(() => {
        p += 12 + Math.random() * 14;
        if (p >= 100) { p = 100; clearInterval(t); setProgress(100); setTimeout(() => setStep("done"), 280); }
        else setProgress(p);
      }, 220);
    } else if (step === "done") {
      onComplete && onComplete();
      onClose();
    }
  };

  const title = mode === "import" ? "Import from Google Sheets" : "Export to Google Sheets";
  const verb = mode === "import" ? "import" : "export";

  return (
    <div role="dialog" aria-modal="true" onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(26,20,16,0.32)",
      backdropFilter: "blur(8px)",
      display: "grid", placeItems: "center",
      padding: 24
    }}>
      <div onClick={(e) => e.stopPropagation()} className="lg-strong admin-modal" style={{
        width: "min(560px, 100%)",
        borderRadius: 32,
        padding: "32px 32px 24px",
        boxShadow: "var(--shadow-glass)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <Eyebrow>Bulk · {mode}</Eyebrow>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 28, color: "var(--ink-1)", letterSpacing: "-0.02em", marginTop: 6, lineHeight: 1 }}>{title}</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: 0, padding: 6, cursor: "pointer", color: "var(--ink-3)" }}>
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Steps strip */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {["connect", "pick", "map", step === "syncing" || step === "done" ? "done" : "sync"].map((s, i) => {
            const order = ["connect", "pick", "map", "sync"];
            const stepIdx = step === "syncing" || step === "done" ? 3 : order.indexOf(step);
            const active = i <= stepIdx;
            return <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: active ? "var(--sunrise)" : "var(--paper-3)" }}></div>;
          })}
        </div>

        {step === "connect" && (
          <SheetsStep title="Connect a Google account" body={`Sign in once with the studio's Google account. Sheets access is read-only for ${verb === "export" ? "writes" : "reads"}; the studio can revoke access anytime.`}>
            <GoogleAccountRow email="studio@ronklimovsky.com" connected />
          </SheetsStep>
        )}

        {step === "pick" && (
          <SheetsStep title={mode === "import" ? "Choose the sheet to import" : "Choose a destination"}
            body={mode === "import"
              ? `Pick a Google Sheet. The first row must be column headers — ${cfg.headerHint}.`
              : `A new sheet named "${sheetName} — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}" will be created in the studio's Drive.`}>
            {cfg.sheets.map((s) => (
              <SheetRow key={s.name} name={s.name} updated={s.updated} rows={s.rows} selected={!!s.selected} />
            ))}
          </SheetsStep>
        )}

        {step === "map" && (
          <SheetsStep title="Map the columns"
            body="The first row of the sheet should be column headers. Match each column to a field on the studio site. Unmapped columns are ignored.">
            {cfg.columns.map(([sheet, site]) => (
              <ColumnMapRow key={sheet} sheet={sheet} site={site} />
            ))}
          </SheetsStep>
        )}

        {step === "syncing" && (
          <div style={{ padding: "20px 0" }}>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, color: "var(--ink-1)", marginBottom: 8 }}>
              {mode === "import" ? "Pulling from the sheet…" : "Writing to the sheet…"}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 18 }}>{Math.floor(progress)}% — please don't close this window.</div>
            <div style={{ height: 6, background: "var(--paper-2)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: progress + "%", height: "100%", background: "linear-gradient(90deg, var(--sunrise), var(--burn-bright, #FFB347))", transition: "width 200ms ease" }}></div>
            </div>
          </div>
        )}

        {step === "done" && (
          <div style={{ padding: "20px 0 8px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: "rgba(80,140,90,0.10)", color: "#4A7A52", display: "grid", placeItems: "center", margin: "0 auto 16px", fontSize: 24 }}>✓</div>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 24, color: "var(--ink-1)" }}>
              {mode === "import" ? "Imported." : "Exported."}
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 8, maxWidth: "36ch", margin: "8px auto 0" }}>
              {mode === "import"
                ? `${count} rows synced to the ${cfg.catalogNoun}. ${Math.round(count / 3)} updated; ${count - Math.round(count / 3)} unchanged; 0 conflicts.`
                : `${count} ${cfg.nounPlural} exported. The sheet is in the studio's Google Drive.`}
            </p>
            {mode === "export" && (
              <a href="#" onClick={(e) => e.preventDefault()} style={{ display: "inline-block", marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.10em", color: "var(--sunrise)", textTransform: "uppercase" }}>
                Open in Google Sheets ↗
              </a>
            )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--mist, #E6DED2)" }}>
          <AdminBtn onClick={onClose} kind="ghost">Cancel</AdminBtn>
          {step !== "syncing" && (
            <AdminBtn onClick={advance} kind="primary">
              {step === "connect" ? "Continue" :
               step === "pick"    ? "Continue" :
               step === "map"     ? (mode === "import" ? `Import ${count} rows` : "Export to sheet") :
               step === "done"    ? "Done" : "Continue"}
            </AdminBtn>
          )}
        </div>
      </div>
    </div>
  );
}

function SheetsStep({ title, body, children }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, color: "var(--ink-1)", marginBottom: 6 }}>{title}</div>
      <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55, marginBottom: 18 }}>{body}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

function GoogleAccountRow({ email, connected }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "1px solid var(--mist, #E6DED2)", borderRadius: 16, background: "var(--paper)" }}>
      <div style={{ width: 32, height: 32, borderRadius: 999, background: "var(--bone)", border: "1px solid var(--mist)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontSize: 16, fontStyle: "italic", color: "var(--ink-2)" }}>G</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-1)" }}>{email}</div>
        <div style={{ ...adminToken(null, true), fontSize: 10 }}>{connected ? "Connected · Drive · Sheets" : "Not connected"}</div>
      </div>
      {connected
        ? <StatusTag status="On view" />
        : <AdminBtn>Sign in</AdminBtn>}
    </div>
  );
}

function SheetRow({ name, updated, rows, selected = false }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "1px solid " + (selected ? "var(--sunrise)" : "var(--mist, #E6DED2)"), borderRadius: 16, background: selected ? "rgba(255,122,61,0.04)" : "var(--paper)", cursor: "pointer" }}>
      <input type="radio" name="sheet" defaultChecked={selected} style={{ accentColor: "var(--sunrise)" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-1)" }}>{name}</div>
        <div style={{ ...adminToken(null, true), fontSize: 10 }}>Updated {updated} · {rows} rows</div>
      </div>
    </label>
  );
}

function ColumnMapRow({ sheet, site }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center", padding: "8px 0" }}>
      <div style={{ padding: "10px 14px", border: "1px solid var(--mist, #E6DED2)", borderRadius: 12, background: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-1)" }}>{sheet}</div>
      <div style={{ color: "var(--ink-3)", fontSize: 14 }}>→</div>
      <div style={{ padding: "10px 14px", border: "1px solid var(--mist, #E6DED2)", borderRadius: 12, background: "var(--bone)", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-1)" }}>{site}</div>
    </div>
  );
}

// ── Section 1 — Artworks ──────────────────────────────────────────────────

function ArtworksAdmin() {
  const [items, setItems] = React.useState(() => ARTWORKS.map(a => ({ ...a })));
  const [filter, setFilter] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState(null);
  const [sheets, setSheets] = React.useState(null); // null | "import" | "export"

  const filtered = items.filter((a) => {
    if (filter === "on-view" && a.status !== "On view") return false;
    if (filter === "sold"    && a.status !== "Sold") return false;
    if (query && !(a.title + " " + a.medium + " " + a.series).toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const update = (id, patch) => setItems((xs) => xs.map(x => x.id === id ? { ...x, ...patch } : x));
  const remove = (id) => setItems((xs) => xs.filter(x => x.id !== id));
  const add = () => {
    const id = "w-" + Date.now();
    const w = { id, title: "Untitled", medium: "Oil on linen", size_in: "—", size_cm: "", year: new Date().getFullYear(), series: "Rooms at dawn", status: "On view", price: "Inquire", palette: ["#FFD4B8", "#FF9A75", "#C44A1F", "#2C1208"], grad: "linear-gradient(155deg, #FFE2C9 0%, #FF9A75 38%, #C44A1F 78%, #3B1610 100%)", note: "" };
    setItems((xs) => [w, ...xs]);
    setEditing(w);
  };

  return (
    <>
      <SectionHeader
        eyebrow="Catalog · 01"
        title="Artworks"
        blurb="The studio catalog. Add, edit, or retire pieces. Changes here go live on the public site once published."
        actions={
          <>
            <AdminBtn onClick={() => setSheets("import")}>↓ Import from Sheets</AdminBtn>
            <AdminBtn onClick={() => setSheets("export")}>↑ Export to Sheets</AdminBtn>
            <AdminBtn onClick={add} kind="primary">+ Add artwork</AdminBtn>
          </>
        }
      />

      {/* Filter bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--paper-2)", borderRadius: 999 }}>
          {[["all", "All", items.length], ["on-view", "On view", items.filter(a => a.status === "On view").length], ["sold", "Sold", items.filter(a => a.status === "Sold").length]].map(([id, label, n]) => (
            <button key={id} onClick={() => setFilter(id)} style={{
              border: 0, padding: "8px 14px", borderRadius: 999,
              background: filter === id ? "var(--bone)" : "transparent",
              boxShadow: filter === id ? "var(--shadow-xs, 0 1px 2px rgba(26,20,16,0.06))" : "none",
              fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-1)",
              cursor: "pointer", display: "flex", gap: 8, alignItems: "center"
            }}>
              {label}
              <span style={{ ...adminToken(null, true), fontSize: 10, color: "var(--ink-3)" }}>{n}</span>
            </button>
          ))}
        </div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, medium, series…"
          style={{
            flex: 1, minWidth: 220, padding: "10px 16px",
            borderRadius: 999, border: "1px solid var(--mist, #E6DED2)",
            background: "var(--bone)", fontFamily: "var(--font-ui)", fontSize: 13, outline: "none",
            color: "var(--ink-1)"
          }} />
      </div>

      {/* Table */}
      <div style={{ background: "var(--bone)", border: "1px solid var(--mist, #E6DED2)", borderRadius: 22, overflow: "hidden" }}>
        <div className="admin-table-head" style={{ display: "grid", gridTemplateColumns: "80px 2fr 1.5fr 1fr 0.8fr 0.8fr 90px", padding: "14px 20px", background: "var(--paper-2)", ...adminToken(null, true), color: "var(--ink-3)", gap: 16, alignItems: "center" }}>
          <div></div>
          <div>Title</div>
          <div>Medium</div>
          <div>Dimensions</div>
          <div>Year</div>
          <div>Status</div>
          <div></div>
        </div>
        {filtered.map((w, idx) => (
          <div key={w.id} className="admin-table-row" style={{
            display: "grid", gridTemplateColumns: "80px 2fr 1.5fr 1fr 0.8fr 0.8fr 90px",
            padding: "14px 20px", gap: 16, alignItems: "center",
            borderTop: idx === 0 ? 0 : "1px solid var(--mist, #E6DED2)",
            cursor: "pointer"
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--paper)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            onClick={() => setEditing(w)}>
            <div style={{ width: 56, height: 56, borderRadius: 8, background: w.grad, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 4px 10px -4px rgba(26,20,16,0.2)" }}></div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17, color: "var(--ink-1)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>{w.title}</div>
              <div style={{ ...adminToken(null, true), fontSize: 10, marginTop: 2 }}>{w.series}</div>
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-2)" }}>{w.medium}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)" }}>{w.size_in}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)" }}>{w.year}</div>
            <div><StatusTag status={w.status} /></div>
            <div style={{ textAlign: "right" }}>
              <button onClick={(e) => { e.stopPropagation(); if (confirm("Remove " + w.title + " from the catalog?")) remove(w.id); }} style={{ background: "transparent", border: 0, color: "var(--ink-3)", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-ui)" }}>Remove</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--font-ui)", fontSize: 14 }}>Nothing matches that filter.</div>
        )}
      </div>

      {editing && <ArtworkEditor work={editing} onSave={(patch) => { update(editing.id, patch); setEditing(null); }} onClose={() => setEditing(null)} />}
      <SheetsDialog open={!!sheets} mode={sheets} onClose={() => setSheets(null)} sheetName="Artworks" entity="artworks" count={items.length} />
    </>
  );
}

function ArtworkEditor({ work, onSave, onClose }) {
  const [w, setW] = React.useState(work);
  const set = (k, v) => setW((x) => ({ ...x, [k]: v }));
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 90,
      background: "rgba(26,20,16,0.32)", backdropFilter: "blur(8px)",
      display: "grid", placeItems: "center", padding: 24
    }}>
      <div onClick={(e) => e.stopPropagation()} className="lg-strong admin-modal" style={{
        width: "min(720px, 100%)", maxHeight: "90vh", overflowY: "auto",
        borderRadius: 32, padding: "32px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <Eyebrow>Edit · artwork</Eyebrow>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 30, color: "var(--ink-1)", letterSpacing: "-0.02em", marginTop: 6, lineHeight: 1 }}>{w.title || "Untitled"}</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: 0, padding: 6, cursor: "pointer", color: "var(--ink-3)" }}><CloseIcon size={18} /></button>
        </div>

        <div className="artwork-editor-grid" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24 }}>
          <div className="artwork-editor-image">
            <div style={{ aspectRatio: "4/5", borderRadius: 12, background: w.grad, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(26,20,16,0.25)" }}></div>
            <AdminBtn style={{ width: "100%", marginTop: 10, justifyContent: "center", display: "flex" }}>Replace image</AdminBtn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <AdminField label="Title" full><input value={w.title} onChange={(e) => set("title", e.target.value)} style={inputStyle()} /></AdminField>
            <AdminField label="Medium"><input value={w.medium} onChange={(e) => set("medium", e.target.value)} style={inputStyle()} /></AdminField>
            <AdminField label="Year"><input type="number" value={w.year} onChange={(e) => set("year", +e.target.value)} style={inputStyle()} /></AdminField>
            <AdminField label="Dimensions (imperial)"><input value={w.size_in} onChange={(e) => set("size_in", e.target.value)} style={inputStyle()} /></AdminField>
            <AdminField label="Dimensions (metric)"><input value={w.size_cm} onChange={(e) => set("size_cm", e.target.value)} style={inputStyle()} /></AdminField>
            <AdminField label="Series">
              <select value={w.series} onChange={(e) => set("series", e.target.value)} style={inputStyle()}>
                {["Rooms at dawn", "Interiors", "Drawings", "Editions & plates"].map(s => <option key={s}>{s}</option>)}
              </select>
            </AdminField>
            <AdminField label="Status">
              <select value={w.status} onChange={(e) => set("status", e.target.value)} style={inputStyle()}>
                {["On view", "Available", "Sold"].map(s => <option key={s}>{s}</option>)}
              </select>
            </AdminField>
            <AdminField label="Price" full><input value={w.price} onChange={(e) => set("price", e.target.value)} style={inputStyle()} placeholder="Inquire · or $X,XXX" /></AdminField>
            <AdminField label="Studio note" full><textarea value={w.note} onChange={(e) => set("note", e.target.value)} rows={3} style={{ ...inputStyle(), resize: "vertical" }} /></AdminField>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--mist, #E6DED2)" }}>
          <AdminBtn onClick={onClose} kind="ghost">Cancel</AdminBtn>
          <AdminBtn onClick={() => onSave(w)} kind="primary">Save changes</AdminBtn>
        </div>
      </div>
    </div>
  );
}

function AdminField({ label, children, full }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: full ? "1 / -1" : "auto" }}>
      <span style={{ ...adminToken(null, true) }}>{label}</span>
      {children}
    </label>
  );
}

function inputStyle() {
  return {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid var(--mist, #E6DED2)",
    background: "var(--paper)",
    fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-1)",
    outline: "none", width: "100%"
  };
}

// ── Section 2 — Inquiries ─────────────────────────────────────────────────

function InquiriesAdmin() {
  const [items, setItems] = React.useState(MOCK_INQUIRIES);
  const [filter, setFilter] = React.useState("all");
  const [selectedId, setSelectedId] = React.useState(MOCK_INQUIRIES[0]?.id);

  const filtered = items.filter((i) => {
    if (filter === "new")      return i.status === "new";
    if (filter === "replied")  return i.status === "replied";
    if (filter === "archived") return i.status === "archived";
    return i.status !== "archived";
  });

  const selected = items.find((i) => i.id === selectedId);
  const update = (id, patch) => setItems((xs) => xs.map(x => x.id === id ? { ...x, ...patch } : x));
  const markAllRead = () => setItems((xs) => xs.map(x => x.status === "new" ? { ...x, status: "read" } : x));

  return (
    <>
      <SectionHeader
        eyebrow="Correspondence · 02"
        title="Inquiries"
        blurb="Messages from the public site's inquire form. Reply directly, or archive for the catalog."
        actions={
          <>
            <AdminBtn>↑ Export to Sheets</AdminBtn>
            <AdminBtn kind="primary" onClick={markAllRead}>Mark all read</AdminBtn>
          </>
        }
      />

      <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--paper-2)", borderRadius: 999, width: "fit-content", marginBottom: 22 }}>
        {[["all", "All", items.filter(i => i.status !== "archived").length], ["new", "New", items.filter(i => i.status === "new").length], ["replied", "Replied", items.filter(i => i.status === "replied").length], ["archived", "Archived", items.filter(i => i.status === "archived").length]].map(([id, label, n]) => (
          <button key={id} onClick={() => setFilter(id)} style={{
            border: 0, padding: "8px 14px", borderRadius: 999,
            background: filter === id ? "var(--bone)" : "transparent",
            fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-1)", cursor: "pointer", display: "flex", gap: 8, alignItems: "center"
          }}>{label}<span style={{ ...adminToken(null, true), fontSize: 10, color: "var(--ink-3)" }}>{n}</span></button>
        ))}
      </div>

      <div className="inquiries-pane" style={{ display: "grid", gridTemplateColumns: "minmax(280px, 360px) 1fr", gap: 20, alignItems: "start" }}>
        {/* List */}
        <div style={{ background: "var(--bone)", border: "1px solid var(--mist, #E6DED2)", borderRadius: 22, overflow: "hidden", maxHeight: "70vh", overflowY: "auto" }}>
          {filtered.map((i, idx) => (
            <button key={i.id} onClick={() => { setSelectedId(i.id); if (i.status === "new") update(i.id, { status: "read" }); }} style={{
              width: "100%", textAlign: "left", border: 0, padding: "16px 18px",
              background: i.id === selectedId ? "var(--paper)" : "transparent",
              borderTop: idx === 0 ? 0 : "1px solid var(--mist, #E6DED2)",
              cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 4
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-1)", fontWeight: i.status === "new" ? 600 : 400, display: "flex", alignItems: "center", gap: 6 }}>
                  {i.status === "new" && <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--sunrise)" }}></span>}
                  {i.from}
                </div>
                <div style={{ ...adminToken(null, true), fontSize: 10 }}>{i.date.slice(5)}</div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>{i.subject}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{i.body}</div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--font-ui)", fontSize: 14 }}>No messages here.</div>
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div style={{ background: "var(--bone)", border: "1px solid var(--mist, #E6DED2)", borderRadius: 22, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
              <div>
                <Eyebrow>{selected.date} · {selected.work ? "Regarding " + selected.work : "General inquiry"}</Eyebrow>
                <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 28, color: "var(--ink-1)", letterSpacing: "-0.02em", marginTop: 6, lineHeight: 1.1 }}>{selected.subject}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-2)", marginTop: 10 }}>
                  {selected.from} &lt;{selected.email}&gt;
                  {selected.phone && <> · {selected.phone}</>}
                </div>
              </div>
              <StatusTag status={selected.status} />
            </div>

            <div style={{ padding: "20px 0", borderTop: "1px solid var(--mist, #E6DED2)", borderBottom: "1px solid var(--mist, #E6DED2)", fontSize: 14.5, color: "var(--ink-1)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{selected.body}</div>

            <div style={{ marginTop: 22 }}>
              <Eyebrow>Reply</Eyebrow>
              <textarea placeholder="Write a reply — it will be sent from studio@ronklimovsky.com" rows={4} style={{ ...inputStyle(), marginTop: 8, resize: "vertical" }}></textarea>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, gap: 8, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <AdminBtn onClick={() => update(selected.id, { status: "archived" })}>Archive</AdminBtn>
                  <AdminBtn onClick={() => update(selected.id, { status: "new" })}>Mark unread</AdminBtn>
                </div>
                <AdminBtn kind="primary" onClick={() => update(selected.id, { status: "replied" })}>Send reply</AdminBtn>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Section 3 — Mailing & phone list ──────────────────────────────────────

function MailingAdmin() {
  const [items, setItems] = React.useState(MOCK_SUBSCRIBERS);
  const [query, setQuery] = React.useState("");
  const [tag, setTag] = React.useState("all");
  const [sheets, setSheets] = React.useState(null);

  const allTags = Array.from(new Set(items.flatMap(i => i.tags)));
  const filtered = items.filter((s) => {
    if (tag !== "all" && !s.tags.includes(tag)) return false;
    if (query && !(s.name + " " + s.email + " " + (s.phone || "")).toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <SectionHeader
        eyebrow="Audience · 03"
        title="Mailing & phone list"
        blurb="Everyone who has opted in to hear from the studio. Used for the studio newsletter and, occasionally, exhibition postcards."
        actions={
          <>
            <AdminBtn onClick={() => setSheets("import")}>↓ Import from Sheets</AdminBtn>
            <AdminBtn onClick={() => setSheets("export")}>↑ Export to Sheets</AdminBtn>
            <AdminBtn kind="primary">+ Add contact</AdminBtn>
          </>
        }
      />

      <div style={{ display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone…"
          style={{ flex: 1, minWidth: 220, padding: "10px 16px", borderRadius: 999, border: "1px solid var(--mist, #E6DED2)", background: "var(--bone)", fontFamily: "var(--font-ui)", fontSize: 13, outline: "none", color: "var(--ink-1)" }} />
        <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--paper-2)", borderRadius: 999 }}>
          <FilterPill active={tag === "all"} onClick={() => setTag("all")}>All · {items.length}</FilterPill>
          {allTags.map((t) => (
            <FilterPill key={t} active={tag === t} onClick={() => setTag(t)}>{t}</FilterPill>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--bone)", border: "1px solid var(--mist, #E6DED2)", borderRadius: 22, overflow: "hidden" }}>
        <div className="admin-mailing-head" style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1.2fr 1.4fr 1fr", padding: "14px 20px", background: "var(--paper-2)", ...adminToken(null, true), color: "var(--ink-3)", gap: 16 }}>
          <div>Name</div><div>Email</div><div>Phone</div><div>Source</div><div>Tags</div><div>Joined</div>
        </div>
        {filtered.map((s, idx) => (
          <div key={s.id} className="admin-mailing-row" style={{
            display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1.2fr 1.4fr 1fr",
            padding: "14px 20px", gap: 16, alignItems: "center",
            borderTop: idx === 0 ? 0 : "1px solid var(--mist, #E6DED2)",
            fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-1)"
          }}>
            <div>{s.name}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-2)", wordBreak: "break-all" }}>{s.email}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-2)" }}>{s.phone || <span style={{ color: "var(--ink-4, var(--ink-3))" }}>—</span>}</div>
            <div style={{ color: "var(--ink-3)" }}>{s.source}</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {s.tags.map((t) => (
                <span key={t} style={{ padding: "2px 8px", borderRadius: 999, background: "var(--paper-2)", fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>{t}</span>
              ))}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>{s.joined}</div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--font-ui)", fontSize: 14 }}>No contacts match.</div>}
      </div>

      <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", ...adminToken(null, true), fontSize: 10.5 }}>
        <div>{filtered.length} of {items.length} contacts</div>
        <div>{items.filter(s => s.phone).length} with phone · {items.length} with email</div>
      </div>

      <SheetsDialog open={!!sheets} mode={sheets} onClose={() => setSheets(null)} sheetName="Subscribers" entity="subscribers" count={items.length} />
    </>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      border: 0, padding: "8px 14px", borderRadius: 999,
      background: active ? "var(--bone)" : "transparent",
      fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--ink-1)", cursor: "pointer",
      letterSpacing: "-0.005em"
    }}>{children}</button>
  );
}

// ── Section 4 — Exhibitions & events ──────────────────────────────────────

function ExhibitionsAdmin() {
  const [items, setItems] = React.useState(EXHIBITIONS.map(x => ({ ...x })));
  const [editing, setEditing] = React.useState(null);

  const grouped = {
    Upcoming: items.filter(x => x.status === "Upcoming"),
    "On view": items.filter(x => x.status === "On view"),
    Past: items.filter(x => x.status === "Past"),
  };

  const remove = (id) => setItems((xs) => xs.filter(x => x.id !== id));
  const update = (id, patch) => setItems((xs) => xs.map(x => x.id === id ? { ...x, ...patch } : x));
  const add = () => {
    const e = { id: "x-" + Date.now(), year: new Date().getFullYear(), season: "Autumn", title: "Untitled show", venue: "—", city: "—", dates: "—", status: "Upcoming", blurb: "" };
    setItems((xs) => [e, ...xs]);
    setEditing(e);
  };

  return (
    <>
      <SectionHeader
        eyebrow="Calendar · 04"
        title="Exhibitions & events"
        blurb="The studio's public calendar — open studios, group shows, talks, residencies."
        actions={<AdminBtn onClick={add} kind="primary">+ Add exhibition</AdminBtn>}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {Object.entries(grouped).map(([group, list]) => (
          list.length === 0 ? null : (
            <div key={group}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 28, color: "var(--ink-1)", letterSpacing: "-0.02em", margin: 0, fontWeight: 400 }}>{group}</h2>
                <div style={{ ...adminToken(null, true), fontSize: 10.5 }}>{list.length} {list.length === 1 ? "entry" : "entries"}</div>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {list.map((x) => (
                  <article key={x.id} style={{ background: "var(--bone)", border: "1px solid var(--mist, #E6DED2)", borderRadius: 22, padding: "20px 24px", display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 24, alignItems: "center" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontStyle: "italic", color: "var(--ink-1)", lineHeight: 1, fontWeight: 400 }}>{x.year}</div>
                      <div style={{ ...adminToken(null, true), fontSize: 10.5, marginTop: 4 }}>{x.season}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, color: "var(--ink-1)", letterSpacing: "-0.015em", lineHeight: 1.2 }}>{x.title}</div>
                      <div style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--ink-2)", marginTop: 4 }}>{x.venue} · {x.city}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", marginTop: 6, letterSpacing: "0.04em" }}>{x.dates}</div>
                      {x.blurb && <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55, margin: "10px 0 0", maxWidth: "62ch" }}>{x.blurb}</p>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                      <StatusTag status={x.status} />
                      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                        <AdminBtn onClick={() => setEditing(x)}>Edit</AdminBtn>
                        <button onClick={() => { if (confirm("Remove " + x.title + "?")) remove(x.id); }} style={{ background: "transparent", border: 0, color: "var(--ink-3)", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-ui)", padding: "10px 8px" }}>Remove</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {editing && <ExhibitionEditor item={editing} onSave={(patch) => { update(editing.id, patch); setEditing(null); }} onClose={() => setEditing(null)} />}
    </>
  );
}

function ExhibitionEditor({ item, onSave, onClose }) {
  const [x, setX] = React.useState(item);
  const set = (k, v) => setX((s) => ({ ...s, [k]: v }));
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(26,20,16,0.32)", backdropFilter: "blur(8px)", display: "grid", placeItems: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} className="lg-strong admin-modal" style={{ width: "min(640px, 100%)", borderRadius: 32, padding: 32, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <Eyebrow>Edit · exhibition</Eyebrow>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 28, color: "var(--ink-1)", letterSpacing: "-0.02em", marginTop: 6, lineHeight: 1 }}>{x.title || "Untitled"}</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: 0, padding: 6, cursor: "pointer", color: "var(--ink-3)" }}><CloseIcon size={18} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <AdminField label="Title" full><input value={x.title} onChange={(e) => set("title", e.target.value)} style={inputStyle()} /></AdminField>
          <AdminField label="Venue"><input value={x.venue} onChange={(e) => set("venue", e.target.value)} style={inputStyle()} /></AdminField>
          <AdminField label="City"><input value={x.city} onChange={(e) => set("city", e.target.value)} style={inputStyle()} /></AdminField>
          <AdminField label="Year"><input type="number" value={x.year} onChange={(e) => set("year", +e.target.value)} style={inputStyle()} /></AdminField>
          <AdminField label="Season">
            <select value={x.season} onChange={(e) => set("season", e.target.value)} style={inputStyle()}>
              {["Spring", "Summer", "Autumn", "Winter"].map(s => <option key={s}>{s}</option>)}
            </select>
          </AdminField>
          <AdminField label="Dates" full><input value={x.dates} onChange={(e) => set("dates", e.target.value)} style={inputStyle()} placeholder="e.g. April 18 — June 14, 2026" /></AdminField>
          <AdminField label="Status" full>
            <select value={x.status} onChange={(e) => set("status", e.target.value)} style={inputStyle()}>
              {["Upcoming", "On view", "Past"].map(s => <option key={s}>{s}</option>)}
            </select>
          </AdminField>
          <AdminField label="Blurb" full><textarea value={x.blurb} onChange={(e) => set("blurb", e.target.value)} rows={3} style={{ ...inputStyle(), resize: "vertical" }} /></AdminField>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--mist, #E6DED2)" }}>
          <AdminBtn onClick={onClose} kind="ghost">Cancel</AdminBtn>
          <AdminBtn onClick={() => onSave(x)} kind="primary">Save changes</AdminBtn>
        </div>
      </div>
    </div>
  );
}

// ── Top-level Admin shell ──────────────────────────────────────────────────

function Admin({ onExit }) {
  const [authed, setAuthed] = React.useState(() => {
    try { return sessionStorage.getItem(ADMIN_SESSION_KEY) === "ok"; } catch (e) { return false; }
  });
  const [section, setSection] = React.useState("analytics");

  // Search-engine hardening: while the admin route is mounted, tell every
  // crawler to skip indexing. The robots.txt also disallows /admin, but
  // a stray client-side path can still be hit — belt + suspenders.
  React.useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive, nosnippet";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Studio backstage — private";
    return () => {
      meta.remove();
      document.title = prevTitle;
    };
  }, []);

  React.useEffect(() => {
    const handler = () => onExit && onExit();
    window.addEventListener("rk-admin-exit", handler);
    return () => window.removeEventListener("rk-admin-exit", handler);
  }, [onExit]);

  const logout = () => {
    try { sessionStorage.removeItem(ADMIN_SESSION_KEY); } catch (e) {}
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
        <AdminLogin onAuth={() => setAuthed(true)} />
      </div>
    );
  }

  const counts = {
    artworks: ARTWORKS.length,
    inquiries: MOCK_INQUIRIES.length,
    inquiriesNew: MOCK_INQUIRIES.filter(i => i.status === "new").length,
    subscribers: MOCK_SUBSCRIBERS.length,
    exhibitions: EXHIBITIONS.length,
  };

  return (
    <div className="admin-shell" style={{ display: "flex", minHeight: "100vh", background: "var(--paper)", position: "relative", zIndex: 1 }}>
      <AdminSidebar section={section} onSection={setSection} onLogout={logout} onExit={onExit} counts={counts} />
      <main className="admin-main" style={{ flex: 1, padding: "48px 56px", maxWidth: 1280, minWidth: 0 }}>
        {section === "analytics"   && <AnalyticsAdmin />}
        {section === "artworks"    && <ArtworksAdmin />}
        {section === "inquiries"   && <InquiriesAdmin />}
        {section === "mailing"     && <MailingAdmin />}
        {section === "exhibitions" && <ExhibitionsAdmin />}
      </main>
    </div>
  );
}

Object.assign(window, { Admin });

// ══════════════════════════════════════════════════════════════════════════
// Analytics — visitor & engagement panel
// ══════════════════════════════════════════════════════════════════════════

// Two years of daily visits. Synthetic but realistic — a small studio site:
// weekly rhythm (weekends quieter), recurring newsletter blasts, show
// openings, and a gentle upward trend as the audience grows.
const ANALYTICS_DAILY = (() => {
  const out = [];
  const base = new Date("2026-05-21");
  const TOTAL = 730; // two years — enough for "last 365" with a previous-365 comparison window
  for (let i = TOTAL - 1; i >= 0; i--) {
    const d = new Date(base); d.setDate(d.getDate() - i);
    const dow = d.getDay(); // 0 Sun, 6 Sat
    const m = d.getMonth();
    const day = d.getDate();
    const year = d.getFullYear();

    // baseline + weekly rhythm; seasonal dip in mid-summer
    let v = 60 + Math.sin(i * 0.7) * 12 + (dow === 0 || dow === 6 ? -20 : 0);
    v += Math.sin((d.getTime() / 86400000) * (2 * Math.PI / 365)) * -10; // mild seasonal

    // newsletter blasts — quarterly-ish
    const blasts = [
      { y: 2026, m: 3, d: 22, peak: 280 },
      { y: 2026, m: 1, d: 14, peak: 220 },
      { y: 2025, m: 10, d: 6, peak: 240 },
      { y: 2025, m: 7, d: 18, peak: 180 },
      { y: 2025, m: 4, d: 24, peak: 200 },
      { y: 2024, m: 10, d: 8, peak: 200 }];

    for (const b of blasts) {
      if (year === b.y && m === b.m && day === b.d) v += b.peak;
      if (year === b.y && m === b.m && day === b.d + 1) v += b.peak * 0.55;
      if (year === b.y && m === b.m && day === b.d + 2) v += b.peak * 0.25;
    }

    // open-studio / show-opening bumps
    const openings = [
      { y: 2026, m: 4, d: 6,  peak: 210 }, // Rooms at dawn — open studio
      { y: 2025, m: 9, d: 12, peak: 260 }, // Quiet hours (Kammer 12, Vienna)
      { y: 2025, m: 2, d: 28, peak: 180 }, // Drawings, in passing (Galería Pequeña)
      { y: 2024, m: 10, d: 1, peak: 170 }];

    for (const o of openings) {
      if (year === o.y && m === o.m && day === o.d)     v += o.peak;
      if (year === o.y && m === o.m && day === o.d + 1) v += o.peak * 0.5;
      if (year === o.y && m === o.m && day === o.d + 2) v += o.peak * 0.22;
    }

    // gentle upward trend over the full period — audience grows ~30% over two years
    v += (TOTAL - i) * 0.06;
    v += (i * 9301 + 49297) % 23 - 8;
    out.push({ date: d, visits: Math.max(18, Math.round(v)) });
  }
  return out;
})();

// The public site is a single page with in-page hash sections (see the
// SiteNavigation schema + sitemap). Top pages reflect those real anchors —
// no per-work URLs, which don't exist in this build.
const ANALYTICS_TOP_PAGES = [
  { path: "/",             title: "Home",         views: 4218, share: 38 },
  { path: "/#on-view",     title: "On view",       views: 2104, share: 19 },
  { path: "/#exhibitions", title: "Exhibitions",   views: 1192, share: 11 },
  { path: "/#worlds",      title: "Worlds",        views: 1024, share:  9 },
  { path: "/#about",       title: "About",         views:  868, share:  8 },
  { path: "/#editions",    title: "Editions",      views:  712, share:  6 },
  { path: "/#notes",       title: "Studio notes",  views:  498, share:  4 },
];

const ANALYTICS_SOURCES = [
  { name: "Direct",       value: 38, color: "var(--ink-1)" },
  { name: "Google",       value: 24, color: "var(--sunrise)" },
  { name: "Instagram",    value: 16, color: "#C99AAF" },
  { name: "Newsletter",   value: 12, color: "#FFB347" },
  { name: "Referrals",    value: 10, color: "#A8B4C8" },
];

const ANALYTICS_COUNTRIES = [
  { name: "United States",  visits: 1284, share: 45 },
  { name: "Germany",        visits:  412, share: 14 },
  { name: "Mexico",         visits:  286, share: 10 },
  { name: "Japan",          visits:  208, share:  7 },
  { name: "United Kingdom", visits:  186, share:  6 },
  { name: "France",         visits:  144, share:  5 },
  { name: "Other (28)",     visits:  327, share: 13 },
];

const ANALYTICS_ARTWORK_VIEWS = [
  { id: "w-1", views: 1486, dwell: "2:14", inquiries: 4 },
  { id: "w-3", views:  814, dwell: "1:48", inquiries: 2 },
  { id: "w-6", views:  486, dwell: "1:36", inquiries: 1 },
  { id: "w-8", views:  402, dwell: "1:22", inquiries: 1 },
  { id: "w-4", views:  318, dwell: "1:08", inquiries: 0 },
  { id: "w-9", views:  264, dwell: "0:58", inquiries: 1 },
];

const ANALYTICS_DEVICES = [
  { name: "Desktop", value: 58 },
  { name: "Mobile",  value: 36 },
  { name: "Tablet",  value:  6 },
];

function AnalyticsAdmin() {
  const [range, setRange] = React.useState(30); // 7 | 30 | 90

  const slice = ANALYTICS_DAILY.slice(-range);
  const prev  = ANALYTICS_DAILY.slice(-range * 2, -range);

  const sum = (xs) => xs.reduce((a, b) => a + b.visits, 0);
  const visitors = sum(slice);
  const prevVisitors = sum(prev);
  const visitorsDelta = prevVisitors ? Math.round(((visitors - prevVisitors) / prevVisitors) * 100) : 0;

  // synthetic but consistent secondary KPIs
  const sessions  = Math.round(visitors * 1.38);
  const pageviews = Math.round(visitors * 4.02);
  const inquiries = Math.round(visitors * 0.008);
  const prevInquiries = Math.round(prevVisitors * 0.0073);
  const inquiriesDelta = prevInquiries ? Math.round(((inquiries - prevInquiries) / prevInquiries) * 100) : 0;
  const sessionsDelta  = Math.round(visitorsDelta * 0.92);
  const pageviewsDelta = Math.round(visitorsDelta * 1.06);

  return (
    <>
      <SectionHeader
        eyebrow="Overview · 00"
        title="Analytics"
        blurb="Quiet, first-party stats. No cookies, no third-party trackers. Numbers refresh every six hours."
        actions={
          <>
            <AdminBtn>↑ Export to Sheets</AdminBtn>
            <AdminBtn>Email report</AdminBtn>
          </>
        }
      />

      {/* Time range */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--paper-2)", borderRadius: 999 }}>
          {[[7, "Last 7 days"], [30, "Last 30 days"], [90, "Last 90 days"], [365, "Last year"]].map(([n, label]) => (
            <button key={n} onClick={() => setRange(n)} style={{
              border: 0, padding: "8px 14px", borderRadius: 999,
              background: range === n ? "var(--bone)" : "transparent",
              boxShadow: range === n ? "0 1px 2px rgba(26,20,16,0.06)" : "none",
              fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-1)", cursor: "pointer"
            }}>{label}</button>
          ))}
        </div>
        <div style={{ ...adminToken(null, true), fontSize: 10.5 }}>
          Compared to previous {range === 365 ? "year" : range + " days"} · last updated 11 minutes ago
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        <KPICard label="Unique visitors"  value={visitors.toLocaleString()}  delta={visitorsDelta}  />
        <KPICard label="Sessions"         value={sessions.toLocaleString()}  delta={sessionsDelta}  />
        <KPICard label="Page views"       value={pageviews.toLocaleString()} delta={pageviewsDelta} />
        <KPICard label="Inquiries sent"   value={inquiries}                  delta={inquiriesDelta} suffix=" via form" />
      </div>

      {/* Trend chart */}
      <Panel title="Visitors over time" subtitle={range === 365 ? "Daily · last 12 months" : `Daily · last ${range} days`}>
        <VisitorsLineChart data={slice} />
      </Panel>

      {/* Two-column: top pages + sources */}
      <div className="admin-cols" style={{ marginTop: 20 }}>
        <Panel title="Most-viewed pages" subtitle={`${ANALYTICS_TOP_PAGES.length} pages tracked`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ANALYTICS_TOP_PAGES.map((p) => (
              <BarRow key={p.path} label={p.title} sub={p.path} value={p.views} share={p.share} max={ANALYTICS_TOP_PAGES[0].share} />
            ))}
          </div>
        </Panel>
        <Panel title="Where visitors come from" subtitle="Traffic sources">
          <div className="sources-row">
            <SourceDonut data={ANALYTICS_SOURCES} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 0 }}>
              {ANALYTICS_SOURCES.map((s) => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flex: "0 0 auto" }} />
                  <span style={{ flex: 1, fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-1)" }}>{s.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-2)" }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Two-column: top artworks + countries */}
      <div className="admin-cols" style={{ marginTop: 20 }}>
        <Panel title="Most-looked-at paintings" subtitle="Views · average dwell · resulting inquiries">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ANALYTICS_ARTWORK_VIEWS.map((row) => {
              const w = ARTWORKS.find(a => a.id === row.id);
              if (!w) return null;
              return (
                <div key={row.id} style={{ display: "grid", gridTemplateColumns: "48px 1fr auto", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: w.grad, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 2px 6px rgba(26,20,16,0.10)" }}></div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16, color: "var(--ink-1)", letterSpacing: "-0.01em", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.title}</div>
                    <div style={{ ...adminToken(null, true), fontSize: 10, marginTop: 2 }}>{w.series}</div>
                  </div>
                  <div style={{ display: "flex", gap: 18, alignItems: "center", flex: "0 0 auto" }}>
                    <div style={{ textAlign: "right", minWidth: 56 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-1)" }}>{row.views.toLocaleString()}</div>
                      <div style={{ ...adminToken(null, true), fontSize: 9 }}>views</div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 44 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-2)" }}>{row.dwell}</div>
                      <div style={{ ...adminToken(null, true), fontSize: 9 }}>dwell</div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 28 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: row.inquiries > 0 ? "var(--sunrise)" : "var(--ink-3)" }}>{row.inquiries}</div>
                      <div style={{ ...adminToken(null, true), fontSize: 9 }}>inq.</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Where in the world" subtitle="Top countries">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ANALYTICS_COUNTRIES.map((c) => (
              <BarRow key={c.name} label={c.name} value={c.visits} share={c.share} max={ANALYTICS_COUNTRIES[0].share} />
            ))}
          </div>
        </Panel>
      </div>

      {/* Devices strip */}
      <div style={{ marginTop: 20 }}>
        <Panel title="Devices" subtitle="How people read the studio">
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {ANALYTICS_DEVICES.map((d) => (
              <div key={d.name} style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-1)" }}>{d.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)" }}>{d.value}%</div>
                </div>
                <div style={{ height: 4, background: "var(--paper-2)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: d.value + "%", background: "linear-gradient(90deg, var(--ink-1), var(--ink-3))", borderRadius: 999 }}></div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

// ── Analytics building blocks ──────────────────────────────────────────────

function Panel({ title, subtitle, children, actions }) {
  return (
    <section style={{ background: "var(--bone)", border: "1px solid var(--mist, #E6DED2)", borderRadius: 22, padding: "22px 24px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18, gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, color: "var(--ink-1)", letterSpacing: "-0.015em", fontWeight: 400, lineHeight: 1.1 }}>{title}</div>
          {subtitle && <div style={{ ...adminToken(null, true), fontSize: 10, marginTop: 4 }}>{subtitle}</div>}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}

function KPICard({ label, value, delta, suffix }) {
  const up = delta >= 0;
  return (
    <div style={{ background: "var(--bone)", border: "1px solid var(--mist, #E6DED2)", borderRadius: 22, padding: "20px 22px" }}>
      <div style={{ ...adminToken(null, true), fontSize: 10 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 42, color: "var(--ink-1)", letterSpacing: "-0.025em", lineHeight: 1, fontWeight: 400, marginTop: 10 }}>
        {value}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.04em" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 8px", borderRadius: 999,
          background: up ? "rgba(80,140,90,0.10)" : "rgba(196,74,31,0.10)",
          color: up ? "#4A7A52" : "#A8401C",
        }}>
          {up ? "↑" : "↓"} {Math.abs(delta)}%
        </span>
        <span style={{ color: "var(--ink-3)" }}>vs previous{suffix || ""}</span>
      </div>
    </div>
  );
}

function VisitorsLineChart({ data }) {
  const W = 920;
  const H = 220;
  const PAD_X = 12;
  const PAD_Y = 16;
  const max = Math.max(...data.map(d => d.visits));
  const min = 0;
  const dx = (W - PAD_X * 2) / Math.max(1, data.length - 1);
  const yOf = (v) => H - PAD_Y - ((v - min) / (max - min)) * (H - PAD_Y * 2);

  const pts = data.map((d, i) => [PAD_X + i * dx, yOf(d.visits)]);
  const linePath = pts.map(([x, y], i) => (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1)).join(" ");
  const fillPath = linePath + ` L${(PAD_X + (data.length - 1) * dx).toFixed(1)},${H - PAD_Y} L${PAD_X},${H - PAD_Y} Z`;

  const [hover, setHover] = React.useState(null);

  // pick 4 evenly-spaced x-axis labels
  const labelIdx = [0, Math.floor(data.length / 3), Math.floor(data.length * 2 / 3), data.length - 1];
  const fmtDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H} style={{ display: "block" }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round((x - PAD_X) / dx);
          if (i >= 0 && i < data.length) setHover(i);
        }}
        onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="visFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--sunrise)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--sunrise)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* horizontal grid */}
        {[0.25, 0.5, 0.75].map((p) => (
          <line key={p} x1={PAD_X} x2={W - PAD_X} y1={H - PAD_Y - p * (H - PAD_Y * 2)} y2={H - PAD_Y - p * (H - PAD_Y * 2)} stroke="var(--mist, #E6DED2)" strokeWidth="1" strokeDasharray="2 4" />
        ))}
        <path d={fillPath} fill="url(#visFill)" />
        <path d={linePath} fill="none" stroke="var(--sunrise)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        {hover != null && (
          <>
            <line x1={pts[hover][0]} x2={pts[hover][0]} y1={PAD_Y} y2={H - PAD_Y} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
            <circle cx={pts[hover][0]} cy={pts[hover][1]} r="4" fill="var(--bone)" stroke="var(--sunrise)" strokeWidth="2" />
          </>
        )}
      </svg>

      {/* x-axis labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.04em" }}>
        {labelIdx.map((i) => <span key={i}>{fmtDate(data[i].date)}</span>)}
      </div>

      {/* tooltip */}
      {hover != null && (
        <div style={{
          position: "absolute",
          left: `calc(${(pts[hover][0] / W) * 100}% - 70px)`,
          top: -8,
          padding: "8px 12px",
          background: "var(--ink-1)",
          color: "var(--bone)",
          borderRadius: 12,
          fontFamily: "var(--font-ui)", fontSize: 12,
          pointerEvents: "none",
          whiteSpace: "nowrap",
          boxShadow: "0 8px 20px -8px rgba(26,20,16,0.4)"
        }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, opacity: 0.6, letterSpacing: "0.10em", textTransform: "uppercase" }}>{fmtDate(data[hover].date)}</div>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, marginTop: 2 }}>{data[hover].visits} visitors</div>
        </div>
      )}
    </div>
  );
}

function BarRow({ label, sub, value, share, max }) {
  const w = Math.max(2, (share / max) * 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--ink-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</div>
          {sub && <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.04em", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</div>}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)", whiteSpace: "nowrap" }}>{value.toLocaleString()} <span style={{ color: "var(--ink-3)" }}>· {share}%</span></div>
      </div>
      <div style={{ height: 6, background: "var(--paper-2)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: w + "%", height: "100%", background: "linear-gradient(90deg, var(--ink-2), var(--ink-1))", borderRadius: 999, transition: "width 600ms cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
    </div>
  );
}

function SourceDonut({ data }) {
  const size = 140;
  const r = size / 2 - 14;
  const inner = r - 18;
  const cx = size / 2, cy = size / 2;
  const total = data.reduce((a, b) => a + b.value, 0);
  let a0 = -Math.PI / 2;
  const arcs = data.map((d) => {
    const a1 = a0 + (d.value / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + Math.cos(a0) * r,     y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r,     y1 = cy + Math.sin(a1) * r;
    const x2 = cx + Math.cos(a1) * inner, y2 = cy + Math.sin(a1) * inner;
    const x3 = cx + Math.cos(a0) * inner, y3 = cy + Math.sin(a0) * inner;
    const d_ = `M${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${inner},${inner} 0 ${large} 0 ${x3},${y3} Z`;
    a0 = a1;
    return { d: d_, color: d.color, name: d.name, value: d.value };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flex: "0 0 auto" }}>
      {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} />)}
      <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.10em", textTransform: "uppercase", fill: "var(--ink-3)" }}>Sources</text>
      <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, fill: "var(--ink-1)" }}>{total}%</text>
    </svg>
  );
}

Object.assign(window, { AnalyticsAdmin, Panel, KPICard, VisitorsLineChart, BarRow, SourceDonut });
