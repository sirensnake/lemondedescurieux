# analytics/ml_models.py
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib

class PersonalizationEngine:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = KMeans(n_clusters=5)  # 5 profils d'apprentissage
        
    def train_profiles(self, user_data):
        """Entraîne le modèle sur les données utilisateurs"""
        features = self.extract_features(user_data)
        scaled = self.scaler.fit_transform(features)
        self.model.fit(scaled)
        
        # Sauvegarder le modèle
        joblib.dump(self.model, 'models/learning_profiles.pkl')
        
    def predict_learning_path(self, user_metrics):
        """Prédit le parcours optimal pour un utilisateur"""
        features = self.extract_features([user_metrics])
        scaled = self.scaler.transform(features)
        profile = self.model.predict(scaled)[0]
        
        # Recommandations par profil
        recommendations = {
            0: {'focus': 'visual', 'pace': 'slow', 'review_frequency': 'high'},
            1: {'focus': 'practical', 'pace': 'medium', 'review_frequency': 'medium'},
            2: {'focus': 'theoretical', 'pace': 'fast', 'review_frequency': 'low'},
            3: {'focus': 'mixed', 'pace': 'adaptive', 'review_frequency': 'spaced'},
            4: {'focus': 'gamified', 'pace': 'variable', 'review_frequency': 'achievement-based'}
        }
        
        return recommendations.get(profile, recommendations[3])