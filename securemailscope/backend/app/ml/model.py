import numpy as np
from sklearn.ensemble import RandomForestClassifier
from app.analysis.feature_extractor import FeatureExtractor

class ModelManager:
    _instance = None
    _model = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self._model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.is_trained = False
        self.feature_names = FeatureExtractor.FEATURE_NAMES

    def train_on_synthetic_data(self):
        print("Training ML model on synthetic data...")
        # Generate synthetic data for 4 classes: 0=LOW, 1=MEDIUM, 2=HIGH, 3=CRITICAL
        np.random.seed(42)
        n_samples = 600
        
        X = []
        y = []
        
        # We'll create samples representing different security postures
        for i in range(n_samples):
            posture = i % 4
            if posture == 0: # LOW Risk (Secure)
                features = [
                    1.0, 465.0, 4.0, 3.0, 
                    1.0, 0.0, 1.0, 0.0, 
                    0.0, 1.0, 1.0, 1.0, 
                    3.0, 1.0, 0.0, 0.0
                ]
                y.append(0)
            elif posture == 1: # MEDIUM Risk
                features = [
                    1.0, 587.0, 3.0, 2.0, 
                    1.0, 1.0, 1.0, 0.0, 
                    0.0, 1.0, 1.0, 1.0, 
                    2.0, 1.0, 0.0, 0.0
                ]
                y.append(1)
            elif posture == 2: # HIGH Risk
                features = [
                    1.0, 465.0, 2.0, 1.0, 
                    1.0, 0.0, 0.0, 1.0, 
                    1.0, 0.0, 0.0, 0.5, 
                    1.0, 1.0, 0.0, 1.0
                ]
                y.append(2)
            else: # CRITICAL Risk
                features = [
                    1.0, 25.0, 0.0, 0.0, 
                    0.0, 0.0, 0.0, 0.0, 
                    0.0, 0.0, 0.0, 0.0, 
                    0.0, 0.0, 1.0, 0.0
                ]
                y.append(3)
                
            # Add some noise
            noisy_features = [f + np.random.normal(0, 0.1) for f in features]
            X.append(noisy_features)
            
        self._model.fit(X, y)
        self.is_trained = True
        print("ML model training complete.")

    def predict_proba(self, features: list):
        if not self.is_trained:
            self.train_on_synthetic_data()
        return self._model.predict_proba([features])[0]

    def predict(self, features: list):
        if not self.is_trained:
            self.train_on_synthetic_data()
        return self._model.predict([features])[0]

    def get_feature_importances(self):
        if not self.is_trained:
            return np.zeros(len(self.feature_names))
        return self._model.feature_importances_
