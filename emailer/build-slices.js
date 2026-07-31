/**
 * Cuts the rendered 2x creative into the flat, linked slices the email ships.
 *
 * WHY THE EMAIL IS FLAT AGAIN. A version of this template set every word as
 * live HTML text over the artwork. It was sharper and it survived blocked
 * images, but the Gmail Android app forcibly inverts colour in dark mode, and
 * it inverts text without inverting the background image underneath it. The
 * black copy over the skyline turned white on a white photograph and vanished,
 * the plain-white cells between the artwork bands turned near-black and cut the
 * creative into stripes, and the red shifted to salmon. None of that is
 * preventable: the Gmail app ignores `color-scheme`, `prefers-color-scheme` and
 * `!important` alike. The one thing it never touches is an image, so for a
 * design whose copy sits on top of photography, pixels are the only way to hold
 * the composition in both colour schemes.
 *
 * The softness that pushed us off images in the first place is answered by
 * resolution rather than by markup: these are cut at 2x from a 1200px render
 * and displayed at 600, where the previous artwork was 825px native at 600.
 *
 * PIPELINE. Two steps, because the type has to be set by a real layout engine:
 *
 *   1. `node build-bands.js` — composites the twelve Figma layers into
 *      text-free 2x bands under `src/`.
 *   2. Point a browser at the template rendered against those PNG bands, set
 *      `document.body.style.zoom = 2`, drop the legal footer row, and capture a
 *      full-page screenshot at 1200px wide. Save it as `artwork-2x.png` here.
 *   3. `node build-slices.js` — this file.
 *
 * Regenerating is a per-campaign event, so the manual capture in step 2 is
 * cheaper than teaching this script to drive a browser.
 */
const sharp = require("sharp");
const path = require("path");

const SRC = path.join(__dirname, "artwork-2x.png");
const S = 2;
const px = (n) => Math.round(n * S);

/**
 * The slices, as [name, top, bottom, link] in display units.
 *
 * The boundaries are rows the render proved pure white across all 600px, so a
 * hairline gap in any client falls on white and cannot be seen. They are chosen
 * to group content by where it should lead, because each slice is wrapped in a
 * single anchor: a click anywhere in it goes to that one destination.
 *
 * No slice exceeds 1728 display px. Outlook on Windows renders through Word,
 * which truncates any image taller than that.
 */
const SLICES = [
  ["creative-1-story", 0, 1484, "knowMore"],
  ["creative-2-pricing", 1484, 1975, "pricing"],
  ["creative-3-knowmore", 1975, 2011, "knowMore"],
  ["creative-4-contact", 2011, 2127, "contact"],
];

(async () => {
  const meta = await sharp(SRC).metadata();
  if (meta.width !== 1200) {
    throw new Error(`expected a 1200px-wide render, got ${meta.width}px`);
  }

  for (const [name, top, bottom] of SLICES) {
    const h = bottom - top;
    const cut = sharp(SRC)
      .extract({ left: 0, top: px(top), width: px(600), height: px(h) })
      .flatten({ background: "#ffffff" });

    // Photography compresses well and would be enormous lossless; the two short
    // slices at the foot are type on flat white, where JPEG would ring around
    // the letterforms and PNG is both crisper and smaller.
    //
    // 4:2:0 on the photographic slices halves the chroma resolution, which
    // normally frays saturated type — and these carry red display type. It is
    // safe here only because the slice is cut at 2x and shown at 600: the
    // browser averages the artifacts away in the downscale. Compared against a
    // lossless cut at display size the three encodings are indistinguishable,
    // and it takes the top slice from 618KB to 288KB.
    const photographic = h > 200;
    const file = path.join(__dirname, `${name}.${photographic ? "jpg" : "png"}`);
    await (photographic
      ? cut.jpeg({ quality: 80, chromaSubsampling: "4:2:0", mozjpeg: true })
      : cut.png({ compressionLevel: 9 })
    ).toFile(file);

    const { size } = require("fs").statSync(file);
    console.log(
      `${path.basename(file).padEnd(26)} ${px(600)}x${px(h)}  displays 600x${h}  ${(
        size / 1024
      ).toFixed(0)}KB`
    );
  }
})();
