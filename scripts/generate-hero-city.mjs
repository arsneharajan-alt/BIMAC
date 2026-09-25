/**
 * Draws the hero backdrop: an axonometric city with a BIM cage over the middle.
 *
 * The brief was a reference image — a tilt-shifted aerial of a city block with
 * one building wrapped in a white wireframe, the whole thing washed deep blue.
 * That picture is a render, and the half of it that carries the meaning is
 * geometry: boxes on a grid, and a cage of straight lines over them. Geometry
 * is cheaper to draw than to find, and drawing it means the result is ours,
 * exactly the right size, in exactly the site's palette, and regenerable when
 * any of that changes.
 *
 * The scene is built as one SVG and rasterised once. Three things give it the
 * depth the reference has:
 *
 *   - atmospheric perspective: blocks far from the camera are mixed toward the
 *     background blue, so distance reads as haze rather than as small;
 *   - the cage overshoots the massing it wraps, the way a setting-out drawing
 *     runs its grid lines past the building;
 *   - tilt-shift, applied after rasterising — a blurred copy composited back
 *     through a vertical alpha ramp, sharp through the middle band and soft at
 *     the top and bottom edges. That is what makes an aerial read as a model
 *     on a table instead of as a photograph of a real city.
 *
 * Run: node scripts/generate-hero-city.mjs
 */

import sharp from "sharp";

const OUT = "public/images/hero/bim-city.jpg";

const W = 2400;
const H = 1350;

/* The site's own palette — see tailwind.config.ts. */
const INK_950 = [6, 20, 34];
const AZURE_900 = [23, 66, 117];
const AZURE_700 = [21, 93, 173];
const AZURE_400 = [95, 178, 250];
const WHITE = [255, 255, 255];

/**
 * A seeded generator.
 *
 * The city has to come out the same every run: the image is committed, and a
 * regenerate that quietly reshuffled every block would show up as a diff of
 * the whole file with no way to tell whether anything meant to change.
 */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}
const rand = rng(20260922);

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/**
 * World to screen.
 *
 * A standard 2:1 axonometric, lifted: the camera sits high enough that the
 * ground plane reads as a plan and the massing still has visible sides.
 */
const SCALE = 38;
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

/**
 * Where the subject lands.
 *
 * The projection puts world (0,0,0) at the origin, which is not where we want
 * to be looking: the cage is what the picture is about, so the frame is hung
 * off it rather than off the grid. Horizontally it is free — on this
 * projection any point with x === y is already centred — so only the vertical
 * offset has to be solved, and it is solved for the middle of the hero plot.
 */
/**
 * Off centre, on purpose.
 *
 * The hero copy is a centred column, so a subject in the middle of the frame
 * sits directly behind the headline and the two fight. Pushing the cage down
 * and to the right puts it in the quarter the copy leaves empty, where it can
 * be looked at instead of read through.
 */
const CX = W * 0.62;

/**
 * Where the middle of the hero plot sits, as a fraction of frame height.
 *
 * Not a taste setting — it is solved. The cage has to fall inside the band the
 * tilt-shift leaves sharp, and on this projection a plot occupies roughly
 * 7 * SCALE of screen height below that point and (0.5 + cage height) * SCALE
 * above it. Picking a number and nudging it is what produced a tower running
 * off the top of the frame; picking the band first and deriving this from it
 * is what fixed it.
 */
const HERO_AT = 0.66;

/* Filled in once INNER is known — see below. */
let CY = 0;

function iso(x, y, z) {
  return [
    CX + (x - y) * COS * SCALE,
    CY + ((x + y) * SIN - z) * SCALE,
  ];
}

const pts = (list) =>
  list.map(([x, y, z]) => iso(x, y, z).map((n) => n.toFixed(1)).join(",")).join(" ");

/* ------------------------------------------------------------------ blocks */

/**
 * One massing, as its three visible faces.
 *
 * The camera looks down the +x/+y diagonal, so the faces that face it are the
 * far ones in each axis plus the roof. Depth `t` runs 0 (near) to 1 (far) and
 * is what the haze is keyed off.
 */
function box(x, y, w, d, h, t, opts = {}) {
  /**
   * How far this massing is lifted out of the city it stands in.
   *
   * The cage was wrapping something the same weight as its neighbours, which
   * left it reading as a diagram floating over a texture rather than as a
   * building being modelled. Lifting only the hero cluster is what makes it
   * the subject.
   */
  const lift = opts.lift ?? 0;

  /**
   * Nothing here is filled.
   *
   * The massing used to be solid, and solid massing is a picture of a city.
   * Drawn as edges it is a model of one — which is the thing BIMAC actually
   * sells, and which lets the whole scene sit on flat ink with no background
   * of its own. Distance is carried by how faint a line is rather than by how
   * far its fill has been mixed toward the ground.
   */
  const near = 1 - t;
  const edgeTone = mix(AZURE_400, [255, 255, 255], lift);
  const edge = (near ** 1.3) * (0.27 + lift * 0.58) + 0.045;
  const sw = 1 + lift * 0.5;

  const roof = pts([[x, y, h], [x + w, y, h], [x + w, y + d, h], [x, y + d, h]]);
  const right = pts([[x + w, y, 0], [x + w, y + d, 0], [x + w, y + d, h], [x + w, y, h]]);
  const left = pts([[x, y + d, 0], [x + w, y + d, 0], [x + w, y + d, h], [x, y + d, h]]);

  const face = (points, alpha) =>
    `<polygon points="${points}" fill="none" stroke="${rgb(edgeTone, alpha)}" stroke-width="${sw}" stroke-linejoin="round"/>`;

  /* The roof carries the shape, so it is drawn hardest. */
  let s = face(left, edge * 0.8) + face(right, edge * 0.8) + face(roof, edge);

  /* Floor lines. The only thing that says "building" rather than "block", so
     they fade out with distance instead of stopping at some cutoff. */
  const litness = edge * (opts.lit ?? 0.34) * 2.2;
  if (litness > 0.02 && h > 3) {
    const step = h / Math.max(2, Math.round(h / 2.2));
    for (let z = step; z < h - 0.3; z += step) {
      const a = pts([[x + w, y, z], [x + w, y + d, z]]);
      const b = pts([[x, y + d, z], [x + w, y + d, z]]);
      s += `<polyline points="${a}" stroke="${rgb(edgeTone, litness * 0.5)}" stroke-width="0.9" fill="none"/>`;
      s += `<polyline points="${b}" stroke="${rgb(edgeTone, litness * 0.34)}" stroke-width="0.9" fill="none"/>`;
    }
  }
  return s;
}

/* -------------------------------------------------------------------- cage */

/**
 * The wireframe over the centre — the whole point of the picture.
 *
 * Every line overshoots the volume by OVER, so the cage reads as setting-out
 * rather than as an outline traced round a shape. Nothing here is filled: the
 * massing underneath has to stay visible through it.
 */
function cage(x, y, w, d, h, opts = {}) {
  const OVER = opts.over ?? 3.2;
  const stroke = opts.stroke ?? 2.1;
  const a = opts.opacity ?? 0.92;
  let s = "";

  const line = (p, q, alpha = a, sw = stroke) =>
    `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${rgb(WHITE, alpha)}" stroke-width="${sw}" stroke-linecap="round"/>`;

  const x0 = x - OVER;
  const x1 = x + w + OVER;
  const y0 = y - OVER;
  const y1 = y + d + OVER;

  /* Verticals at the four corners, run past the roof. */
  for (const [cx, cy] of [[x, y], [x + w, y], [x + w, y + d], [x, y + d]]) {
    s += line(iso(cx, cy, -OVER * 0.35), iso(cx, cy, h + OVER));
  }

  /* Horizontal frames, each overshooting in both directions. */
  const levels = opts.levels ?? [0, h * 0.26, h * 0.52, h * 0.78, h];
  levels.forEach((z, i) => {
    /* The floor plates read as a stack, so they are graded: the ground line
       and the roof line carry the shape, the ones between are structure. */
    const edge = i === 0 || i === levels.length - 1;
    const alpha = a * (edge ? 1 : 0.42);
    const sw = edge ? stroke : stroke * 0.62;
    s += line(iso(x0, y, z), iso(x1, y, z), alpha, sw);
    s += line(iso(x0, y + d, z), iso(x1, y + d, z), alpha, sw);
    s += line(iso(x, y0, z), iso(x, y1, z), alpha, sw);
    s += line(iso(x + w, y0, z), iso(x + w, y1, z), alpha, sw);
  });

  /* One interior grid line each way at the roof only. At every level it read
     as a lattice; at one it reads as a setting-out grid. */
  s += line(iso(x + w / 2, y0, h), iso(x + w / 2, y1, h), a * 0.4, stroke * 0.6);
  s += line(iso(x0, y + d / 2, h), iso(x1, y + d / 2, h), a * 0.4, stroke * 0.6);

  return s;
}

/* ------------------------------------------------------------------- scene */

const BLOCK = 9.4;   // block pitch, in world units
const STREET = 2.9;  // carriageway between blocks
const INNER = BLOCK - STREET;
const REACH = 16;    // how far out to consider plots, in blocks

/* Solve the vertical offset so the middle of the hero plot lands on HERO_AT.
   See the note on CX above: the horizontal is already centred. */
CY = H * HERO_AT - INNER * SIN * SCALE;

/**
 * How far out the haze reaches, in world units.
 *
 * Everything past this is background blue, which is what closes the picture
 * off at the edges without needing a border or a vignette drawn on top.
 */
const HAZE = BLOCK * 7.5;

const parts = [];
const cells = [];

/* Cull by where a plot actually lands, not by how far it is on the grid. The
   projection is a diamond, so a radius in grid space throws away plots that
   are on screen and keeps plots that are nowhere near it. */
const MARGIN = 220;
for (let gx = -REACH; gx <= REACH; gx++) {
  for (let gy = -REACH; gy <= REACH; gy++) {
    const bx = gx * BLOCK;
    const by = gy * BLOCK;
    const corners = [
      iso(bx, by, 0),
      iso(bx + INNER, by, 0),
      iso(bx + INNER, by + INNER, 0),
      iso(bx, by + INNER, 0),
    ];
    const onScreen = corners.some(
      ([sx, sy]) => sx > -MARGIN && sx < W + MARGIN && sy > -MARGIN && sy < H + MARGIN,
    );
    if (!onScreen) continue;
    const t = Math.min(1, (Math.hypot(bx, by) / HAZE) ** 0.9);
    cells.push({ gx, gy, bx, by, t });
  }
}

/* Painter's algorithm: far plots first, so near ones overlap them. */
cells.sort((a, b) => a.gx + a.gy - (b.gx + b.gy));

for (const { gx, gy, bx, by, t } of cells) {
  const isHero = gx === 0 && gy === 0;

  /* The plot slab — what the buildings stand on, and what reads as ground. */
  const plot = (1 - t) ** 1.4 * 0.14 + 0.025;
  parts.push(
    `<polygon points="${pts([[bx, by, 0], [bx + INNER, by, 0], [bx + INNER, by + INNER, 0], [bx, by + INNER, 0]])}" fill="none" stroke="${rgb(AZURE_400, plot)}" stroke-width="1"/>`,
  );

  if (isHero) continue; // the centre is built separately, after everything else

  /**
   * One to three massings per plot.
   *
   * Fewer and larger than looks right on paper. An even scatter of small boxes
   * reads as a texture — which is exactly what the first pass produced — and a
   * texture has no skyline. Letting a plot hold one big block, and occasionally
   * a tower, is what gives the eye something to travel over.
   */
  const n = 1 + Math.floor(rand() * 2.6);
  for (let i = 0; i < n; i++) {
    const w = INNER * (n === 1 ? 0.62 + rand() * 0.3 : 0.34 + rand() * 0.3);
    const d = INNER * (n === 1 ? 0.62 + rand() * 0.3 : 0.34 + rand() * 0.3);
    const x = bx + rand() * Math.max(0.1, INNER - w);
    const y = by + rand() * Math.max(0.1, INNER - d);
    /* Mostly low, occasionally not — a flat height distribution gives a city
       with no landmarks, which is the same failure as the even scatter. */
    /* Capped below the hero cluster. Whatever the skyline gains from a rival
       tower, the picture loses twice over — the cage stops reading as the
       subject the moment something behind it is taller. */
    const tower = rand() > 0.84;
    const h = (tower ? 4 + rand() * 3.4 : 1.4 + rand() * 2.8) * (1 - t * 0.45);
    parts.push(box(x, y, w, d, h, t));
  }
}

/**
 * The centre: a cluster of three, and the cage around the whole plot.
 *
 * Lit harder than anything around it and left at t = 0, so it sits in front of
 * its own city rather than in it.
 */
parts.push(box(0.5, 0.5, INNER * 0.42, INNER * 0.5, 6, 0, { lit: 0.9, lift: 0.3 }));
parts.push(box(INNER * 0.48, 0.9, INNER * 0.46, INNER * 0.34, 9.2, 0, { lit: 1, lift: 0.38 }));
parts.push(box(INNER * 0.2, INNER * 0.56, INNER * 0.56, INNER * 0.36, 4, 0, { lit: 0.85, lift: 0.24 }));

parts.push(cage(-0.5, -0.5, INNER + 1, INNER + 1, 9.6, { over: 1.5, stroke: 1.9 }));

/**
 * Setting-out lines running out across the city, fading as they go.
 *
 * The reference has these, and they are what ties the cage to the grid instead
 * of leaving it sitting on top like a sticker.
 */
const trail = [];
for (let i = -2; i <= 3; i++) {
  const off = i * (INNER / 2);
  const a = 0.16 - Math.abs(i - 0.5) * 0.028;
  if (a <= 0.015) continue;
  const run = REACH * BLOCK;
  const across = (p, q) =>
    `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${rgb(WHITE, a)}" stroke-width="1.6"/>`;
  trail.push(across(iso(-run, off, 0), iso(run, off, 0)));
  trail.push(across(iso(off, -run, 0), iso(off, run, 0)));
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${rgb(INK_950)}"/>
  <g>${parts.join("")}</g>
  <g>${trail.join("")}</g>
</svg>`;

/* ------------------------------------------------------------------ raster */

/**
 * Tilt-shift, blended by hand on raw pixels.
 *
 * The obvious way to do this is to blur a copy, give it a vertical alpha ramp
 * and composite it back. Two attempts at that came out wrong in two different
 * ways — a fifth channel appended instead of a fourth, then a mask sharp
 * declined to read as alpha at all — and both failures looked like artwork
 * (blown-out bands, a black stripe) rather than like errors, which is the
 * expensive kind of wrong.
 *
 * So: render twice, sharp and blurred, and mix the two per row. It is a dozen
 * lines, it has no library semantics to get wrong, and what it does is legible
 * from the code.
 */
const FOCUS_TOP = 0.26;
const FOCUS_BOTTOM = 0.8;

const render = (blur) => {
  const pipe = sharp(Buffer.from(svg)).removeAlpha();
  return (blur ? pipe.blur(blur) : pipe).raw().toBuffer();
};

const [sharpRaw, blurRaw] = await Promise.all([render(0), render(11)]);

const out = Buffer.alloc(W * H * 3);
for (let y = 0; y < H; y++) {
  const t = y / H;
  /* How much of the blurred copy this row takes: none through the focus band,
     easing to all of it at the top and bottom edges. */
  let a = 0;
  if (t < FOCUS_TOP) a = Math.min(1, (FOCUS_TOP - t) / FOCUS_TOP) ** 0.8;
  else if (t > FOCUS_BOTTOM) a = Math.min(1, (t - FOCUS_BOTTOM) / (1 - FOCUS_BOTTOM)) ** 0.8;

  const start = y * W * 3;
  const end = start + W * 3;
  if (a === 0) {
    sharpRaw.copy(out, start, start, end);
    continue;
  }
  const inv = 1 - a;
  for (let i = start; i < end; i++) {
    out[i] = sharpRaw[i] * inv + blurRaw[i] * a;
  }
}

const info = await sharp(out, { raw: { width: W, height: H, channels: 3 } })
  .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toFile(OUT);

console.log(`wrote ${OUT} — ${info.width}x${info.height}, ${Math.round(info.size / 1024)}KB`);
