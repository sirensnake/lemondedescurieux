# analytics/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

class LearningAnalytics:
    def __init__(self):
        self.df = pd.DataFrame()
    
    def analyze_performance(self, user_data):
        """Analyse les performances pour adaptation difficulté"""
        recent_scores = user_data[-10:]  # 10 dernières activités
        
        metrics = {
            'average_score': np.mean(recent_scores),
            'trend': np.polyfit(range(len(recent_scores)), recent_scores, 1)[0],
            'consistency': np.std(recent_scores),
            'recommended_difficulty': self.calculate_difficulty(recent_scores)
        }
        
        return metrics
    
    def calculate_difficulty(self, scores):
        avg = np.mean(scores)
        if avg > 90:
            return 'increase'
        elif avg < 60:
            return 'decrease'
        return 'maintain'

@app.route('/api/analytics/performance', methods=['POST'])
def get_performance_analysis():
    data = request.json
    analytics = LearningAnalytics()
    result = analytics.analyze_performance(data['scores'])
    return jsonify(result)