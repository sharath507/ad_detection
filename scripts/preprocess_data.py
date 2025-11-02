# scripts/preprocess_data.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# Load Alzheimer's dataset
df = pd.read_csv('alzheimers_disease_data.csv')

# Define feature columns (exclude diagnosis and metadata)
feature_cols = [col for col in df.columns if col not in ['Diagnosis', 'DoctorInCharge', 'PatientID']]

# Extract features and target
X = df[feature_cols].values
y = (df['Diagnosis'] == '1').astype(int).values  # Binary: 1 for AD, 0 for Non-AD

# Handle missing values
X = np.nan_to_num(X, nan=0.0)

# Normalize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training set: {X_train.shape}")
print(f"Test set: {X_test.shape}")
print(f"Feature count: {len(feature_cols)}")

# Save preprocessed data
np.save('data/X_train.npy', X_train)
np.save('data/X_test.npy', X_test)
np.save('data/y_train.npy', y_train)
np.save('data/y_test.npy', y_test)
pd.DataFrame({'feature': feature_cols}).to_csv('data/features.csv', index=False)

print("Preprocessing complete!")
