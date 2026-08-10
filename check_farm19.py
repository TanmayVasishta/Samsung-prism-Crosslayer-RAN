import pandas as pd
import numpy as np
import time
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler

print('Loading data...')
train_df = pd.read_parquet('artifacts/features/joined_train_features.parquet')
test_df = pd.read_parquet('artifacts/features/joined_test_features.parquet')

train_df = train_df[train_df['hw_config'] == 'farm19']
test_df = test_df[test_df['hw_config'] == 'farm19']

meta_cols = ['node', 'timestamp', 'hw_config', 'is_distress_status', 'status', 'job']
feat_cols = [c for c in train_df.columns if c not in meta_cols]

for c in feat_cols:
    if c not in test_df.columns:
        test_df[c] = 0.0

X_train = train_df[feat_cols]
X_test = test_df[feat_cols]

print('Scaling...')
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

n_features = X_train_scaled.shape[1]
hidden_layer_sizes = (max(2, n_features // 2),)

ae = MLPRegressor(
    hidden_layer_sizes=hidden_layer_sizes,
    activation='relu',
    solver='adam',
    max_iter=100,
    random_state=42,
    early_stopping=True
)

print('Training heavy Autoencoder on farm19... (This might take a while)')
start = time.time()
ae.fit(X_train_scaled, X_train_scaled)
print(f'Training finished in {time.time() - start:.2f} seconds. (Iters: {ae.n_iter_})')

train_preds = ae.predict(X_train_scaled)
train_err = np.mean(np.square(X_train_scaled - train_preds), axis=1)

test_preds = ae.predict(X_test_scaled)
test_err = np.mean(np.square(X_test_scaled - test_preds), axis=1)

threshold = np.percentile(train_err, 80)
ae_anomalies = int((test_err > threshold).sum())

distress_mask = test_df['is_distress_status'] == 1
caught = int((test_err[distress_mask] > threshold).sum())

print('\n=== Final Uncompromised Autoencoder Results ===')
print(f'Total Test Anomalies: {ae_anomalies}')
print(f'Caught Distress: {caught}')
