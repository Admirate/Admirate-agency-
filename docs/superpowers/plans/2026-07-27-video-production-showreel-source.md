# Video Production Showreel Source Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render `admirate summary 3 (1).mp4` from the public Supabase `videos` bucket in the existing “The reel, uncut.” player.

**Architecture:** Keep the existing showreel markup, playback engine, and `video()` URL helper. Change only the object name consumed by that helper and protect the rendered route contract with an HTTP integration assertion.

**Tech Stack:** Next.js 16, TypeScript, Supabase Storage public URLs, native HTML video, Node test runner

## Global Constraints

- Use `https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/videos/admirate%20summary%203%20(1).mp4`.
- Keep the existing aperture overlay, REC treatment, scanlines, vignette, progress, timecode, seeking, pause, and sound behavior.
- Keep muted desktop ambience and mobile/reduced-motion autoplay safeguards.
- Do not download the 26.6 MB asset into the repository.
- Do not change Supabase buckets, policies, credentials, or dependencies.
- Work directly on the current `main` branch as requested.

---

### Task 1: Replace the showreel object rendered by the existing player

**Files:**
- Modify: `tests/sitemap-http.test.mjs:140`
- Modify: `src/components/service/video-production/content.ts:24`

**Interfaces:**
- Consumes: `video(path: string): string` from `src/lib/cdn.ts`
- Produces: A `/services/video-production` response whose `#rvid` source is the supplied public MP4

- [ ] **Step 1: Add the failing rendered-route test**

Add this test to `tests/sitemap-http.test.mjs`:

```js
test("video production renders the supplied showreel in the existing player", async () => {
  const response = await fetch(`${baseUrl}/services/video-production`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(
    html,
    /<video id="rvid"[^>]*playsinline[^>]*muted[^>]*loop[^>]*preload="metadata"[^>]*disablepictureinpicture[^>]*>/,
  );
  assert.match(
    html,
    /<source src="https:\/\/mshehtxywddtdxxkbnuu\.supabase\.co\/storage\/v1\/object\/public\/videos\/admirate%20summary%203%20\(1\)\.mp4" type="video\/mp4">/,
  );
});
```

- [ ] **Step 2: Run the focused integration test and confirm the expected failure**

Run:

```powershell
node --test --test-force-exit --test-name-pattern="video production renders the supplied showreel" tests/sitemap-http.test.mjs
```

Expected: FAIL because the rendered source still ends in `showreel.mp4`.

- [ ] **Step 3: Change the showreel object name**

In `src/components/service/video-production/content.ts`, replace:

```ts
const SHOWREEL = "showreel.mp4";
```

with:

```ts
const SHOWREEL = "admirate summary 3 (1).mp4";
```

- [ ] **Step 4: Run the focused integration test and confirm it passes**

Run:

```powershell
node --test --test-force-exit --test-name-pattern="video production renders the supplied showreel" tests/sitemap-http.test.mjs
```

Expected: PASS with the new showreel test passing and unrelated named tests skipped.

- [ ] **Step 5: Run repository verification**

Run:

```powershell
node --test --test-force-exit
npx tsc --noEmit --incremental false
npm run build
git diff --check
```

Expected: all commands exit with code `0`.

- [ ] **Step 6: Verify the real player in a browser**

Open `/services/video-production`, scroll to `#reel`, and inspect `#rvid` after metadata loads. Confirm:

- `currentSrc` is the supplied encoded Supabase URL.
- `readyState` is at least `1` and `duration` is finite.
- The video reports non-zero dimensions and no media error.
- Activating `#rov` begins unmuted playback and updates the player state.

- [ ] **Step 7: Commit**

```powershell
git add tests/sitemap-http.test.mjs src/components/service/video-production/content.ts
git commit -m "feat: add video production showreel"
```
