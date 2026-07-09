# Manual Test Plan — Generation Pipeline

Run `npm run dev` with at least one `GEMINI_API_KEY_*` set in `.env.local`.
Every tool has a **✦ Try with sample data** button — use it for fast passes.

## Cross-cutting checks (run once on any tool)

- [ ] API rejects raw prompts: `POST /api/generate` with `{"prompt":"hi"}` → 400 `{ error, errorType: "validation" }`
- [ ] API rejects unknown toolId: `{"toolId":"nope","inputs":{}}` → 400
- [ ] API rejects missing required field: `{"toolId":"blog-title","inputs":{}}` → 400 naming the field
- [ ] `GET /api/generate` returns `rateLimit.remaining` without consuming a credit
- [ ] Header shows "N free generations left this hour" and decrements after each generation
- [ ] 11th generation within an hour → friendly 429 message with Retry-After
- [ ] Draft autosave: type into a form, refresh the page → input is still there; "Clear draft" empties it
- [ ] Output history: generate twice → "Recent Outputs" lists both; Restore swaps the output back in
- [ ] Copy buttons fire a toast; downloads fire a toast
- [ ] Kill your network mid-generate → red error box, no blank screen
- [ ] Invalid JSON path: temporarily corrupt a promptTemplate (ask for prose), generate → amber "unstructured response" fallback renders the raw text, UI never crashes

## Per-tool cases

### 1. Resume Builder (`/tools/resume-builder`)
- [ ] Multi-step form: 3 steps with progress bar; "Continue" blocks on empty required fields; error jumps to the right step
- [ ] Invalid email shows inline message on blur
- [ ] Output renders in Modern (teal sidebar), Classic (serif), Creative (violet header) — switch between all 3
- [ ] Print / PDF → one clean A4 page, selectable text, no nav/buttons/dark background
- [ ] DOCX downloads and opens in Word with headings, bullets, contact line
- [ ] TXT download reflows cleanly
- [ ] ATS panel: score varies with content (try deleting numbers from experience input → quantified-bullets score drops); tips are specific
- [ ] "↻ Improve" on Summary/Experience/Skills swaps only that section and decrements credits
- [ ] Mobile (≤ 640px): paper scales down via transform, no horizontal scroll

### 2. Cover Letter (`/tools/cover-letter`)
- [ ] 3-step form works; business-letter layout with today's date, recipient block, salutation, 3-4 paragraphs, closing
- [ ] Copy produces clean plain-text letter; Print/PDF and DOCX both work
- [ ] "↻ Improve" regenerates only the body paragraphs

### 3. Email Writer (`/tools/email-writer`)
- [ ] Subject renders in the header bar with its own copy button
- [ ] "Copy email" gives `Subject: …` + body as plain text

### 4. Invoice Generator (`/tools/invoice-generator`)
- [ ] Line items in a table with right-aligned amounts; subtotal/tax/total are **recomputed** from items (change the stated total wildly — displayed totals still sum correctly from line items)
- [ ] Invoice number auto-generated when left blank; Print/PDF is clean

### 5. Bio Generator (`/tools/bio-generator`)
- [ ] Exactly Short / Medium / Long variant cards with char counters vs 150/300/500 targets; per-variant copy

### 6. Product Description (`/tools/product-description`)
- [ ] Headline + description + benefit bullets in white card; SEO keywords as copyable chips

### 7. Blog Titles (`/tools/blog-title`)
- [ ] ~10 title cards with style labels, char counts (amber > 65), rationale; per-title copy + copy all

### 8. Instagram Caption (`/tools/instagram-caption`)
- [ ] Hook card warns in red/amber when > 125 chars
- [ ] 3 labeled caption variants with 2,200 counter; hashtags as chips with "Copy all"

### 9. Cold Email (`/tools/cold-email`)
- [ ] 3 subject variants with char counts (amber > 45); body card; follow-up card with delay days

### 10. YouTube Script (`/tools/youtube-script`)
- [ ] Title options list; hook card at 0:00; collapsible timestamped sections with copy-per-section; CTA, description, tags
- [ ] "Copy all" produces the full formatted script
- [ ] "↻ Improve" on the hook

## Provider fallbacks

- [ ] With only an invalid Gemini key set → clear "service configuration" style error (no crash)
- [ ] With invalid Gemini keys + valid `GROQ_API_KEY` → generation still succeeds via Groq
- [ ] With Upstash env vars set → limits survive a dev-server restart
