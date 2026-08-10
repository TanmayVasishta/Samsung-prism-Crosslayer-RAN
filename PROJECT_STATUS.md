# 📡 CrossLayerAI-RAN — Project Status Report

**Project:** 26NCOAM02BMS — Cross-Layer AI-RAN Infrastructure-Aware AI for Proactive RAN  
**Program:** SRIB-PRISM (Samsung Research Institute Bangalore)  
**Last Updated:** August 10, 2026  
**Live Demo:** [🔗 GitHub Pages Dashboard](https://tanmayvasishta.github.io/CrossLayer-RAN-Samsung-Prism-/)

---

## 1. Project Overview

Cross-layer, infrastructure-aware AI for proactive RAN/HPC anomaly detection. An **unsupervised multi-model pipeline** trained on Jefferson Lab (JLab) HPC telemetry data (CPU, Memory, Disk, SLURM) to detect hardware distress events **without ground-truth labels**.

### Key Facts

| Item | Detail |
|------|--------|
| **Dataset** | 180 GB+ JLab Prometheus-style HPC metrics (May 19–23, 2023) |
| **Modalities** | CPU, Memory, Disk, SLURM (4 telemetry sources) |
| **Hardware Clusters** | 5 farms: farm14, farm16, farm18, farm19, farm23 |
| **Real Anomaly Event** | May 23, 2023 — JLab IT-confirmed hardware distress |
| **Approach** | Fully unsupervised (no labels) |
| **Models** | Isolation Forest, LOF (with PCA), Autoencoder (MLP), Ensemble (2/3 vote) |
| **Best Result** | 100% recall on farm18 (Autoencoder), 96.1% on farm19 (CPU IF) |

---

## 2. Pipeline Architecture

```
Raw .csv.gz  →  Structural Clean  →  Chronological Split  →  Train Stats  →  Apply Stats
    ↓                                      ↓                      ↓
 EDA Report                         Feature Engineering     Stationarity
                                           ↓               (ADF + ACF/PACF)
                                    Multimodal Join
                                           ↓
                                   Multimodel Training
                                  (IF + LOF + AE + Ensemble)
                                           ↓
                                    Evaluation & Demo
```

### Pipeline Phases — All ✅ Complete

| Phase | Module | Description | Status |
|-------|--------|-------------|--------|
| 1 | `eda/clean.py` | Chunk-safe structural cleaning (drop junk cols, parse timestamps, dedup) | ✅ Complete |
| 2 | `eda/build_eda.py` | Dark-themed HTML report with summary tables, distributions, outlier rates | ✅ Complete |
| 3 | `eda/make_splits.py` | Binary chronological split: Train=May 19-22 (normal), Test=May 23 (anomalous) | ✅ Complete |
| 4 | `eda/compute_train_stats.py` | IQR bounds + mean/std computed on train-only data (no leakage) | ✅ Complete |
| 5 | `eda/apply_stats.py` | Enrich data with `is_outlier` flag + `value_norm` using train-derived stats | ✅ Complete |
| 6 | `eda/ts_analysis.py` | ADF stationarity test + ACF/PACF autocorrelation analysis | ✅ Complete |
| 7 | `eda/stationarity.py` | Extended stationarity analysis with detailed results | ✅ Complete |
| 8 | `eda/feature_eng.py` | Rolling window features (5/15/60min) + lag diffs (memory), ratio + status encoding (SLURM) | ✅ Complete |
| 9 | `eda/multimodal_join.py` | Join memory + SLURM features on (node, timestamp) | ✅ Complete |
| 10 | `eda/multimodel_anomaly.py` | Train IF + LOF(PCA) + AE + Ensemble per hw_config cluster | ✅ Complete |
| 11 | `models/train_baseline.py` | Alternative baseline training (IF + AE per modality) | ✅ Complete |
| 12 | `eda/cpu_pipeline.py` | Standalone CPU modality pipeline (clean → split → feat → train → eval) | ✅ Complete |
| 13 | `eda/disk_pipeline.py` | Standalone Disk modality pipeline | ✅ Complete |
| 14 | `demo_app.py` | 3-tab Streamlit demo (Dashboard, Time-Series Scores, Live Playground) | ✅ Complete |
| 15 | `demo/` | Static HTML/JS/CSS dashboard with Chart.js visualizations | ✅ Complete |
| 16 | `tests/` | Unit tests — synthetic + real data cleaning validation | ✅ Complete |

---

## 3. Data Split Design

> **Critical design decision:** The split is purpose-built for unsupervised anomaly detection.

```
TRAIN : May 19 00:00 → May 22 23:59  (normal cluster behaviour ONLY)
TEST  : May 23 00:00 → May 23 23:59  (real anomalous JLab event)
VAL   : NONE — unsupervised pipeline, no labels exist
```

### Per-Modality Split Summary

| Modality | Train Rows | Test Rows | Resample | Overlap-Free |
|----------|-----------|-----------|----------|-------------|
| memory_data | 1,827,271 (82.9%) | 377,660 (17.1%) | 1min | ✅ |
| slurm_data | 3,709,122 (83.1%) | 754,232 (16.9%) | None (event-driven) | ✅ |
| cpu_data | 5,976 | 0 rows | 5min | N/A — collection gap |
| disk_data | 190,643 | 0 rows | 5min | N/A — collection gap |

### Known Data Limitation

`cpu_data` and `disk_data` have **zero May 23 coverage** due to a Prometheus scraper gap (84% temporal gap). The CPU and Disk pipelines process and train models but use **cross-referenced distress labels from SLURM** for indirect evaluation.

---

## 4. Model Results (v6 — Unified 3-Modality)

### Memory + SLURM (Primary — Best Coverage)

| Farm | Model | Test Rows | Distress Rows | Caught | Recall | Precision | F1 |
|------|-------|-----------|---------------|--------|--------|-----------|----|
| farm14 | Autoencoder | 89,916 | 505 | 395 | 78.2% | 6.85% | 12.6% |
| farm14 | Ensemble | 89,916 | 505 | 351 | 69.5% | 7.10% | 12.9% |
| farm16 | Autoencoder | 43,184 | 699 | 661 | 94.6% | 7.54% | 14.0% |
| farm16 | Ensemble | 43,184 | 699 | 656 | 93.8% | 8.85% | 16.2% |
| farm18 | Autoencoder | 94,620 | 43 | 43 | **100.0%** | 0.94% | 1.86% |
| farm19 | LOF | 121,632 | 824 | 759 | 92.1% | 0.79% | 1.56% |
| farm23 | — | 28,500 | 0 | — | N/A | — | — |

### CPU (Cross-Referenced with SLURM Distress)

| Farm | Best Model | Recall | Precision |
|------|-----------|--------|-----------|
| farm14 | Autoencoder | 43.9% | 2.14% |
| farm16 | Autoencoder | 76.3% | 7.22% |
| farm18 | IF | 38.1% | 0.12% |
| farm19 | **IF** | **96.1%** | 7.76% |

### Disk (Cross-Referenced with SLURM Distress)

| Farm | Best Model | Recall | Precision |
|------|-----------|--------|-----------|
| farm14 | IF/Ensemble | 39.0% | 5.67% |
| farm16 | Autoencoder | 75.6% | 8.92% |
| farm18 | IF/Ensemble | 45.2% | 0.20% |
| farm19 | IF/Ensemble | 0.73% | 0.13% |

### Key Observations

1. **Autoencoder is the best model overall** — highest recall across most farms
2. **LOF excels on farm19** (memory+slurm) — capturing 92% of distress events
3. **Precision is universally low** — expected in unsupervised anomaly detection with no labels
4. **Ensemble provides the best precision-recall balance** — majority vote (≥2/3) reduces false positives
5. **farm23 has zero distress events** — no anomalous behaviour in the test window
6. **Latency is excellent** — sub-millisecond per row for all models (real-time capable)
7. **Robust recall matches standard recall** — models are stable under Gaussian noise injection

---

## 5. Artifacts Generated

### Reports & Documentation
- `reports/eda_report.html` — Comprehensive dark-themed EDA report
- `reports/guide_presentation.html` — Self-contained guide presentation
- `project_overview.html` — Full project tour for teammates
- `Samsung_PRISM_CrossLayerAI_RAN_v2.pptx` — PowerPoint presentation

### Model Artifacts (per farm × modality)
- `artifacts/models/*.joblib` — 89 trained model files (AE, IF, LOF, PCA, Scaler)
- `artifacts/models/thresholds.json` — Per-cluster AE anomaly thresholds
- `artifacts/models/multimodel_results_v6.json` — Unified 3-modality results
- `artifacts/models/evaluation_report_metrics_v6.json` — Detailed evaluation metrics
- `artifacts/models/anomaly_scores_*.parquet` — Per-row anomaly scores with timestamps

### Data Artifacts
- `artifacts/splits/*.parquet` — Train/test split data files
- `artifacts/splits/split_manifest.json` — Full split provenance
- `artifacts/eda/train_stats.json` — Train-only IQR + normalization stats
- `artifacts/eda/summary.json` — EDA scan summary
- `artifacts/eda/stationarity.json` — ADF + ACF/PACF results
- `artifacts/features/feature_manifest.json` — Feature engineering manifest

---

## 6. How to Reproduce

```bash
# 1. Setup
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt

# 2. Structural Cleaning
python -m eda.clean --all-folders --dataset-dir dataset --out-dir structural_clean

# 3. Chronological Splitting
python -m eda.make_splits --clean-dir structural_clean --out-dir artifacts/splits

# 4. Train-Only Statistics
python -m eda.compute_train_stats --clean-dir structural_clean --out artifacts/eda/train_stats.json

# 5. Apply Statistics (enrich with is_outlier + value_norm)
python -m eda.apply_stats --splits-dir artifacts/splits --stats artifacts/eda/train_stats.json

# 6. EDA HTML Report
python -m eda.build_eda --dataset-dir dataset

# 7. Time-Series Analysis
python -m eda.ts_analysis --clean-dir structural_clean

# 8. Feature Engineering
python -m eda.feature_eng --splits-dir artifacts/splits --out-dir artifacts/features

# 9. Multimodal Join
python -m eda.multimodal_join --features-dir artifacts/features

# 10. Multimodel Anomaly Detection
python -m eda.multimodel_anomaly --features-dir artifacts/features --out-dir artifacts/models

# 11. Run Demo
streamlit run demo_app.py
```

---

## 7. Potential Improvements

### 🔴 High Priority

1. **Improve Precision (reduce false positives)**
   - Current precision is 1-9% across most models — too many false alarms for production
   - Solutions: threshold tuning per farm, adaptive contamination rates, temporal smoothing (flag only if anomaly persists for N consecutive windows)

2. **Temporal Anomaly Models (LSTM-AE / Transformer)**
   - Current models treat each row independently — no temporal context
   - An LSTM Autoencoder or Transformer-based approach could capture temporal patterns
   - Expected to significantly improve precision by understanding "what's normal over time"

3. **Multivariate Anomaly Detection**
   - Currently models are per-modality; a true cross-layer model could jointly analyze CPU + Memory + Disk + SLURM
   - This is the core "cross-layer" thesis of the project

### 🟡 Medium Priority

4. **Hyperparameter Optimization**
   - IF contamination, AE architecture depth, LOF n_neighbors are currently fixed
   - A systematic sweep (even without labels — using silhouette-based or reconstruction-error-based selection) could improve results

5. **Sliding Window Anomaly Scoring**
   - Instead of scoring individual points, score sliding windows (e.g., 5-minute or 15-minute)
   - Would capture "sustained anomalies" vs. transient spikes

6. **Node-Level Aggregation**
   - Current models flag individual rows — aggregating to "anomalous nodes" would be more actionable
   - A node should be flagged if >X% of its rows in a time window are anomalous

7. **Online / Streaming Inference**
   - Package the trained models into a real-time inference API (Flask/FastAPI)
   - Could ingest live Prometheus metrics and flag anomalies in real-time

### 🟢 Nice to Have

8. **Explainability (SHAP / Feature Attribution)**
   - For each flagged anomaly, show which features contributed most
   - Critical for operational adoption — operators need to know "what failed"

9. **Drift Detection**
   - Monitor for model degradation over time (data distribution shift)
   - Alert when retraining is needed

10. **Anomaly Severity Scoring**
    - Instead of binary flag, provide a severity score (0-1)
    - Based on reconstruction error magnitude relative to threshold

11. **Evaluation on Additional Real Events**
    - Current evaluation is on a single 24-hour anomalous event (May 23)
    - Validation on additional anomaly events would strengthen confidence

12. **Docker Containerization**
    - Package the entire pipeline (data processing + model training + demo) into a Docker image
    - Ensures reproducibility across environments

---

## 8. Repository Structure

```
CrossLayer-RAN-Samsung-Prism--master/
├── dataset/                     # Raw JLab HPC telemetry (180GB+, gitignored)
├── structural_clean/            # Cleaned parquets (gitignored, reproducible)
├── artifacts/
│   ├── eda/                     # EDA summaries, train stats, stationarity
│   ├── features/                # Feature matrices (parquets)
│   ├── models/                  # Trained models (.joblib) + results (JSON)
│   ├── scores/                  # Anomaly score outputs
│   └── splits/                  # Train/test split parquets + manifests
├── demo/                        # Static HTML dashboard (deployed to GitHub Pages)
│   ├── index.html
│   ├── app.js
│   └── style.css
├── eda/                         # Core pipeline modules
│   ├── clean.py                 # Phase 1: Structural cleaning
│   ├── build_eda.py             # Phase 2: EDA report generation
│   ├── make_splits.py           # Phase 3: Chronological splitting
│   ├── compute_train_stats.py   # Phase 4: Train-only statistics
│   ├── apply_stats.py           # Phase 5: Apply statistics globally
│   ├── ts_analysis.py           # Phase 6: Time-series analysis
│   ├── stationarity.py          # ADF/ACF/PACF stationarity analysis
│   ├── feature_eng.py           # Phase 7: Feature engineering
│   ├── multimodal_join.py       # Phase 8: Multimodal join
│   ├── multimodel_anomaly.py    # Phase 9: Multimodel training
│   ├── cpu_pipeline.py          # Standalone CPU pipeline
│   ├── disk_pipeline.py         # Standalone Disk pipeline
│   └── lib.py                   # Shared utilities
├── models/
│   ├── autoencoder.py           # Shared ReconAE class
│   └── train_baseline.py        # IF + AE baseline training
├── tests/
│   └── test_clean_and_lib.py    # Unit tests
├── reports/
│   ├── eda_report.html          # EDA HTML report
│   └── guide_presentation.html  # Guide presentation
├── demo_app.py                  # Streamlit 3-tab demo application
├── project_overview.html        # Full project overview HTML
├── requirements.txt             # Python dependencies
├── PROJECT_STATUS.md            # This document
└── README.md                    # Setup + usage instructions
```

---

## 9. Dependencies

```
pandas>=2.2        numpy>=2.0         pyarrow>=15.0
plotly>=5.20        streamlit>=1.32    jinja2>=3.1
tqdm>=4.66          scikit-learn>=1.4  statsmodels>=0.14
matplotlib>=3.8
```

---

*Generated: August 10, 2026*
