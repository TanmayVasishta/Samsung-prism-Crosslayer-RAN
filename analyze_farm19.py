import pandas as pd
import numpy as np
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

X_train = train_df[feat_cols].values
X_test = test_df[feat_cols].values

print('Scaling...')
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

print('Training Autoencoder on farm19...')
ae = MLPRegressor(hidden_layer_sizes=(64,), activation='relu', solver='adam', batch_size=2048, max_iter=20, random_state=42, early_stopping=True)
ae.fit(X_train_s, X_train_s)

print('Computing errors...')
train_err = np.mean(np.square(X_train_s - ae.predict(X_train_s)), axis=1)
test_err = np.mean(np.square(X_test_s - ae.predict(X_test_s)), axis=1)

distress_mask = test_df['is_distress_status'] == 1

print('\n=== farm19 Autoencoder Error Analysis ===')
print(f'Train Error - Mean: {train_err.mean():.4f}, Max: {train_err.max():.4f}, 99th: {np.percentile(train_err, 99):.4f}, 95th: {np.percentile(train_err, 95):.4f}')
print(f'Test Normal Error - Mean: {test_err[~distress_mask].mean():.4f}, Max: {test_err[~distress_mask].max():.4f}')
print(f'Test Distress Error - Mean: {test_err[distress_mask].mean():.4f}, Max: {test_err[distress_mask].max():.4f}, Min: {test_err[distress_mask].min():.4f}')

print('\nThreshold Tuning Simulation:')
for pct in [80, 90, 95, 98, 99, 99.5]:
    thresh = np.percentile(train_err, pct)
    caught = (test_err[distress_mask] > thresh).sum()
    total = distress_mask.sum()
    flagged = (test_err > thresh).sum()
    print(f'Threshold {pct}th percentile ({thresh:.4f}): Caught {caught}/{total} ({caught/total*100:.2f}%) distress states. Flagged {flagged} total anomalies ({flagged/len(test_err)*100:.2f}% of test set).')
