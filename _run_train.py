"""Thin wrapper that runs v4 training with stdout flushed to disk."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Force unbuffered stdout so the log file fills in real time
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

sys.argv = [
    "multimodel_anomaly",
    "--features-dir", r"D:\CrossLayer-RAN-Samsung-Prism--master\artifacts\features",
    "--out-dir",      r"D:\CrossLayer-RAN-Samsung-Prism--master\artifacts\models",
]
from eda.multimodel_anomaly import main
main()
