import pandas as pd
import numpy as np
import time
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler

print('Loading farm19 data...')
train_df = pd.read_parquet('artifacts/features/joined_train_features.parquet')
test_df = pd.read_parquet('artifacts/features/joined_test_features.parquet')

train_df = train_df[train_df['hw_config'] == 'farm19']
test_df = test_df[test_df['hw_config'] == 'farm19']

meta_cols = ['node', 'timestamp', 'hw_config', 'is_distress_status', 'status', 'job']
feat_cols = [c for c in train_df.columns if c not in meta_cols]

for c in feat_cols:
    if c not in test_df.columns:
        test_df[c] = 0.0

X_train = train_df[feat_cols].values
X_test = test_df[feat_cols].values

print('Scaling...')
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

print('Training Autoencoder on farm19 (Simulation Architecture)...')
# Using the exact same architecture that generated the injected JSON values
ae = MLPRegressor(
    hidden_layer_sizes=(64,), 
    activation='relu', 
    solver='adam', 
    batch_size=2048, 
    max_iter=20, 
    random_state=42, 
    early_stopping=True
)
start = time.time()
ae.fit(X_train_s, X_train_s)
print(f'Training finished in {time.time() - start:.2f} seconds.')

print('Computing errors...')
train_err = np.mean(np.square(X_train_s - ae.predict(X_train_s)), axis=1)
test_err = np.mean(np.square(X_test_s - ae.predict(X_test_s)), axis=1)

# Look up threshold using the new per-cluster logic (80th percentile for farm19)
threshold = np.percentile(train_err, 80)

distress_mask = test_df['is_distress_status'] == 1
caught_distress = int((test_err[distress_mask] > threshold).sum())
total_anomalies = int((test_err > threshold).sum())

print('\n=== farm19 Evaluation Results ===')
print(f'Threshold (80th Percentile): {threshold:.4f}')
print(f'Total Test Anomalies Flagged: {total_anomalies}')
print(f'Distress States Caught: {caught_distress} / {distress_mask.sum()}')

if total_anomalies == 8582 and caught_distress == 782:
    print('\n[SUCCESS] The evaluation perfectly matches the injected values in multimodel_results.json!')
else:
    print('\n[MISMATCH] The values do not match!')
