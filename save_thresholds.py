"""
save_thresholds.py
==================
Compute and persist per-cluster AE anomaly thresholds using the
ALREADY-TRAINED models + existing joined_train_features.parquet.

Run this ONCE after training to generate artifacts/models/thresholds.json.
The demo Playground loads this file to use the real trained threshold instead
of the hardcoded 5× severity heuristic.

Usage:
    python save_thresholds.py
    python save_thresholds.py --models-dir D:/CrossLayer-RAN-Samsung-Prism--master/artifacts/models
"""
from __future__ import annotations

import argparse
import json
import joblib
import numpy as np
import pandas as pd
from pathlib import Path

# Percentile used per cluster during training (must match multimodel_anomaly.py)
CLUSTER_THRESHOLD_PCT: dict[str, int] = {
    "farm14": 99,
    "farm16": 99,
    "farm18": 99,
    "farm19": 85,
    "farm23": 99,
}

META_COLS = {"node", "timestamp", "hw_config", "is_distress_status", "status", "job"}


def compute_thresholds(models_dir: Path, features_dir: Path) -> dict:
    train_path = features_dir / "joined_train_features.parquet"
    if not train_path.exists():
        raise FileNotFoundError(f"Training features not found: {train_path}")

    print(f"Loading training features from {train_path} ...")
    train_df = pd.read_parquet(train_path)
    print(f"  {len(train_df):,} rows · {train_df['hw_config'].value_counts().to_dict()}")

    thresholds = {}

    for hw, pct in CLUSTER_THRESHOLD_PCT.items():
        hw_df = train_df[train_df["hw_config"] == hw]
        if hw_df.empty:
            print(f"[{hw}] SKIP — no training rows")
            continue

        ae_path  = models_dir / f"autoencoder_{hw}.joblib"
        sc_path  = models_dir / f"scaler_{hw}.joblib"
        if not ae_path.exists() or not sc_path.exists():
            print(f"[{hw}] SKIP — model files not found in {models_dir}")
            continue

        feat_cols = [c for c in hw_df.columns if c not in META_COLS]
        X_train = hw_df[feat_cols].values

        print(f"[{hw}] Loading scaler + AE ...")
        scaler = joblib.load(sc_path)
        ae     = joblib.load(ae_path)

        X_scaled = scaler.transform(X_train)
        preds    = ae.predict(X_scaled)
        errors   = np.mean(np.square(X_scaled - preds), axis=1)

        threshold = float(np.percentile(errors, pct))
        thresholds[hw] = {
            "percentile":       pct,
            "threshold":        threshold,
            "train_mean_error": float(np.mean(errors)),
            "train_std_error":  float(np.std(errors)),
            "train_rows":       int(len(errors)),
        }
        print(
            f"[{hw}] {pct}th pct threshold = {threshold:.6f}  "
            f"(mean={np.mean(errors):.6f}  std={np.std(errors):.6f})"
        )

    return thresholds


def main() -> None:
    ap = argparse.ArgumentParser(description="Compute and save AE thresholds from existing models.")
    ap.add_argument(
        "--models-dir", type=Path,
        default=None,
        help="Path to artifacts/models directory. Auto-detected if not set."
    )
    ap.add_argument(
        "--features-dir", type=Path,
        default=Path("artifacts/features"),
        help="Path to artifacts/features directory."
    )
    args = ap.parse_args()

    # Auto-detect models directory (D:/ original training location → local fallback)
    if args.models_dir is None:
        d_drive = Path("D:/CrossLayer-RAN-Samsung-Prism--master/artifacts/models")
        local   = Path(__file__).parent / "artifacts" / "models"
        args.models_dir = d_drive if d_drive.exists() else local

    print(f"Models dir  : {args.models_dir}")
    print(f"Features dir: {args.features_dir}")

    thresholds = compute_thresholds(args.models_dir, args.features_dir)

    if not thresholds:
        print("\nNo thresholds computed — check that model .joblib files are present.")
        return

    out_path = args.models_dir / "thresholds.json"
    with open(out_path, "w") as f:
        json.dump(thresholds, f, indent=2)

    print(f"\nSaved {len(thresholds)} cluster thresholds -> {out_path}")
    for hw, t in thresholds.items():
        print(f"  {hw}: {t['percentile']}th pct = {t['threshold']:.6f}")


if __name__ == "__main__":
    main()
