"""
generate_scores.py
==================
Generate per-row anomaly scores from EXISTING trained models + test features.
Outputs: artifacts/models/anomaly_scores_{cluster}.parquet  (one per farm)

These parquets power the Time-Series Scores tab in demo_app.py.

Usage:
    python generate_scores.py
    python generate_scores.py --models-dir D:/CrossLayer-RAN-Samsung-Prism--master/artifacts/models
"""
from __future__ import annotations

import argparse
import json
import joblib
import warnings
import numpy as np
import pandas as pd
from pathlib import Path

warnings.filterwarnings("ignore", category=UserWarning)

META_COLS = {"node", "timestamp", "hw_config", "is_distress_status", "status", "job"}

CLUSTER_THRESHOLD_PCT: dict[str, int] = {
    "farm14": 99, "farm16": 99, "farm18": 99, "farm19": 85, "farm23": 99,
}


def main() -> None:
    ap = argparse.ArgumentParser(description="Generate per-row anomaly score parquets.")
    ap.add_argument("--models-dir",   type=Path, default=None)
    ap.add_argument("--features-dir", type=Path, default=None)
    args = ap.parse_args()

    # Auto-detect dirs
    d_models   = Path("D:/CrossLayer-RAN-Samsung-Prism--master/artifacts/models")
    d_features = Path("D:/CrossLayer-RAN-Samsung-Prism--master/artifacts/features")
    local_models   = Path(__file__).parent / "artifacts" / "models"
    local_features = Path(__file__).parent / "artifacts" / "features"

    models_dir   = args.models_dir   or (d_models   if d_models.exists()   else local_models)
    features_dir = args.features_dir or (d_features if d_features.exists() else local_features)

    print(f"Models dir  : {models_dir}")
    print(f"Features dir: {features_dir}")

    # Load thresholds
    thr_path = models_dir / "thresholds.json"
    if thr_path.exists():
        with open(thr_path) as f:
            thresholds = json.load(f)
        print(f"Loaded thresholds for: {list(thresholds.keys())}")
    else:
        thresholds = {}
        print("Warning: thresholds.json not found — using percentile defaults")

    # Load test features
    test_path = features_dir / "joined_test_features.parquet"
    if not test_path.exists():
        print(f"Error: {test_path} not found. Run feature engineering first.")
        return

    print(f"\nLoading test features from {test_path} ...")
    test_df = pd.read_parquet(test_path)
    print(f"  {len(test_df):,} rows · hw_configs: {test_df['hw_config'].value_counts().to_dict()}")

    # Also load train features (needed for threshold computation fallback)
    train_path = features_dir / "joined_train_features.parquet"
    train_df   = pd.read_parquet(train_path) if train_path.exists() else None

    saved = []
    for hw in test_df["hw_config"].unique():
        print(f"\n[{hw}] Generating scores ...")

        sc_path  = models_dir / f"scaler_{hw}.joblib"
        ae_path  = models_dir / f"autoencoder_{hw}.joblib"
        iso_path = models_dir / f"isoforest_{hw}.joblib"

        if not sc_path.exists() or not ae_path.exists():
            print(f"  SKIP — model files not found")
            continue

        scaler = joblib.load(sc_path)
        ae     = joblib.load(ae_path)
        iso    = joblib.load(iso_path) if iso_path.exists() else None

        hw_test  = test_df[test_df["hw_config"] == hw].copy()
        feat_cols = [c for c in hw_test.columns if c not in META_COLS]

        X_test = hw_test[feat_cols].values
        X_scaled = scaler.transform(X_test)

        # AE scores
        test_preds = ae.predict(X_scaled)
        ae_scores  = np.mean(np.square(X_scaled - test_preds), axis=1)

        # Threshold
        if hw in thresholds:
            threshold = thresholds[hw]["threshold"]
        elif train_df is not None:
            hw_train  = train_df[train_df["hw_config"] == hw]
            X_train   = hw_train[[c for c in hw_train.columns if c not in META_COLS]].values
            X_tr_sc   = scaler.transform(X_train)
            tr_preds  = ae.predict(X_tr_sc)
            tr_err    = np.mean(np.square(X_tr_sc - tr_preds), axis=1)
            pct       = CLUSTER_THRESHOLD_PCT.get(hw, 99)
            threshold = float(np.percentile(tr_err, pct))
            print(f"  Computed {pct}th-pct threshold = {threshold:.6f}")
        else:
            threshold = float(np.mean(ae_scores) + 3 * np.std(ae_scores))
            print(f"  Using 3-sigma threshold = {threshold:.6f}")

        ae_flags = (ae_scores > threshold).astype(int)

        # ISO scores
        iso_flags  = np.zeros(len(X_scaled), dtype=int)
        iso_scores = np.zeros(len(X_scaled), dtype=float)
        if iso is not None:
            iso_raw    = iso.predict(X_scaled)
            iso_flags  = (iso_raw == -1).astype(int)
            iso_scores = -iso.score_samples(X_scaled)  # higher = more anomalous

        # Build output dataframe
        out_cols = {"node": "node", "timestamp": "timestamp", "hw_config": "hw_config"}
        score_df = hw_test[[c for c in out_cols if c in hw_test.columns]].copy().reset_index(drop=True)
        score_df["ae_score"]  = ae_scores
        score_df["ae_flag"]   = ae_flags
        score_df["iso_score"] = iso_scores
        score_df["iso_flag"]  = iso_flags
        if "is_distress_status" in hw_test.columns:
            score_df["is_distress_status"] = hw_test["is_distress_status"].values

        out_path = models_dir / f"anomaly_scores_{hw}.parquet"
        score_df.to_parquet(out_path, index=False, compression="snappy")
        print(f"  Saved {len(score_df):,} rows -> {out_path.name}")
        print(f"  AE flagged: {ae_flags.sum():,}  |  ISO flagged: {iso_flags.sum():,}")
        saved.append(hw)

    print(f"\nDone. Score files saved for: {saved}")


if __name__ == "__main__":
    main()
