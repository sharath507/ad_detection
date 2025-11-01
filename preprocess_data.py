import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import joblib

# Load CSV
df = pd.read_csv('alzheimers_disease_data.csv')

# Display basic info
print("Dataset shape:", df.shape)
print("Columns:", df.columns.tolist())
print("Target distribution:")
print(df['Diagnosis'].value_counts())

# Identify feature columns
exclude_cols = ['PatientID', 'Diagnosis', 'DoctorInCharge']
feature_cols = [col for col in df.columns if col not in exclude_cols]

# Separate features and target
X = df[feature_cols].copy()
y = (df['Diagnosis'].str.strip() == '1').astype(int).values  # 1 for AD, 0 for Non-AD

# Handle missing values
X = X.fillna(X.mean())

# Encode categorical columns if any
categorical_cols = X.select_dtypes(include=['object']).columns
for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))
    joblib.dump(le, f'encoders/{col}_encoder.pkl')

X = X.values.astype(np.float32)

# Normalize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split data (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

# Save processed data
np.save('data/X_train.npy', X_train)
np.save('data/X_test.npy', X_test)
np.save('data/y_train.npy', y_train)
np.save('data/y_test.npy', y_test)

# Save feature names and scaler
pd.DataFrame({'feature_index': range(len(feature_cols)), 'feature_name': feature_cols}).to_csv(
    'data/features_mapping.csv', index=False
)
joblib.dump(scaler, 'models/scaler.pkl')

print(f"\nProcessing complete!")
print(f"Training samples: {X_train.shape}")
print(f"Test samples: {X_test.shape}")
print(f"Features: {X_train.shape}")
print(f"Class distribution (Train): {np.bincount(y_train)}")
print(f"Class distribution (Test): {np.bincount(y_test)}")
