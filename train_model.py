import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_curve, auc,
    roc_auc_score, accuracy_score, precision_score, recall_score, f1_score
)
import matplotlib.pyplot as plt
import json

# Load data
X_train = np.load('data/X_train.npy')
X_test = np.load('data/X_test.npy')
y_train = np.load('data/y_train.npy')
y_test = np.load('data/y_test.npy')

print(f"Data loaded successfully!")
print(f"Training shape: {X_train.shape}, Test shape: {X_test.shape}")

# Build advanced neural network
model = keras.Sequential([
    layers.Dense(256, activation='relu', input_shape=(X_train.shape,)),
    layers.BatchNormalization(),
    layers.Dropout(0.4),
    
    layers.Dense(128, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.3),
    
    layers.Dense(64, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.3),
    
    layers.Dense(32, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.2),
    
    layers.Dense(16, activation='relu'),
    layers.Dropout(0.1),
    
    layers.Dense(1, activation='sigmoid')
])

# Compile model
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=[
        'accuracy',
        keras.metrics.AUC(),
        keras.metrics.Precision(),
        keras.metrics.Recall()
    ]
)

# Print model summary
print("\nModel Architecture:")
model.summary()

# Train model
early_stopping = keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=10,
    restore_best_weights=True
)

reduce_lr = keras.callbacks.ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.5,
    patience=5,
    min_lr=0.00001
)

history = model.fit(
    X_train, y_train,
    epochs=100,
    batch_size=32,
    validation_split=0.2,
    callbacks=[early_stopping, reduce_lr],
    verbose=1
)

# Evaluate on test set
print("\n" + "="*50)
print("EVALUATION ON TEST SET")
print("="*50)

y_pred_prob = model.predict(X_test)
y_pred = (y_pred_prob > 0.5).astype(int).flatten()

# Metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_pred_prob)

print(f"\nAccuracy:  {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall:    {recall:.4f}")
print(f"F1-Score:  {f1:.4f}")
print(f"ROC-AUC:   {roc_auc:.4f}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Non-AD', 'AD']))

print("\nConfusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
print(cm)
print(f"True Negatives:  {cm[0,0]}")
print(f"False Positives: {cm[0,1]}")
print(f"False Negatives: {cm[1,0]}")
print(f"True Positives:  {cm[1,1]}")

# Save metrics
metrics = {
    'accuracy': float(accuracy),
    'precision': float(precision),
    'recall': float(recall),
    'f1_score': float(f1),
    'roc_auc': float(roc_auc),
    'total_test_samples': len(y_test),
    'ad_cases': int(np.sum(y_test)),
    'non_ad_cases': int(len(y_test) - np.sum(y_test))
}

with open('models/metrics.json', 'w') as f:
    json.dump(metrics, f, indent=4)

# Save model
model.save('models/alzheimers_model.h5')
print("\n✓ Model saved as 'models/alzheimers_model.h5'")
print("✓ Metrics saved as 'models/metrics.json'")

# Plot training history
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Accuracy
axes.plot(history.history['accuracy'], label='Train Accuracy')
axes.plot(history.history['val_accuracy'], label='Val Accuracy')
axes.set_title('Model Accuracy')
axes.set_xlabel('Epoch')
axes.set_ylabel('Accuracy')
axes.legend()
axes.grid(True)

# Loss
axes.plot(history.history['loss'], label='Train Loss')
axes.plot(history.history['val_loss'], label='Val Loss')
axes.set_title('Model Loss')
axes.set_xlabel('Epoch')
axes.set_ylabel('Loss')
axes.legend()
axes.grid(True)

plt.tight_layout()
plt.savefig('models/training_history.png')
print("✓ Training history plot saved")
