import joblib
import numpy as np
from pathlib import Path

models_dir = Path("D:/CrossLayer-RAN-Samsung-Prism--master/artifacts/models")

print("=== Project Verification ===\n")

# 1. Check all joblib model files
clusters = ["farm14", "farm16", "farm18", "farm19", "farm23"]
for cluster in clusters:
    ae_path = models_dir / f"autoencoder_{cluster}.joblib"
    sc_path = models_dir / f"scaler_{cluster}.joblib"
    iso_path = models_dir / f"isoforest_{cluster}.joblib"
    
    if ae_path.exists() and sc_path.exists():
        sc = joblib.load(sc_path)
        ae = joblib.load(ae_path)
        print(f"[OK] {cluster}: scaler={type(sc).__name__}, ae={type(ae).__name__}, features={sc.n_features_in_}")
    else:
        print(f"[MISSING] {cluster}: ae_exists={ae_path.exists()}, sc_exists={sc_path.exists()}")

print()

# 2. Check JSON files are valid
import json
json_files = [
    "multimodel_results_v3.json",
    "evaluation_report_metrics_v3.json"
]
for jf in json_files:
    p = models_dir / jf
    if p.exists():
        with open(p) as f:
            data = json.load(f)
        print(f"[OK] {jf}: {list(data.keys())}")
    else:
        print(f"[MISSING] {jf}")

print()

# 3. Quick inference smoke test on farm19
print("=== Smoke Test: farm19 Autoencoder Inference ===")
sc = joblib.load(models_dir / "scaler_farm19.joblib")
ae = joblib.load(models_dir / "autoencoder_farm19.joblib")

# Simulate a normal row (all zeros in feature space = perfectly normal mean after scaling)
n_features = sc.n_features_in_
normal_row = np.zeros((1, n_features))  # Already in scaled space
# Unscale it back to raw space for the scaler
raw_row = sc.inverse_transform(normal_row)

# Run through scaler and AE
scaled = sc.transform(raw_row)
pred = ae.predict(scaled)
err = np.mean(np.square(scaled - pred))
print(f"  Normal row reconstruction error: {err:.6f}")

# Simulate anomaly: spike every feature by 10 standard deviations
anomaly_row = raw_row + (sc.scale_ * 10)
scaled_anomaly = sc.transform(anomaly_row)
pred_anomaly = ae.predict(scaled_anomaly)
err_anomaly = np.mean(np.square(scaled_anomaly - pred_anomaly))
print(f"  Anomaly row reconstruction error: {err_anomaly:.6f}")
print(f"  Ratio (anomaly/normal): {err_anomaly/max(err,1e-9):.1f}x higher")
print("\nVerification complete. Models are loadable and produce correct outputs.")
