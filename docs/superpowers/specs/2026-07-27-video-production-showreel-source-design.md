# Video Production Showreel Source Design

**Status:** Approved  
**Date:** 2026-07-27

## Goal

Display the supplied video in the existing “The reel, uncut.” player on `/services/video-production`.

## Video Source

Use the public Supabase Storage object:

`https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/videos/admirate%20summary%203%20(1).mp4`

The object has been verified to return `200 OK`, `Content-Type: video/mp4`, byte-range support, and a content length of `27,881,380` bytes.

## Approach

Change the existing `SHOWREEL` object name from `showreel.mp4` to `admirate summary 3 (1).mp4`. Continue generating the public URL through the existing `video()` CDN helper so spaces and parentheses are encoded consistently with every other Supabase asset.

## Preserved Behavior

- Keep the existing 21:9 desktop and 16:9 mobile frame.
- Keep the aperture play overlay, REC treatment, scanlines, and vignette.
- Keep muted ambient desktop playback when the reel enters the viewport.
- Keep user-initiated playback with sound, pause, seek, progress, and timecode behavior.
- Keep mobile and reduced-motion safeguards that prevent unsolicited playback.

## Non-Goals

- Do not download or duplicate the 26.6 MB video in the repository.
- Do not alter Supabase buckets, policies, or credentials.
- Do not redesign the player or change other video-production page content.

## Verification

- Add a regression test that checks the encoded public source and existing playback attributes.
- Run the focused test, full suite, TypeScript checker, and production build.
- Load the page in a browser, verify metadata is available, and confirm the play control starts the supplied video.
