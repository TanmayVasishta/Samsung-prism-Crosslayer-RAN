# 26NCOAM02BMS_CrossLayerAI-RAN_Infrastructure-Aware_AI_for_Proactive_RAN

**SRIB-PRISM Program**

Cross-layer, infrastructure-aware AI for proactive RAN / HPC anomaly detection.
Unsupervised multi-model pipeline trained on Jefferson Lab HPC telemetry
(CPU, memory, disk, SLURM) to detect hardware distress events without
ground-truth labels.

> 📊 **[Live Demo Dashboard](https://tanmayvasishta.github.io/CrossLayer-RAN-Samsung-Prism-/)** — interactive visualization of all model results
>
> 📋 **[Full Project Status & Improvements](PROJECT_STATUS.md)** — comprehensive status report, results, and potential improvements
>
> 🏗️ See [`project_overview.html`](project_overview.html) for a full project tour
> aimed at teammates (problem, dataset, pipeline, models, results).

---

## Pipeline Overview

| Phase | Module | Description |
|-------|--------|-------------|
| 1 | `eda/clean.py` | Structural cleaning (drop junk cols, parse timestamps, dedup) |
| 2 | `eda/build_eda.py` | HTML EDA report with data quality analysis |
| 3 | `eda/make_splits.py` | Chronological split: Train=May 19-22, Test=May 23 |
| 4 | `eda/compute_train_stats.py` | Train-only IQR + normalization stats |
| 5 | `eda/apply_stats.py` | Enrich data with `is_outlier` + `value_norm` |
| 6 | `eda/ts_analysis.py` | ADF stationarity + ACF/PACF analysis |
| 7 | `eda/feature_eng.py` | Rolling windows + lag diffs + status encoding |
| 8 | `eda/multimodal_join.py` | Memory + SLURM multimodal join |
| 9 | `eda/multimodel_anomaly.py` | IF + LOF + AE + Ensemble per hw_config |

## Setup

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

## Step 1: Build EDA artifacts + HTML report

This scans the dataset and writes:

- `artifacts/eda/summary.json`
- `reports/eda_report.html`

```bash
python -m eda.build_eda --dataset-dir dataset
```

Optional knobs (useful because the dataset is huge):

```bash
python -m eda.build_eda --dataset-dir dataset --max-files-per-folder 10 --sample-rows 200000
```

## Step 2: Run the local EDA website

```bash
streamlit run eda/eda_app.py
```

## Step 3: Data preparation + time-based splitting

Once you're happy with EDA, generate:

- a normalized, aligned time series table per node (common granularity)
- train/test splits with **time leakage protection**

```bash
python -m eda.clean --all-folders --dataset-dir dataset --out-dir structural_clean
python -m eda.make_splits --clean-dir structural_clean --out-dir artifacts/splits
python -m eda.compute_train_stats --clean-dir structural_clean --out artifacts/eda/train_stats.json
python -m eda.apply_stats --splits-dir artifacts/splits --stats artifacts/eda/train_stats.json
```

## Step 4: Feature engineering + multimodel anomaly detection

Train Isolation Forest + LOF (with PCA) + Autoencoder + Ensemble per farm:

```bash
python -m eda.feature_eng --splits-dir artifacts/splits --out-dir artifacts/features
python -m eda.multimodal_join --features-dir artifacts/features
python -m eda.multimodel_anomaly --features-dir artifacts/features --out-dir artifacts/models
```

## Step 5: Demo

3-tab Streamlit demo (Results / Time-Series Scores / Live Anomaly Playground):

```bash
streamlit run demo_app.py
```

## Key Results (v6 — Unified 3-Modality)

| Farm | Best Model | Recall | Modality |
|------|-----------|--------|----------|
| farm16 | Autoencoder | **94.6%** | Memory+SLURM |
| farm18 | Autoencoder | **100.0%** | Memory+SLURM |
| farm19 | IF (CPU) | **96.1%** | CPU |
| farm14 | Autoencoder | 78.2% | Memory+SLURM |

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for the full results table and potential improvements.
