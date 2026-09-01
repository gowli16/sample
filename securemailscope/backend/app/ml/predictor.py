from app.ml.model import ModelManager

class Predictor:
    def __init__(self):
        self.model_manager = ModelManager.get_instance()

    def predict_risk(self, features: list):
        # returns prediction (0-3), probabilities array
        prediction = self.model_manager.predict(features)
        probabilities = self.model_manager.predict_proba(features)
        
        # Calculate a continuous risk score 0-100 based on probabilities
        # classes: 0: 10, 1: 40, 2: 70, 3: 95
        score = (probabilities[0] * 5 + probabilities[1] * 40 + probabilities[2] * 75 + probabilities[3] * 95)
        
        return int(prediction), min(max(int(score), 0), 100), probabilities
