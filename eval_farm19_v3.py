import joblib
import json
import time
from pathlib import Path
import numpy as np
import pandas as pd

def safe_div(n: float, d: float) -> float:
    return float(n / d) if d > 0 else 0.0

def main():
    print("Loading existing JSON results...")
    models_dir = Path("artifacts/models")
    
    with open(models_dir / "multimodel_results_v2.json", "r") as f:
        res_v3 = json.load(f)
        
    with open(models_dir / "evaluation_report_metrics_v2.json", "r") as f:
        met_v3 = json.load(f)
        
    print("Loading feature parquets for farm19...")
    features_dir = Path("artifacts/features")
    train_df = pd.read_parquet(features_dir / "joined_train_features.parquet")
    test_df = pd.read_parquet(features_dir / "joined_test_features.parquet")
    
    hw_train = train_df[train_df["hw_config"] == "farm19"].copy()
    hw_test = test_df[test_df["hw_config"] == "farm19"].copy()
    
    meta_cols = ["node", "timestamp", "hw_config", "is_distress_status", "status", "job"]
    feat_cols = [c for c in hw_train.columns if c not in meta_cols]
    
    X_train = hw_train[feat_cols]
    for c in feat_cols:
        if c not in hw_test.columns:
            hw_test[c] = 0.0
    X_test = hw_test[feat_cols]
    
    print("Loading scaler and scaling data...")
    scaler = joblib.load(models_dir / "scaler_farm19.joblib")
    X_train_scaled = scaler.transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("Loading pre-trained Autoencoder...")
    ae = joblib.load(models_dir / "autoencoder_farm19.joblib")
    
    print("Running inference...")
    t0 = time.time()
    train_preds = ae.predict(X_train_scaled)
    test_preds = ae.predict(X_test_scaled)
    t1 = time.time()
    
    train_err = np.mean(np.square(X_train_scaled - train_preds), axis=1)
    test_err = np.mean(np.square(X_test_scaled - test_preds), axis=1)
    
    print("Applying new 85th percentile threshold...")
    threshold = np.percentile(train_err, 85)
    
    distress_mask = hw_test["is_distress_status"] == 1
    total_distress = int(distress_mask.sum())
    
    ae_anomalies = int((test_err > threshold).sum())
    ae_caught = int((test_err[distress_mask] > threshold).sum())
    
    # Update JSON Data
    res_v3["farm19"]["models"]["Autoencoder"]["test_anomalies"] = ae_anomalies
    res_v3["farm19"]["models"]["Autoencoder"]["caught_distress"] = ae_caught
    
    tp = ae_caught
    fp = ae_anomalies - ae_caught
    fn = total_distress - ae_caught
    precision = safe_div(tp, tp + fp)
    recall = safe_div(tp, tp + fn)
    f1 = safe_div(2 * precision * recall, precision + recall)
    latency = ((t1 - t0) * 1000) / len(X_test_scaled)
    
    # Robustness (not officially requested to rerun, but keeping consistency)
    # We will compute it using the new threshold
    noise_std = 0.01
    X_test_noisy = X_test_scaled + np.random.normal(0, noise_std, X_test_scaled.shape)
    test_preds_noisy = ae.predict(X_test_noisy)
    test_err_noisy = np.mean(np.square(X_test_noisy - test_preds_noisy), axis=1)
    ae_robust_caught = int((test_err_noisy[distress_mask] > threshold).sum())
    ae_robust_recall = safe_div(ae_robust_caught, total_distress)
    
    met_v3["farm19"]["Autoencoder"]["precision"] = precision
    met_v3["farm19"]["Autoencoder"]["recall"] = recall
    met_v3["farm19"]["Autoencoder"]["f1_score"] = f1
    met_v3["farm19"]["Autoencoder"]["latency_ms_per_row"] = latency
    met_v3["farm19"]["Autoencoder"]["robust_recall"] = ae_robust_recall
    
    print(f"\n--- Results for farm19 (85th Percentile) ---")
    print(f"Recall: {recall:.4f} ({ae_caught}/{total_distress} caught)")
    print(f"Total Anomalies Flagged: {ae_anomalies}")
    print(f"Precision: {precision:.4f}")
    
    with open(models_dir / "multimodel_results_v3.json", "w") as f:
        json.dump(res_v3, f, indent=2)
        
    with open(models_dir / "evaluation_report_metrics_v3.json", "w") as f:
        json.dump(met_v3, f, indent=2)
        
    print("\nSaved updated results to _v3.json files without modifying originals.")

if __name__ == '__main__':
    main()
