# Ron Klimovsky Studio — your website

This folder contains your complete, ready-to-launch website. It faithfully
recreates the design from your handoff, but rebuilt the right way: fast, great
for Google and AI search, and — most importantly — **editable by you, with no
code**, through a visual admin panel.

You do not need to understand anything below to *use* the site once it's live.
This guide is only for the one-time launch. After that, you just open
`yoursite.com/admin`, click, type, and publish.

---

## What you've got

- **Five pages**: Home, Artworks, a page for each artwork, Exhibitions, About.
- **A visual editor** at `/admin` — add artworks, upload photos, add shows, edit
  your bio. No code, ever.
- **Contact + mailing-list forms** that email you directly.
- **Exhibition status is automatic** — "Upcoming / On view / Past" is worked out
  from the dates you enter. You never have to update it by hand.
- **Built for search** — Google, plus AI crawlers (ChatGPT, Claude, Perplexity).

---

## The launch (about 30 minutes, one time)

> Prefer not to do this yourself? I can walk you through it live on your screen,
> or do most of it for you. Just say the word in our chat. Otherwise, follow
> along — every step is a click.

### Step 1 — Put the website online (GitHub)

GitHub is where the website's files live. The visual editor saves your changes
here, which is what makes "edit, publish" work.

1. Create a free account at **github.com**.
2. Click the **+** (top right) → **New repository**.
3. Name it `rk-studio-site`. Leave it **Public** (or Private — both work). Click
   **Create repository**.
4. On the new page, click **"uploading an existing file"**.
5. Open this `RK studio website` folder on your computer, select **everything
   inside it**, and drag it into the browser. Wait for the upload, then click
   **Commit changes**.

### Step 2 — Publish it (Netlify, free)

Netlify takes the files and turns them into a live website, and re-publishes
automatically every time you make an edit.

1. Go to **netlify.com** → **Sign up** → choose **"Sign up with GitHub"**.
2. Click **Add new site → Import an existing project → GitHub**.
3. Pick your `rk-studio-site` repository.
4. Netlify auto-fills the settings (build command `npm run build`, publish
   folder `dist`). Click **Deploy**.
5. After a minute you'll get a live address like
   `something-random.netlify.app`. Your site is live.

### Step 3 — Connect your domain

1. In Netlify: **Domain management → Add a domain** → type your domain → follow
   the on-screen instructions (Netlify tells you exactly what to paste at your
   domain registrar, where you bought the domain).
2. **Then tell me your real domain** (or edit one line yourself — see
   "Three things to personalize" below). This makes links and search listings
   point to the right place.

### Step 4 — Turn on the visual editor (`/admin`)

This is what lets you log in and edit. It's a one-time connection between the
editor and GitHub.

1. **Tell the editor which repo to use.** Open the file
   `public/admin/config.yml` (in GitHub, click the file → pencil icon) and
   change the line `repo: OWNER/REPO` to your details, e.g.
   `repo: yourusername/rk-studio-site`. Commit.
2. **Create a GitHub "OAuth app"** (this is the login key):
   - GitHub → your photo (top right) → **Settings → Developer settings →
     OAuth Apps → New OAuth App**.
   - Application name: `RK Studio editor`
   - Homepage URL: your site address.
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
   - Click **Register**, then **Generate a new client secret**. Keep the
     **Client ID** and **Client secret** handy.
3. **Give them to Netlify:** in Netlify → your site is fine, but this lives under
   your Netlify **user** settings → **Applications → OAuth → Install provider →
   GitHub**, and paste the Client ID + Secret.
4. Visit `yoursite.com/admin`, click **Login with GitHub**, approve. You're in.

### Step 5 — Turn on the contact forms

So inquiries and sign-ups land in your inbox.

1. Go to **web3forms.com**, enter your email, and they email you an **access
   key** (takes seconds — no account needed).
2. Open `src/siteConfig.ts` and paste the key between the quotes on the
   `web3formsKey:` line. Commit.
   - (Or just send me the key and I'll set it.)
3. Done — forms now email you. Until the key is set, the forms still work by
   opening the visitor's email app addressed to you.

---

## Three things to personalize

All three are tiny, clearly-marked edits. Tell me your details and I'll make
them for you in seconds, or do them yourself:

1. **Your domain** — in `astro.config.mjs` (`site:` line) and
   `src/siteConfig.ts` (`domain:` line).
2. **The CMS repo** — in `public/admin/config.yml` (`repo:` line). *(Step 4.1)*
3. **The forms key** — in `src/siteConfig.ts` (`web3formsKey:` line). *(Step 5)*

`src/siteConfig.ts` also holds your **email** and **phone** — edit those there
any time.

---

## Day-to-day: editing your site (the part that matters)

Go to **`yoursite.com/admin`** and log in. You'll see three sections:

### Add a new artwork
1. **Artworks → New Artwork.**
2. Upload the **photo**, fill in title, medium, size, year, price, status.
3. **Featured?** turns on the big home-page piece. **Sort order** controls
   position (lower numbers come first).
4. Click **Publish**. The site rebuilds and shows it within ~1 minute.

> No photo yet? Leave it blank — a soft placeholder in your palette shows until
> you upload the real photo. Sizes use × (e.g. `48 × 36 in.`).

### Add or update an exhibition
1. **Exhibitions → New Exhibition.**
2. Enter venue, city, **start date** and **end date**. That's all — the site
   automatically labels it Upcoming / On view / Past and sorts it for you.
3. **Feature** it to show it large at the top. Publish.

### Edit your home headline or About bio
**Site text → Home page** or **About page.** Edit, Publish.

That's the whole job. Add a painting, mark one sold, announce a show — all
clicks, all from `/admin`, live in a minute.

---

## If something looks off
- A change didn't appear? Give it ~2 minutes (the site re-publishes after each
  edit), then refresh.
- Stuck on any launch step? Tell me where you are and I'll guide you on your
  screen.

Made for the studio. Quiet on the surface, solid underneath.
