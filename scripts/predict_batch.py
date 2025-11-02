import tensorflow as tf
import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder

# Load model and preprocessing tools
model = tf.keras.models.load_model('models/alzheimers_model.h5')
scaler = joblib.load('models/scaler.pkl')
features_mapping = pd.read_csv('data/features_mapping.csv')

def predict_patient_ad_risk(patient_data):
    """
    Predict AD risk for a single patient
    
    Args:
        patient_data: dict with feature names as keys
        
    Returns:
        dict with prediction results
    """
    # Convert to feature array in correct order
    feature_array = np.zeros((1, len(features_mapping)))
    
    for idx, row in features_mapping.iterrows():
        feat_name = row['feature_name']
        if feat_name in patient_data:
            feature_array[0, idx] = patient_data[feat_name]
    
    # Scale features
    feature_scaled = scaler.transform(feature_array)
    
    # Predict
    prediction_prob = model.predict(feature_scaled, verbose=0)
    
    # Determine risk level
    if prediction_prob > 0.75:
        risk_level = 'HIGH'
    elif prediction_prob > 0.50:
        risk_level = 'MEDIUM'
    else:
        risk_level = 'LOW'
    
    return {
        'probability_ad': float(prediction_prob),
        'risk_level': risk_level,
        'has_ad': bool(prediction_prob > 0.5)
    }

def batch_predict(csv_file):
    """
    Predict AD risk for multiple patients from CSV
    """
    df = pd.read_csv(csv_file)
    results = []
    
    for idx, row in df.iterrows():
        patient_data = row.to_dict()
        prediction = predict_patient_ad_risk(patient_data)
        prediction['patient_id'] = idx
        results.append(prediction)
    
    results_df = pd.DataFrame(results)
    results_df.to_csv('predictions_output.csv', index=False)
    print(f"✓ Batch predictions saved to 'predictions_output.csv'")
    return results_df
