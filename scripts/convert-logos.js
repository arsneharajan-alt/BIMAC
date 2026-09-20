const sharp = require("sharp");
const path = require("path");

const SRC = "C:/Users/Sneha/Desktop/BIMAC/software logos/Tools picture";
const OUT = "C:/Users/Sneha/Desktop/BIMAC/public/logos";

// Mapping read off the contact sheet, file by file.
const map = {
  "ChatGPT Image Sep 12, 2026, 05_14_36 PM.png": "tekla",
  "ChatGPT Image Sep 12, 2026, 05_19_04 PM.png": "sketchup",
  "ChatGPT Image Sep 12, 2026, 06_09_23 PM.png": "revit",
  "ChatGPT Image Sep 13, 2026, 01_26_19 PM.png": "archicad",
  "ChatGPT Image Sep 13, 2026, 01_40_30 PM.png": "primavera-p6",
  "ChatGPT Image Sep 13, 2026, 01_40_33 PM.png": "power-bi",
  "ChatGPT Image Sep 13, 2026, 01_42_14 PM.png": "excel",
  "ChatGPT Image Sep 13, 2026, 01_42_58 PM.png": "word",
  "ChatGPT Image Sep 13, 2026, 02_00_08 PM.png": "etabs",
  "ChatGPT Image Sep 13, 2026, 02_09_37 PM.png": "navisworks",
  "ChatGPT Image Sep 13, 2026, 02_13_27 PM.png": "autocad",
  "ChatGPT Image Sep 13, 2026, 02_14_53 PM.png": "3ds-max",
  "ChatGPT Image Sep 13, 2026, 02_16_19 PM.png": "civil-3d",
  "ChatGPT Image Sep 13, 2026, 02_17_20 PM.png": "infraworks",
  "ChatGPT Image Sep 13, 2026, 02_19_01 PM.png": "staad-pro",
  "ChatGPT Image Sep 13, 2026, 02_20_30 PM.png": "solibri",
  "ChatGPT Image Sep 13, 2026, 02_21_54 PM.png": "synchro-4d",
  "ChatGPT Image Sep 13, 2026, 02_24_42 PM.png": "planswift",
  "render.png": "render",
  "sap2000.jpg": "sap2000",
};

/**
 * Knock the background out from the edges inwards, so white *inside* a logo —
 * the R in Revit, the X in Excel — is left alone. A flat global threshold would
 * punch holes straight through those letterforms.
 */
function floodTransparent(data, w, h, tol = 18) {
  const idx = (x, y) => (y * w + x) * 4;
  const seen = new Uint8Array(w * h);
  const stack = [];
  const isBg = (i) =>
    data[i + 3] !== 0 && data[i] >= 255 - tol && data[i + 1] >= 255 - tol && data[i + 2] >= 255 - tol;

  for (let x = 0; x < w; x++) {
    stack.push([x, 0], [x, h - 1]);
  }
  for (let y = 0; y < h; y++) {
    stack.push([0, y], [w - 1, y]);
  }

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const p = y * w + x;
    if (seen[p]) continue;
    seen[p] = 1;
    const i = idx(x, y);
    if (data[i + 3] === 0) {
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      continue;
    }
    if (!isBg(i)) continue;
    data[i + 3] = 0;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
}

(async () => {
  const report = [];
  for (const [file, slug] of Object.entries(map)) {
    const src = path.join(SRC, file);
    const { data, info } = await sharp(src)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    floodTransparent(data, info.width, info.height);

    const cleaned = sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    }).trim({ threshold: 1 });

    const trimmed = await cleaned.png().toBuffer({ resolveWithObject: true });
    const { width, height } = trimmed.info;
    const ratio = width / height;

    // 128px on the long edge covers the 56px tile at 2x.
    const out = path.join(OUT, `${slug}.png`);
    await sharp(trimmed.data)
      .resize(ratio >= 1 ? { width: 128 } : { height: 128 })
      .png({ compressionLevel: 9, palette: true })
      .toFile(out);

    report.push({ slug, source: width + "x" + height, ratio: ratio.toFixed(2) });
  }
  console.table(report);
})();
