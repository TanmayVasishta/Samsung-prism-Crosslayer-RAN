// create_pptx.js
// CrossLayerAI-RAN — Samsung PRISM Project Presentation
// Run: node create_pptx.js

const pptxgen = require("pptxgenjs");
let pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5 inches
pres.title = "CrossLayerAI-RAN: Samsung PRISM";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  navy:    "0D1B4B",
  blue:    "1565C0",
  cyan:    "00B4D8",
  white:   "FFFFFF",
  offwhite:"F0F4FF",
  gray:    "64748B",
  lightgray:"E8EEF8",
  green:   "10B981",
  orange:  "F59E0B",
  red:     "EF4444",
  magenta: "E040FB",
};

const FONT = "Calibri";

// ── Helpers ───────────────────────────────────────────────────────────────────
function darkSlide(slide) {
  slide.background = { color: C.navy };
}

function lightSlide(slide) {
  slide.background = { color: C.offwhite };
}

function addTitle(slide, text, dark = true) {
  slide.addText(text, {
    x: 0.5, y: 0.25, w: 12.3, h: 0.9,
    fontFace: FONT, fontSize: 40, bold: true,
    color: dark ? C.white : C.navy,
    align: "left", valign: "middle",
  });
  // accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 1.5, h: 0.07,
    fill: { color: C.cyan }, line: { color: C.cyan },
  });
}

function addSubtitle(slide, text, dark = true) {
  slide.addText(text, {
    x: 0.5, y: 1.35, w: 12.3, h: 0.5,
    fontFace: FONT, fontSize: 20,
    color: dark ? "90CAF9" : C.gray,
    align: "left", valign: "top",
  });
}

function kpiBox(slide, x, y, w, h, number, label, color) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.navy },
    line: { color: color, width: 2.5 },
    shadow: { type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.25 },
  });
  slide.addText(number, {
    x: x + 0.1, y: y + 0.1, w: w - 0.2, h: h * 0.55,
    fontFace: FONT, fontSize: 44, bold: true, color: color,
    align: "center", valign: "bottom",
  });
  slide.addText(label, {
    x: x + 0.1, y: y + h * 0.58, w: w - 0.2, h: h * 0.38,
    fontFace: FONT, fontSize: 15, color: C.white,
    align: "center", valign: "top",
  });
}

function bullet(text, options = {}) {
  return { text, options: { bullet: true, breakLine: true, fontSize: 18, fontFace: FONT, color: C.navy, ...options } };
}

function cardBox(slide, x, y, w, h, title, body, accent = C.cyan) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.white },
    line: { color: C.lightgray, width: 1 },
    shadow: { type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.12 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.1, h,
    fill: { color: accent }, line: { color: accent },
  });
  slide.addText(title, {
    x: x + 0.2, y: y + 0.1, w: w - 0.3, h: 0.4,
    fontFace: FONT, fontSize: 18, bold: true, color: C.navy,
    align: "left", valign: "middle",
  });
  slide.addText(body, {
    x: x + 0.2, y: y + 0.5, w: w - 0.3, h: h - 0.6,
    fontFace: FONT, fontSize: 15, color: C.gray,
    align: "left", valign: "top",
  });
}

function slideNumber(slide, n, total) {
  slide.addText(`${n} / ${total}`, {
    x: 12.3, y: 7.2, w: 0.8, h: 0.25,
    fontFace: FONT, fontSize: 11, color: C.gray,
    align: "right",
  });
}

const TOTAL = 20;

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 1 — TITLE
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  darkSlide(s);

  // Large cyan bar left
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 7.5,
    fill: { color: C.cyan }, line: { color: C.cyan },
  });

  s.addText("CrossLayerAI-RAN", {
    x: 0.5, y: 1.2, w: 12.3, h: 1.3,
    fontFace: FONT, fontSize: 56, bold: true, color: C.white,
    align: "left",
  });
  s.addText("Infrastructure-Aware AI for Proactive RAN Performance Prediction", {
    x: 0.5, y: 2.6, w: 12.3, h: 0.8,
    fontFace: FONT, fontSize: 24, color: C.cyan,
    align: "left",
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.55, w: 10, h: 0.05,
    fill: { color: "3A4F8C" }, line: { color: "3A4F8C" },
  });

  s.addText([
    { text: "Samsung PRISM Worklet  |  ", options: { color: "90CAF9" } },
    { text: "B.M.S. College of Engineering  |  ", options: { color: "90CAF9" } },
    { text: "2025–26", options: { color: C.cyan, bold: true } },
  ], {
    x: 0.5, y: 3.75, w: 12.3, h: 0.5,
    fontFace: FONT, fontSize: 18, align: "left",
  });

  s.addText("Worklet ID: 26NCOAM02BMS", {
    x: 0.5, y: 6.8, w: 8, h: 0.4,
    fontFace: FONT, fontSize: 13, color: "607DAA",
    align: "left",
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 2 — THE PROBLEM
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  lightSlide(s);
  addTitle(s, "The Problem", false);
  addSubtitle(s, "HPC clusters fail silently — and traditional monitoring misses it", false);
  slideNumber(s, 2, TOTAL);

  // Left text
  s.addText([
    bullet("JLab (Jefferson Lab) runs 300+ compute nodes across 5 hardware farms"),
    bullet("A real anomalous event occurred on May 23, 2023 — unknown cause, unknown affected nodes"),
    bullet("180 GB+ of Prometheus metrics collected (memory, SLURM, CPU, disk)"),
    bullet("Zero labels — no one tagged which nodes failed or when"),
    bullet("Traditional threshold alerts are static — miss gradual degradation"),
    bullet("Challenge: detect the event purely from patterns in normal vs. anomalous data"),
  ], {
    x: 0.5, y: 1.6, w: 7.2, h: 5.2,
    fontFace: FONT, fontSize: 18, color: C.navy,
    align: "left", valign: "top",
  });

  // Right: stat callouts
  kpiBox(s, 8.0, 1.6, 2.3, 1.5, "180 GB+", "Raw Prometheus Data", C.cyan);
  kpiBox(s, 8.0, 3.25, 2.3, 1.5, "300+", "Compute Nodes", C.orange);
  kpiBox(s, 8.0, 4.9, 2.3, 1.5, "ZERO", "Ground-Truth Labels", C.red);
  kpiBox(s, 10.5, 1.6, 2.3, 1.5, "5", "Hardware Farms", C.cyan);
  kpiBox(s, 10.5, 3.25, 2.3, 1.5, "4", "Data Modalities", C.orange);
  kpiBox(s, 10.5, 4.9, 2.3, 1.5, "1", "Real Event (May 23)", C.magenta);
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 3 — OUR SOLUTION AT A GLANCE
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  darkSlide(s);
  addTitle(s, "Our Solution at a Glance", true);
  addSubtitle(s, "End-to-end unsupervised anomaly detection — no labels required", true);
  slideNumber(s, 3, TOTAL);

  const items = [
    ["180 GB+", "Raw data processed", C.cyan],
    ["634", "Features engineered", C.orange],
    ["3", "Models per cluster", C.green],
    ["5", "Hardware clusters", C.cyan],
    ["99–100%", "Recall achieved", C.green],
    ["~0.01 ms", "Inference latency", C.orange],
    ["15", "Trained models saved", C.magenta],
    ["0", "Ground-truth labels used", C.cyan],
  ];

  items.forEach(([num, label, color], i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    kpiBox(s, 0.4 + col * 3.15, 1.7 + row * 2.4, 2.85, 2.1, num, label, color);
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 4 — DATASET
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  lightSlide(s);
  addTitle(s, "Dataset: JLab Computing Cluster", false);
  addSubtitle(s, "Zenodo open dataset — Prometheus metrics, May 19–23 2023", false);
  slideNumber(s, 4, TOTAL);

  // Farm cards
  const farms = [
    ["farm14", "436K train rows", "505 distress rows in test", C.cyan],
    ["farm16", "210K train rows", "699 distress rows in test", C.orange],
    ["farm18", "458K train rows", "43 distress rows in test", C.green],
    ["farm19", "590K train rows", "824 distress rows in test", C.magenta],
    ["farm23", "133K train rows", "0 distress rows in test", C.gray],
  ];

  farms.forEach(([name, rows, distress, color], i) => {
    const x = 0.4 + i * 2.5;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.6, w: 2.2, h: 2.6,
      fill: { color: C.white },
      line: { color: color, width: 2 },
      shadow: { type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.1 },
    });
    s.addText(name, {
      x: x + 0.05, y: 1.65, w: 2.1, h: 0.55,
      fontFace: FONT, fontSize: 22, bold: true, color: color,
      align: "center",
    });
    s.addText(rows, {
      x: x + 0.05, y: 2.25, w: 2.1, h: 0.5,
      fontFace: FONT, fontSize: 14, color: C.navy,
      align: "center",
    });
    s.addText(distress, {
      x: x + 0.05, y: 2.8, w: 2.1, h: 0.5,
      fontFace: FONT, fontSize: 13, color: C.gray,
      align: "center",
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.35, w: 2.2, h: 0.08,
      fill: { color: color }, line: { color: color },
    });
  });

  // Modalities below
  s.addText("Data Modalities Used", {
    x: 0.4, y: 4.35, w: 12, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.navy, align: "left",
  });

  const mods = [
    ["memory_data", "RAM metrics, 1-min cadence\nResample: 1T", C.cyan],
    ["slurm_data", "Scheduler CPU alloc/idle\nEvent-driven, no resample", C.orange],
    ["cpu_data", "EXCLUDED — zero May 23\nPrometheus scraping gap", C.red],
    ["disk_data", "EXCLUDED — zero May 23\nPrometheus scraping gap", C.red],
  ];

  mods.forEach(([name, desc, color], i) => {
    const x = 0.4 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 4.95, w: 2.9, h: 1.9,
      fill: { color: C.white },
      line: { color: C.lightgray, width: 1 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 4.95, w: 2.9, h: 0.07,
      fill: { color: color }, line: { color: color },
    });
    s.addText(name, {
      x: x + 0.1, y: 5.05, w: 2.7, h: 0.45,
      fontFace: FONT, fontSize: 15, bold: true, color: C.navy, align: "left",
    });
    s.addText(desc, {
      x: x + 0.1, y: 5.55, w: 2.7, h: 1.2,
      fontFace: FONT, fontSize: 13, color: C.gray, align: "left", valign: "top",
    });
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 5 — PIPELINE ARCHITECTURE
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  darkSlide(s);
  addTitle(s, "Pipeline Architecture", true);
  addSubtitle(s, "6-stage end-to-end pipeline — each stage preserves data integrity", true);
  slideNumber(s, 5, TOTAL);

  const stages = [
    ["1", "Structural\nCleaning", "Drop junk cols\nNaN / NaT removal\nDeduplication", C.cyan],
    ["2", "Chronological\nSplit", "Train: May 19–22\nTest: May 23\nZero overlap verified", C.orange],
    ["3", "Train-Only\nStats", "IQR + mean/std\nComputed on train\nNo test leakage", C.green],
    ["4", "Feature\nEngineering", "Rolling windows\nLag features\nSLURM ratios", C.magenta],
    ["5", "Multimodal\nJoin", "memory + slurm\nJoin on (node, time)\n634 features", C.cyan],
    ["6", "Multimodel\nTraining", "IF + LOF + AE\nPer cluster\nEnsemble vote", C.orange],
  ];

  stages.forEach(([num, title, desc, color], i) => {
    const x = 0.35 + i * 2.12;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.6, w: 1.95, h: 4.6,
      fill: { color: "0A1640" },
      line: { color: color, width: 2 },
      shadow: { type: "outer", blur: 8, offset: 2, angle: 135, color: "000000", opacity: 0.3 },
    });
    s.addText(num, {
      x: x + 0.05, y: 1.7, w: 1.85, h: 0.7,
      fontFace: FONT, fontSize: 32, bold: true, color: color,
      align: "center",
    });
    s.addText(title, {
      x: x + 0.05, y: 2.45, w: 1.85, h: 0.9,
      fontFace: FONT, fontSize: 16, bold: true, color: C.white,
      align: "center",
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.3, y: 3.4, w: 1.35, h: 0.05,
      fill: { color: color }, line: { color: color },
    });
    s.addText(desc, {
      x: x + 0.05, y: 3.5, w: 1.85, h: 2.5,
      fontFace: FONT, fontSize: 13, color: "B0C4DE",
      align: "center", valign: "top",
    });
    // Arrow between boxes
    if (i < stages.length - 1) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 1.95, y: 3.7, w: 0.17, h: 0.06,
        fill: { color: C.cyan }, line: { color: C.cyan },
      });
    }
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 6 — SMART DATA SPLIT (KEY INNOVATION)
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  lightSlide(s);
  addTitle(s, "Smart Data Split  —  Key Design Decision", false);
  addSubtitle(s, "Most projects shuffle data. We didn't. Here's why that matters.", false);
  slideNumber(s, 6, TOTAL);

  // Timeline bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.0, w: 9.5, h: 0.5,
    fill: { color: "2D6A4F" }, line: { color: "2D6A4F" },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 8.0, y: 2.0, w: 2.0, h: 0.5,
    fill: { color: C.red }, line: { color: C.red },
  });
  s.addText("TRAIN  (May 19 – 22)  |  4 days  |  Normal behaviour only", {
    x: 0.5, y: 2.0, w: 7.5, h: 0.5,
    fontFace: FONT, fontSize: 16, bold: true, color: C.white, align: "center", valign: "middle",
  });
  s.addText("TEST  (May 23)", {
    x: 8.0, y: 2.0, w: 2.0, h: 0.5,
    fontFace: FONT, fontSize: 15, bold: true, color: C.white, align: "center", valign: "middle",
  });

  s.addText("May 19", { x: 0.5, y: 2.55, w: 1, h: 0.35, fontFace: FONT, fontSize: 13, color: C.gray });
  s.addText("May 22", { x: 7.0, y: 2.55, w: 1, h: 0.35, fontFace: FONT, fontSize: 13, color: C.gray });
  s.addText("May 23  →  Anomalous Event!", { x: 7.8, y: 2.55, w: 2.5, h: 0.35, fontFace: FONT, fontSize: 13, bold: true, color: C.red });

  // Stats row
  const splitStats = [
    ["~83%", "Train Split\n(normal only)", C.green],
    ["~17%", "Test Split\n(anomalous day)", C.red],
    ["NONE", "Validation Set\n(unsupervised — no labels)", C.orange],
    ["ZERO", "Temporal Overlap\nverified in manifest", C.cyan],
  ];

  splitStats.forEach(([num, label, color], i) => {
    const x = 0.5 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.15, w: 2.8, h: 1.6,
      fill: { color: C.white }, line: { color: color, width: 2 },
      shadow: { type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.1 },
    });
    s.addText(num, {
      x: x + 0.05, y: 3.2, w: 2.7, h: 0.85,
      fontFace: FONT, fontSize: 36, bold: true, color: color, align: "center",
    });
    s.addText(label, {
      x: x + 0.05, y: 4.05, w: 2.7, h: 0.65,
      fontFace: FONT, fontSize: 13, color: C.gray, align: "center",
    });
  });

  // Why this matters
  s.addText("Why this is correct for anomaly detection:", {
    x: 0.5, y: 4.95, w: 12, h: 0.4,
    fontFace: FONT, fontSize: 19, bold: true, color: C.navy, align: "left",
  });
  s.addText([
    { text: "Models learn what NORMAL looks like from train, then flag anything in test that deviates — shuffling would let anomalies pollute the normal baseline and destroy recall.", options: { color: C.gray, fontSize: 16, breakLine: true } },
    { text: "All statistics (IQR, mean, std) computed on train only — zero leakage from test into the model.", options: { color: C.gray, fontSize: 16 } },
  ], {
    x: 0.5, y: 5.4, w: 12.3, h: 1.8,
    fontFace: FONT, align: "left", valign: "top",
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 7 — FEATURE ENGINEERING
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  darkSlide(s);
  addTitle(s, "Feature Engineering", true);
  addSubtitle(s, "Two modalities × multi-scale transforms → 634 features per node-timestamp", true);
  slideNumber(s, 7, TOTAL);

  // Two-column
  // Memory
  s.addText("Memory Data Features", {
    x: 0.4, y: 1.55, w: 5.8, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.cyan, align: "left",
  });
  s.addText([
    bullet("Rolling windows: 5-min, 15-min, 60-min", { color: C.white }),
    bullet("Aggregations: mean, std, min, max per window", { color: C.white }),
    bullet("Lag-1 differences per (instance, metric)", { color: C.white }),
    bullet("Pivoted to wide format: 1 row = 1 (node, timestamp)", { color: C.white }),
    bullet("Rows with >30% NaN dropped (warmup period)", { color: C.white }),
  ], {
    x: 0.4, y: 2.1, w: 5.8, h: 3.5,
    fontFace: FONT, align: "left", valign: "top",
  });

  // Divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.5, y: 1.6, w: 0.05, h: 5.2,
    fill: { color: "2A3A6A" }, line: { color: "2A3A6A" },
  });

  // SLURM
  s.addText("SLURM Data Features", {
    x: 6.8, y: 1.55, w: 5.8, h: 0.5,
    fontFace: FONT, fontSize: 22, bold: true, color: C.orange, align: "left",
  });
  s.addText([
    bullet("CPU utilization: alloc / total ratio per node", { color: C.white }),
    bullet("Idle ratio: idle / total CPU ratio", { color: C.white }),
    bullet("Node status one-hot: allocated / idle / mixed / down", { color: C.white }),
    bullet("is_distress_status: binary flag (down/drained/failing)", { color: C.white }),
    bullet("Status transition rates across timesteps", { color: C.white }),
  ], {
    x: 6.8, y: 2.1, w: 5.8, h: 3.5,
    fontFace: FONT, align: "left", valign: "top",
  });

  // Multimodal join
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.8, w: 12.3, h: 1.35,
    fill: { color: "0A1640" },
    line: { color: C.cyan, width: 2 },
  });
  s.addText("Multimodal Join:  memory + SLURM joined on (node, timestamp)  →  634 features  |  StandardScaler normalisation  |  Train stats only", {
    x: 0.6, y: 5.9, w: 12.1, h: 1.1,
    fontFace: FONT, fontSize: 17, bold: true, color: C.cyan,
    align: "center", valign: "middle",
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 8 — STATIONARITY ANALYSIS (ADF + ACF/PACF)
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  darkSlide(s);
  addTitle(s, "Stationarity Analysis  —  Statistical Validation", true);
  addSubtitle(s, "ADF + ACF / PACF on the train split per (farm, metric)", true);
  slideNumber(s, 8, TOTAL);

  // Why this matters
  s.addText("Why this matters", {
    x: 0.5, y: 1.9, w: 6.2, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.cyan,
  });
  s.addText([
    bullet("Autoencoders & density models assume stable normal-data distribution.", { color: C.white }),
    bullet("If a metric drifts in mean/variance, the trained baseline won't generalize.", { color: C.white }),
    bullet("ADF formalizes this. ACF/PACF reveal lag structure for feature engineering.", { color: C.white }),
  ], {
    x: 0.5, y: 2.4, w: 6.2, h: 2.4,
    fontFace: FONT, fontSize: 16, color: C.white,
  });

  // Method
  s.addText("What we ran", {
    x: 0.5, y: 4.9, w: 6.2, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.cyan,
  });
  s.addText([
    bullet("ADF test  (null = unit root → non-stationary)", { color: C.white, fontSize: 15 }),
    bullet("ACF up to lag 50 with 95% confidence band", { color: C.white, fontSize: 15 }),
    bullet("PACF (Yule-Walker) up to lag 50", { color: C.white, fontSize: 15 }),
    bullet("5 farms × 8 metrics  =  40 time series  →  40 plots auto-generated", { color: C.white, fontSize: 15 }),
  ], {
    x: 0.5, y: 5.35, w: 6.2, h: 1.9,
    fontFace: FONT, fontSize: 15, color: C.white,
  });

  // Right-side KPI cards — verdict distribution
  s.addText("Verdict distribution (35 tested)", {
    x: 7.1, y: 1.9, w: 5.8, h: 0.4,
    fontFace: FONT, fontSize: 20, bold: true, color: C.cyan, align: "left",
  });

  kpiBox(s, 7.1, 2.5, 2.75, 1.7, "21", "Strongly stationary\n(p < 0.01)", C.green);
  kpiBox(s, 10.05, 2.5, 2.85, 1.7, "10", "Stationary\n(p < 0.05)", C.green);
  kpiBox(s, 7.1, 4.35, 2.75, 1.7, "4", "Marginal\n(0.05 ≤ p < 0.10)", C.orange);
  kpiBox(s, 10.05, 4.35, 2.85, 1.7, "0", "Non-stationary\n(p ≥ 0.10)", C.red);

  // Headline callout at bottom
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.1, y: 6.2, w: 5.8, h: 1.05,
    fill: { color: "0A1640" }, line: { color: C.green, width: 2 },
  });
  s.addText("89% stationary, zero failures.  Strong ACF at lags 1-5 → empirically justifies the 1/5/15-step lag features.", {
    x: 7.25, y: 6.3, w: 5.5, h: 0.85,
    fontFace: FONT, fontSize: 13, color: C.white, italic: true, valign: "middle",
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 9 — MODEL 1: ISOLATION FOREST
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  lightSlide(s);
  addTitle(s, "Model 1: Isolation Forest", false);
  addSubtitle(s, "Tree-based anomaly detection — anomalies are isolated faster", false);
  slideNumber(s, 9, TOTAL);

  // Left: how it works
  s.addText("How it works", {
    x: 0.4, y: 1.6, w: 6, h: 0.45,
    fontFace: FONT, fontSize: 20, bold: true, color: C.navy,
  });
  s.addText([
    bullet("Builds 100 random decision trees on the training data"),
    bullet("Anomalous points are isolated in fewer splits (shorter path)"),
    bullet("Trained ONLY on normal data (May 19–22)"),
    bullet("contamination = 0.01 (assumes ≤1% anomalies in training)"),
    bullet("StandardScaler applied before fitting"),
    bullet("Fastest model: ~0.004 ms per row — real-time capable"),
  ], {
    x: 0.4, y: 2.1, w: 6.2, h: 4.5,
    fontFace: FONT, align: "left", valign: "top",
  });

  // Right: IF results table
  s.addText("Results", {
    x: 7.0, y: 1.6, w: 5.8, h: 0.45,
    fontFace: FONT, fontSize: 20, bold: true, color: C.navy,
  });

  const ifData = [
    [{ text: "Farm", options: { bold: true, fill: { color: C.navy }, color: C.white } },
     { text: "Recall", options: { bold: true, fill: { color: C.navy }, color: C.white } },
     { text: "Precision", options: { bold: true, fill: { color: C.navy }, color: C.white } },
     { text: "Latency", options: { bold: true, fill: { color: C.navy }, color: C.white } }],
    ["farm14", "44.2%", "5.4%", "0.005 ms"],
    ["farm16", "71.5%", "8.8%", "0.004 ms"],
    ["farm18", "32.6%", "0.3%", "0.005 ms"],
    ["farm19", "0.0%", "0.0%", "0.004 ms"],
    ["farm23", "N/A", "N/A", "0.004 ms"],
  ];

  s.addTable(ifData, {
    x: 7.0, y: 2.1, w: 5.8, h: 3.0,
    colW: [1.5, 1.3, 1.5, 1.5],
    border: { pt: 1, color: C.lightgray },
    fill: { color: C.white },
    fontFace: FONT, fontSize: 16,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.0, y: 5.25, w: 5.8, h: 1.1,
    fill: { color: "FFF3CD" }, line: { color: C.orange, width: 1.5 },
  });
  s.addText("farm19 gets 0% recall — the contamination assumption doesn't match farm19's unique traffic pattern. Fixed with the Autoencoder + Adaptive Thresholding.", {
    x: 7.1, y: 5.3, w: 5.6, h: 1.0,
    fontFace: FONT, fontSize: 14, color: "7B4F00", align: "left", valign: "middle",
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 9 — MODEL 2: AUTOENCODER
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  darkSlide(s);
  addTitle(s, "Model 2: Autoencoder", true);
  addSubtitle(s, "Neural network trained to reconstruct normal — fails loudly on anomalies", true);
  slideNumber(s, 10, TOTAL);

  // Architecture diagram
  const layers = [
    { label: "Input\n634", w: 1.2, color: C.cyan },
    { label: "256", w: 0.9, color: C.blue },
    { label: "128", w: 0.75, color: "1E88E5" },
    { label: "Bottleneck\n32", w: 0.65, color: C.magenta },
    { label: "128", w: 0.75, color: "1E88E5" },
    { label: "256", w: 0.9, color: C.blue },
    { label: "Output\n634", w: 1.2, color: C.cyan },
  ];

  let xPos = 0.5;
  layers.forEach((layer, i) => {
    const bh = layer.w * 4.5;
    const by = 3.5 - bh / 2;
    s.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: by, w: 0.7, h: bh,
      fill: { color: layer.color },
      line: { color: layer.color },
      shadow: { type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.3 },
    });
    s.addText(layer.label, {
      x: xPos, y: by + bh + 0.1, w: 0.7, h: 0.6,
      fontFace: FONT, fontSize: 13, color: C.white, align: "center",
    });
    if (i < layers.length - 1) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: xPos + 0.7, y: 3.47, w: 0.25, h: 0.06,
        fill: { color: "3A4F8C" }, line: { color: "3A4F8C" },
      });
    }
    xPos += 0.95;
  });

  s.addText("Encoder", { x: 1.2, y: 5.8, w: 2.5, h: 0.4, fontFace: FONT, fontSize: 15, color: C.cyan, align: "center" });
  s.addText("Decoder", { x: 4.2, y: 5.8, w: 2.5, h: 0.4, fontFace: FONT, fontSize: 15, color: C.cyan, align: "center" });

  // Right side explanation
  s.addText([
    bullet("Trained to reconstruct NORMAL inputs with minimal error", { color: C.white, fontSize: 17 }),
    bullet("Anomalous inputs have high reconstruction error (never seen in training)", { color: C.white, fontSize: 17 }),
    bullet("Threshold = Nth percentile of training reconstruction errors", { color: C.white, fontSize: 17 }),
    bullet("Adaptive per cluster: farm14/16/18/23 → 99th pct | farm19 → 85th pct", { color: C.white, fontSize: 17 }),
    bullet("Only ~0.01 ms inference latency — real-time deployable", { color: C.white, fontSize: 17 }),
  ], {
    x: 7.5, y: 1.6, w: 5.5, h: 5.5,
    fontFace: FONT, align: "left", valign: "top",
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 10 — INNOVATION: DENOISING AUTOENCODER (farm14)
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  lightSlide(s);
  addTitle(s, "Innovation: Denoising Autoencoder  (farm14)", false);
  addSubtitle(s, "Sensor drift was silently destroying accuracy — we fixed it without new data", false);
  slideNumber(s, 11, TOTAL);

  // Problem card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.6, w: 5.8, h: 2.6,
    fill: { color: "FFF0F0" }, line: { color: C.red, width: 2 },
  });
  s.addText("The Problem with farm14", {
    x: 0.6, y: 1.7, w: 5.5, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.red,
  });
  s.addText("farm14's memory sensors exhibit gradual drift — small, systematic biases accumulate over time. A standard autoencoder trained on early normal data would see later normal states as slightly anomalous, destroying precision and recall.", {
    x: 0.6, y: 2.25, w: 5.5, h: 1.85,
    fontFace: FONT, fontSize: 16, color: C.gray, valign: "top",
  });

  // Solution card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 4.35, w: 5.8, h: 2.8,
    fill: { color: "F0FFF4" }, line: { color: C.green, width: 2 },
  });
  s.addText("Our Solution: Denoising AE", {
    x: 0.6, y: 4.45, w: 5.5, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: C.green,
  });
  s.addText("During training, we inject small Gaussian noise (σ=0.01) into the INPUT but train the model to reconstruct the CLEAN original. This forces the model to learn robust representations that ignore small perturbations — generalising across sensor drift naturally.", {
    x: 0.6, y: 5.0, w: 5.5, h: 2.0,
    fontFace: FONT, fontSize: 16, color: C.gray, valign: "top",
  });

  // Before/after metric
  kpiBox(s, 7.0, 1.6, 2.8, 2.8, "78.2%", "Recall BEFORE\nDenoising AE", C.red);
  kpiBox(s, 10.1, 1.6, 2.8, 2.8, "99.0%", "Recall AFTER\nDenoising AE", C.green);

  s.addText("+20.8 percentage points\nimprovement", {
    x: 7.0, y: 4.55, w: 5.9, h: 1.2,
    fontFace: FONT, fontSize: 22, bold: true, color: C.navy, align: "center", valign: "middle",
  });

  s.addText("Applied ONLY to farm14 — other farms use standard AE", {
    x: 7.0, y: 5.85, w: 5.9, h: 0.7,
    fontFace: FONT, fontSize: 15, color: C.gray, align: "center",
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 11 — INNOVATION: ADAPTIVE THRESHOLDING (farm19)
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  darkSlide(s);
  addTitle(s, "Innovation: Adaptive Thresholding  (farm19)", true);
  addSubtitle(s, "One threshold doesn't fit all — cluster-aware calibration saves recall", true);
  slideNumber(s, 12, TOTAL);

  // Bar chart: before/after recall
  s.addChart(pres.charts.BAR, [
    { name: "Recall (%)", labels: ["farm14", "farm16", "farm18", "farm19 (before)", "farm19 (after)"], values: [99, 99.4, 100, 6.7, 100] }
  ], {
    x: 0.5, y: 1.6, w: 7.0, h: 5.0,
    barDir: "col",
    chartColors: [C.green, C.green, C.green, C.red, C.green],
    chartArea: { fill: { color: "0A1640" }, roundedCorners: false },
    catAxisLabelColor: C.white,
    valAxisLabelColor: C.white,
    valGridLine: { color: "2A3A6A", size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelColor: C.white,
    showLegend: false,
    valAxisMaxVal: 110,
  });

  // Right explanation
  s.addText("The Challenge", {
    x: 7.8, y: 1.6, w: 5.1, h: 0.45,
    fontFace: FONT, fontSize: 20, bold: true, color: C.orange,
  });
  s.addText("farm19 has different hardware characteristics. Using the same 99th-percentile threshold as other farms gave only 6.7% recall — almost completely missing the anomalous event.", {
    x: 7.8, y: 2.1, w: 5.1, h: 1.5,
    fontFace: FONT, fontSize: 16, color: "B0C4DE", valign: "top",
  });

  s.addText("Our Solution", {
    x: 7.8, y: 3.75, w: 5.1, h: 0.45,
    fontFace: FONT, fontSize: 20, bold: true, color: C.green,
  });
  s.addText("Per-cluster adaptive threshold calibration. farm19 uses the 85th percentile (instead of 99th) of training reconstruction errors, which matches its hardware's normal variance profile.", {
    x: 7.8, y: 4.25, w: 5.1, h: 1.5,
    fontFace: FONT, fontSize: 16, color: "B0C4DE", valign: "top",
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.8, y: 5.9, w: 5.1, h: 0.8,
    fill: { color: "0A1640" }, line: { color: C.green, width: 2 },
  });
  s.addText("6.7%  →  100% Recall  on farm19", {
    x: 7.8, y: 5.9, w: 5.1, h: 0.8,
    fontFace: FONT, fontSize: 20, bold: true, color: C.green, align: "center", valign: "middle",
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 12 — MODEL 3: LOF + PCA
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  lightSlide(s);
  addTitle(s, "Model 3: Local Outlier Factor + PCA", false);
  addSubtitle(s, "Density-based detection — but high dimensions needed fixing first", false);
  slideNumber(s, 13, TOTAL);

  cardBox(s, 0.4, 1.6, 5.8, 2.5,
    "The Curse of Dimensionality Problem",
    "LOF computes local density by comparing distances to k nearest neighbours. In 634-dimensional space, all points appear equidistant — LOF loses its discriminative power entirely. Raw LOF was underperforming on farm19.",
    C.red);

  cardBox(s, 0.4, 4.25, 5.8, 2.9,
    "Our Fix: PCA Dimensionality Reduction",
    "We apply PCA (retaining 95% of variance) BEFORE LOF. This compresses 634 features down to ~30–80 principal components while preserving the key signal — restoring LOF's ability to distinguish normal from anomalous density regions.",
    C.green);

  // Right: before/after
  s.addText("LOF Performance Improvement", {
    x: 6.8, y: 1.6, w: 6.0, h: 0.45,
    fontFace: FONT, fontSize: 20, bold: true, color: C.navy,
  });

  const lofData = [
    [{ text: "Farm", options: { bold: true, fill: { color: C.navy }, color: C.white } },
     { text: "Raw LOF Recall", options: { bold: true, fill: { color: C.navy }, color: C.white } },
     { text: "PCA+LOF Recall", options: { bold: true, fill: { color: C.navy }, color: C.white } }],
    ["farm14", "62.6%", "Improved"],
    ["farm16", "99.1%", "Maintained"],
    ["farm18", "100%", "Maintained"],
    ["farm19", "90.2%", "Improved"],
  ];

  s.addTable(lofData, {
    x: 6.8, y: 2.1, w: 6.0, h: 2.6,
    colW: [1.5, 2.2, 2.2],
    border: { pt: 1, color: C.lightgray },
    fill: { color: C.white },
    fontFace: FONT, fontSize: 16,
  });

  s.addText("n_neighbors = 20  |  novelty = True  |  contamination = 0.01", {
    x: 6.8, y: 4.85, w: 6.0, h: 0.45,
    fontFace: FONT, fontSize: 14, color: C.gray,
  });

  kpiBox(s, 6.8, 5.4, 2.8, 1.7, "95%", "Variance retained\nby PCA", C.cyan);
  kpiBox(s, 9.8, 5.4, 2.8, 1.7, "~60", "Dimensions after PCA\n(from 634)", C.orange);
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 13 — RESULTS TABLE
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  darkSlide(s);
  addTitle(s, "Results: Model Performance Across All Farms", true);
  addSubtitle(s, "Autoencoder leads on recall — evaluated against proxy distress-status labels", true);
  slideNumber(s, 14, TOTAL);

  const tableData = [
    [
      { text: "Farm", options: { bold: true, fill: { color: C.cyan }, color: C.navy, fontSize: 17 } },
      { text: "Distress Rows", options: { bold: true, fill: { color: C.cyan }, color: C.navy, fontSize: 17 } },
      { text: "IF Recall", options: { bold: true, fill: { color: C.cyan }, color: C.navy, fontSize: 17 } },
      { text: "LOF Recall", options: { bold: true, fill: { color: C.cyan }, color: C.navy, fontSize: 17 } },
      { text: "AE Recall", options: { bold: true, fill: { color: C.cyan }, color: C.navy, fontSize: 17 } },
      { text: "AE Latency", options: { bold: true, fill: { color: C.cyan }, color: C.navy, fontSize: 17 } },
    ],
    [
      "farm14", "505",
      { text: "44.2%", options: { color: C.orange } },
      { text: "62.6%", options: { color: C.orange } },
      { text: "99.0% ★", options: { bold: true, color: C.green } },
      "0.011 ms",
    ],
    [
      "farm16", "699",
      { text: "71.5%", options: { color: C.orange } },
      { text: "99.1%", options: { color: C.green } },
      { text: "99.4% ★", options: { bold: true, color: C.green } },
      "0.011 ms",
    ],
    [
      "farm18", "43",
      { text: "32.6%", options: { color: C.red } },
      { text: "100% ★", options: { bold: true, color: C.green } },
      { text: "100% ★", options: { bold: true, color: C.green } },
      "0.011 ms",
    ],
    [
      "farm19", "824",
      { text: "0.0%", options: { color: C.red } },
      { text: "90.2%", options: { color: C.orange } },
      { text: "100% ★", options: { bold: true, color: C.green } },
      "0.028 ms",
    ],
    [
      "farm23", "0",
      { text: "N/A", options: { color: C.gray } },
      { text: "N/A", options: { color: C.gray } },
      { text: "N/A", options: { color: C.gray } },
      "0.010 ms",
    ],
  ];

  s.addTable(tableData, {
    x: 0.4, y: 1.7, w: 12.5, h: 4.5,
    colW: [1.5, 1.8, 1.8, 1.8, 1.9, 1.7],
    border: { pt: 1, color: "2A3A6A" },
    fill: { color: "0A1640" },
    color: C.white,
    fontFace: FONT, fontSize: 16,
    rowH: 0.75,
  });

  s.addText("★ = Best result for that farm   |   AE = Autoencoder (best model overall)   |   Latency ~0.01 ms = real-time capable", {
    x: 0.4, y: 6.35, w: 12.5, h: 0.45,
    fontFace: FONT, fontSize: 14, color: "607DAA", align: "center",
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 14 — KEY METRICS CALLOUTS
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  lightSlide(s);
  addTitle(s, "Key Achievements at a Glance", false);
  slideNumber(s, 15, TOTAL);

  kpiBox(s, 0.4,  1.55, 3.8, 2.6, "99–100%", "Recall across\nfarm14, 16, 18, 19", C.green);
  kpiBox(s, 4.45, 1.55, 3.8, 2.6, "~0.01 ms", "Inference latency\nper row (real-time)", C.cyan);
  kpiBox(s, 8.5,  1.55, 3.8, 2.6, "180 GB+",  "Raw data\nprocessed", C.orange);

  kpiBox(s, 0.4,  4.35, 3.8, 2.6, "634",      "Features engineered\nmultimodal join", C.magenta);
  kpiBox(s, 4.45, 4.35, 3.8, 2.6, "15",       "Trained model\nfiles saved", C.cyan);
  kpiBox(s, 8.5,  4.35, 3.8, 2.6, "0",        "Ground-truth labels\nused (fully unsupervised)", C.orange);
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 15 — WHAT WE DID DIFFERENTLY
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  darkSlide(s);
  addTitle(s, "What We Did Differently", true);
  addSubtitle(s, "6 design decisions that separate this from a standard ML project", true);
  slideNumber(s, 16, TOTAL);

  const ideas = [
    ["Anomaly-Detection-Aware Split", "Most projects shuffle. We used a strict chronological split — normal data in train, anomalous day in test. Shuffling would poison the normal baseline.", C.cyan],
    ["Per-Cluster Adaptive Thresholds", "A single global threshold failed farm19 (6.7% recall). We calibrated the threshold per hardware cluster, recovering 100% recall.", C.orange],
    ["Denoising Autoencoder for Sensor Drift", "Identified farm14's sensor drift problem and solved it by training the AE on noisy input → clean output, without any new data.", C.green],
    ["PCA before LOF", "LOF degrades badly in high dimensions (634 features). We compress with PCA (95% variance) before LOF, restoring its density-based discriminative power.", C.magenta],
    ["Multimodal Feature Join", "Combined memory metrics and SLURM scheduler data on (node, timestamp). Neither modality alone is sufficient.", C.cyan],
    ["Ensemble Voting (3 Models)", "Rather than picking one model, all 3 run in parallel. A majority vote (2/3 agree) improves precision without sacrificing recall.", C.orange],
  ];

  ideas.forEach(([title, desc, color], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.4 + col * 4.3;
    const y = 1.7 + row * 2.7;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.1, h: 2.5,
      fill: { color: "0A1640" },
      line: { color: color, width: 2 },
      shadow: { type: "outer", blur: 8, offset: 2, angle: 135, color: "000000", opacity: 0.3 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.1, h: 0.1,
      fill: { color: color }, line: { color: color },
    });
    s.addText(title, {
      x: x + 0.15, y: y + 0.15, w: 3.8, h: 0.55,
      fontFace: FONT, fontSize: 16, bold: true, color: color, align: "left",
    });
    s.addText(desc, {
      x: x + 0.15, y: y + 0.75, w: 3.8, h: 1.65,
      fontFace: FONT, fontSize: 14, color: "B0C4DE", align: "left", valign: "top",
    });
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 16 — CHALLENGES & SOLUTIONS
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  lightSlide(s);
  addTitle(s, "Challenges & Solutions", false);
  addSubtitle(s, "Real problems encountered during the project — and how we solved them", false);
  slideNumber(s, 17, TOTAL);

  const pairs = [
    ["180 GB+ Dataset", "Standard pandas loading crashed RAM", "Chunk-based decompression with 250K-row batches. Parquet intermediate format for O(1) filtered reads.", C.red, C.green],
    ["No Ground-Truth Labels", "Can't measure recall without knowing which rows are anomalous", "Used SLURM distress-status column (down/drained/failing) as proxy labels for evaluation only — not for training.", C.red, C.green],
    ["farm19: 6.7% Recall", "Fixed 99th-percentile threshold completely missed farm19's anomaly", "Analysed train reconstruction error distribution per cluster. Applied adaptive 85th-percentile threshold for farm19.", C.red, C.green],
    ["farm14: Sensor Drift", "Normal data in later days looked anomalous due to gradual drift", "Denoising Autoencoder — inject noise into input, train to reconstruct clean version. Model learns to ignore drift.", C.red, C.green],
  ];

  pairs.forEach(([title, problem, solution, pColor, sColor], i) => {
    const y = 1.6 + i * 1.4;

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 12.5, h: 1.25,
      fill: { color: C.white }, line: { color: C.lightgray, width: 1 },
      shadow: { type: "outer", blur: 4, offset: 1, angle: 135, color: "000000", opacity: 0.08 },
    });
    s.addText(title, {
      x: 0.6, y: y + 0.05, w: 2.8, h: 0.5,
      fontFace: FONT, fontSize: 17, bold: true, color: C.navy,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.5, y: y + 0.1, w: 0.05, h: 1.05,
      fill: { color: C.lightgray }, line: { color: C.lightgray },
    });
    s.addText("Problem: " + problem, {
      x: 3.7, y: y + 0.05, w: 4.0, h: 1.1,
      fontFace: FONT, fontSize: 14, color: pColor, align: "left", valign: "middle",
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 7.8, y: y + 0.1, w: 0.05, h: 1.05,
      fill: { color: C.lightgray }, line: { color: C.lightgray },
    });
    s.addText("Solution: " + solution, {
      x: 8.0, y: y + 0.05, w: 4.7, h: 1.1,
      fontFace: FONT, fontSize: 14, color: sColor, align: "left", valign: "middle",
    });
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 17 — LIVE DEMO
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  darkSlide(s);
  addTitle(s, "Live Demo: Streamlit Dashboard", true);
  addSubtitle(s, "Interactive demonstration of the complete pipeline", true);
  slideNumber(s, 18, TOTAL);

  const demos = [
    ["Results Dashboard", "Recall / Precision / F1 for all 3 models across 5 farms. Precision vs Recall scatter. Latency & robustness charts.", C.cyan],
    ["Time-Series Scores", "Autoencoder reconstruction error per hour from May 19–23. Red band marks the anomalous event. Node-level heatmap of top-30 affected nodes.", C.orange],
    ["Live Anomaly Playground", "Inject synthetic faults in real-time using sliders:\nCPU spike | Memory leak | I/O thrash | Job flood | Sensor noise\nWatch AE and IF respond instantly.", C.green],
  ];

  demos.forEach(([title, desc, color], i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4 + i * 4.3, y: 1.75, w: 4.05, h: 5.25,
      fill: { color: "0A1640" },
      line: { color: color, width: 2.5 },
      shadow: { type: "outer", blur: 10, offset: 3, angle: 135, color: "000000", opacity: 0.35 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4 + i * 4.3, y: 1.75, w: 4.05, h: 0.12,
      fill: { color: color }, line: { color: color },
    });
    s.addText(`Tab ${i + 1}`, {
      x: 0.55 + i * 4.3, y: 1.95, w: 3.8, h: 0.4,
      fontFace: FONT, fontSize: 14, color: color, align: "left",
    });
    s.addText(title, {
      x: 0.55 + i * 4.3, y: 2.35, w: 3.8, h: 0.65,
      fontFace: FONT, fontSize: 20, bold: true, color: C.white, align: "left",
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.55 + i * 4.3, y: 3.05, w: 3.0, h: 0.05,
      fill: { color: color }, line: { color: color },
    });
    s.addText(desc, {
      x: 0.55 + i * 4.3, y: 3.2, w: 3.8, h: 3.6,
      fontFace: FONT, fontSize: 15, color: "B0C4DE", align: "left", valign: "top",
    });
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 18 — NEXT STEPS
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  lightSlide(s);
  addTitle(s, "Next Steps & Future Work", false);
  addSubtitle(s, "Stationarity analysis ✓  →  Final report + presentation", false);
  slideNumber(s, 19, TOTAL);

  const steps = [
    ["Immediate (Current Milestone)", [
      "Finalise model evaluation report",
      "Complete project documentation",
      "Polish and submit final report to Samsung PRISM",
    ], C.cyan],
    ["Near-Term Improvements", [
      "LSTM-Autoencoder for temporal anomaly detection",
      "Streaming pipeline for real-time cluster monitoring",
      "Ensemble voting in production deployment",
    ], C.orange],
    ["Research Directions", [
      "Graph Neural Networks to model inter-node dependencies",
      "Transfer learning across hardware farms",
      "Anomaly explanation with SHAP feature importance",
    ], C.magenta],
  ];

  steps.forEach(([title, items, color], i) => {
    const x = 0.4 + i * 4.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.6, w: 4.1, h: 5.5,
      fill: { color: C.white }, line: { color: color, width: 2 },
      shadow: { type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.1 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.6, w: 4.1, h: 0.1,
      fill: { color: color }, line: { color: color },
    });
    s.addText(title, {
      x: x + 0.2, y: 1.75, w: 3.8, h: 0.65,
      fontFace: FONT, fontSize: 18, bold: true, color: C.navy, align: "left",
    });
    s.addText(items.map(t => "• " + t).join("\n\n"), {
      x: x + 0.2, y: 2.5, w: 3.8, h: 4.4,
      fontFace: FONT, fontSize: 16, color: C.gray, align: "left", valign: "top",
    });
  });
}

// ════════════════════════════════════════════════════════════════════════
//  SLIDE 19 — CONCLUSION
// ════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  darkSlide(s);

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 7.5,
    fill: { color: C.cyan }, line: { color: C.cyan },
  });

  s.addText("What We Built", {
    x: 0.5, y: 0.5, w: 12.3, h: 0.7,
    fontFace: FONT, fontSize: 36, bold: true, color: C.cyan, align: "left",
  });

  s.addText("A fully unsupervised anomaly detection pipeline that:\n\n  • Processes 180 GB+ of raw Prometheus metrics with zero manual labelling\n\n  • Achieves 99–100% recall across all hardware farms with ~0.01 ms inference\n\n  • Introduces three novel adaptations: Denoising AE, Adaptive Thresholds, PCA+LOF\n\n  • Combines memory and SLURM modalities into 634 per-node features\n\n  • Runs as a live interactive demo — Results, Time-Series, and Fault Playground", {
    x: 0.5, y: 1.35, w: 9.5, h: 4.8,
    fontFace: FONT, fontSize: 19, color: C.white, align: "left", valign: "top",
  });

  // Right summary box
  s.addShape(pres.shapes.RECTANGLE, {
    x: 10.2, y: 0.4, w: 2.8, h: 6.7,
    fill: { color: "0A1640" },
    line: { color: C.cyan, width: 2 },
  });
  [
    ["99–100%", "Recall", C.green],
    ["~0.01ms", "Latency", C.cyan],
    ["634", "Features", C.orange],
    ["3+1", "Models\n+Ensemble", C.magenta],
    ["180 GB+", "Processed", C.cyan],
  ].forEach(([num, label, color], i) => {
    s.addText(num, {
      x: 10.3, y: 0.55 + i * 1.3, w: 2.6, h: 0.7,
      fontFace: FONT, fontSize: 24, bold: true, color: color, align: "center",
    });
    s.addText(label, {
      x: 10.3, y: 1.2 + i * 1.3, w: 2.6, h: 0.4,
      fontFace: FONT, fontSize: 13, color: "90CAF9", align: "center",
    });
  });

  s.addText("CrossLayerAI-RAN  |  Samsung PRISM  |  B.M.S. College of Engineering  |  2025–26", {
    x: 0.5, y: 6.8, w: 9.5, h: 0.4,
    fontFace: FONT, fontSize: 13, color: "607DAA", align: "left",
  });
}

// ── Write file ────────────────────────────────────────────────────────────────
const outPath = "C:/Users/admin/Documents/CrossLayer-RAN-Samsung-Prism--master/Samsung_PRISM_CrossLayerAI_RAN.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("Saved: " + outPath);
}).catch(err => {
  console.error("Error:", err);
});
