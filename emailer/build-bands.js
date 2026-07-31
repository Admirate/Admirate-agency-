/**
 * Rebuilds the emailer artwork from its Figma layers as text-free background
 * bands, so the copy can be live HTML text on top instead of pixels.
 *
 * The Figma frame is a poster: twelve absolutely-positioned layers, several
 * bleeding past the 600px edge, blended by white-to-transparent gradient
 * rectangles. None of that survives an email client — Outlook renders through
 * Word, which has no z-index, no CSS gradient and no negative offsets. So the
 * compositing is done here, once, and the email only ever stacks flat rows.
 *
 * Everything is composed at 2x and the output is 1200px wide for a 600px
 * display width, which is what keeps it sharp on a 3x phone.
 *
 * Layer order, offsets and gradient stops are transcribed from the Figma node
 * tree (file DuPUPJqcyiIUdgrZxg6qF5, frame 1:2) in document order — later
 * entries paint over earlier ones.
 */
const sharp = require("sharp");
const path = require("path");

const S = 2;                    // export scale
const W = 600, H = 2123;        // frame size in Figma units
const PAD = 900;                // 2x slack for layers that start off-canvas
const src = (f) => path.join(__dirname, "src", f);
const out = (f) => path.join(__dirname, f);

const px = (n) => Math.round(n * S);

/**
 * A white-to-transparent vertical fade, matching Tailwind's
 * `bg-gradient-to-b from-white from-[P%] to-[rgba(255,255,255,0)]`: opaque
 * white down to P, then easing to nothing at the bottom edge. `flip` mirrors it
 * for the layers Figma applied a -100% Y scale to.
 */
const fade = (w, h, p, flip = false) => {
  const stops = flip
    ? `<stop offset="0" stop-color="#fff" stop-opacity="0"/>
       <stop offset="${1 - p}" stop-color="#fff" stop-opacity="1"/>
       <stop offset="1" stop-color="#fff" stop-opacity="1"/>`
    : `<stop offset="0" stop-color="#fff" stop-opacity="1"/>
       <stop offset="${p}" stop-color="#fff" stop-opacity="1"/>
       <stop offset="1" stop-color="#fff" stop-opacity="0"/>`;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${px(w)}" height="${px(h)}">
       <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient></defs>
       <rect width="100%" height="100%" fill="url(#g)"/>
     </svg>`
  );
};

/**
 * The white bloom Figma paints over the skyline photo. Transcribed verbatim
 * from the node's fill so the falloff matches; only the pixel size is scaled,
 * the viewBox keeps the original gradient geometry.
 */
const bloom = (w, h) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${px(w)}" height="${px(h)}" viewBox="0 0 1118 627" preserveAspectRatio="none">
       <defs><radialGradient id="b" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10"
         gradientTransform="matrix(-54.6 0.049998 -0.089154 -97.357 559 313.5)">
         <stop stop-color="rgba(255,255,255,0)" offset="0.00055312"/>
         <stop stop-color="rgba(255,255,255,1)" offset="0.49519"/>
       </radialGradient></defs>
       <rect width="100%" height="100%" fill="url(#b)" opacity="0.9"/>
     </svg>`
  );

/** Scales a source file to a box the way CSS `object-fit: cover` would. */
const cover = (file, w, h, rotate = 0) => {
  let p = sharp(src(file)).resize(px(w), px(h), { fit: "cover" });
  if (rotate) p = p.rotate(rotate);
  return p.png().toBuffer();
};

(async () => {
  // Figma's own stacking order. `top`/`left` are frame-relative Figma units.
  const layers = [
    { input: await cover("swirl-top.png", 602, 602), left: -1, top: 47 },
    { input: fade(600, 261, 0.32184), left: 0, top: 0 },
    { input: fade(600, 261, 0.32184, true), left: 0, top: 458 },
    { input: await cover("burj.png", 1118, 627), left: -429, top: 650 },
    { input: bloom(1118, 627), left: -429, top: 650 },
    { input: fade(600, 302, 0.44712), left: 0, top: 538 },
    { input: fade(600, 302, 0.44712, true), left: 0, top: 1112 },
    { input: await cover("grid.png", 628, 386), left: -18, top: 1620 },
    { input: fade(600, 302, 0.49669), left: 0, top: 1491 },
    { input: fade(600, 302, 0.49669, true), left: 0, top: 1821 },
    { input: await cover("ribbon.png", 600, 302, 180), left: -249, top: 1446 },
    { input: await cover("logo.png", 207, 207), left: 197, top: -13 },
    { input: await cover("swirl-mid.png", 852, 667), left: -121, top: 155 },
  ];

  // Composited on an oversized white canvas because sharp rejects negative
  // offsets; the frame is cut back out of the middle afterwards.
  const full = await sharp({
    create: {
      width: px(W) + PAD * 2,
      height: px(H) + PAD * 2,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite(
      layers.map((l) => ({
        input: l.input,
        left: px(l.left) + PAD,
        top: px(l.top) + PAD,
      }))
    )
    .png()
    .toBuffer();

  const frame = await sharp(full)
    .extract({ left: PAD, top: PAD, width: px(W), height: px(H) })
    .png()
    .toBuffer();

  await sharp(frame).toFile(out("background-full.png"));

  /**
   * The three bands that carry artwork, as [name, top, bottom] in Figma units.
   *
   * Every boundary sits inside a run of rows that is pure white across the full
   * 600px — verified by scanning the composite — so if a client leaves a
   * hairline between two rows it falls on white and cannot be seen. The gaps
   * between these bands (550-650 and 1965-2123) are plain white in the design
   * and are emitted as ordinary table cells with no image at all.
   */
  const BANDS = [
    ["band-1-header", 0, 550],
    ["band-3-skyline", 650, 1290],
    ["band-4-ribbon", 1290, 1965],
  ];

  for (const [name, top, bottom] of BANDS) {
    const h = bottom - top;
    // PNG, not JPEG: these are re-rendered and re-cut by build-slices.js, and
    // compressing here would put the artwork through JPEG twice.
    await sharp(frame)
      .extract({ left: 0, top: px(top), width: px(W), height: px(h) })
      .flatten({ background: "#ffffff" })
      .png()
      .toFile(out(`src/${name}.png`));
    console.log(`wrote src/${name}.png  ${px(W)}x${px(h)}  (displays ${W}x${h})`);
  }
})();
