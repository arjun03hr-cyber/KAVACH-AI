from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import random
import re
import string
import math

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.tree import DecisionTreeRegressor

app = Flask(__name__)

import joblib
import os

# ===================== DATA LOADING & MODEL TRAINING =====================
# The models are now trained completely offline via `train_models.py`.
# We only load them into memory here to significantly speed up startup time.
#
# If the models have not been trained yet, you'll need to run `python train_models.py` first.

def word_divide_char(inputs):
    return list(inputs)

try:
    vectorizer = joblib.load('models/vectorizer.pkl')
    log_model = joblib.load('models/log_model.pkl')
    ridge_model = joblib.load('models/ridge_model.pkl')
    tree_model = joblib.load('models/tree_model.pkl')
    print("Pre-trained models loaded successfully!")
except FileNotFoundError:
    print("Error: Pre-trained models not found.")
    print("Please run 'python train_models.py' first to generate the model files.")
    # Exits cleanly. The server won't handle prediction requests properly without these models.
    exit(1)

# ===================== ML PREDICTION =====================

def convert_label(prediction):
    prediction = round(float(prediction))
    if prediction == 0:
        return "Weak"
    elif prediction == 1:
        return "Medium"
    else:
        return "Strong"

def predict_all(password):
    transformed = vectorizer.transform([password])

    log_pred = log_model.predict(transformed)[0]
    ridge_pred = ridge_model.predict(transformed)[0]
    tree_pred = tree_model.predict(transformed)[0]

    return {
        "Logistic Regression": convert_label(log_pred),
        "Ridge Regression": convert_label(ridge_pred),
        "Decision Tree": convert_label(tree_pred)
    }

# ===================== RULE BASED ANALYSIS =====================

def analyze_password(password):
    reasons = []
    score = 0

    if len(password) >= 8:
        score += 1
    else:
        reasons.append("Password must be at least 8 characters long.")

    if re.search(r'[A-Z]', password):
        score += 1
    else:
        reasons.append("Add at least one uppercase letter.")

    if re.search(r'[a-z]', password):
        score += 1
    else:
        reasons.append("Add at least one lowercase letter.")

    if re.search(r'[0-9]', password):
        score += 1
    else:
        reasons.append("Add at least one number.")

    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 1
    else:
        reasons.append("Add at least one special character.")

    if score <= 2:
        strength = "Weak"
    elif score <= 4:
        strength = "Medium"
    else:
        strength = "Strong"

    return strength, reasons, score

# ===================== ENTROPY CALCULATION =====================

def calculate_entropy(password):
    charset = 0

    if re.search(r'[a-z]', password):
        charset += 26
    if re.search(r'[A-Z]', password):
        charset += 26
    if re.search(r'[0-9]', password):
        charset += 10
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        charset += 32

    if charset == 0:
        return 0

    entropy = len(password) * math.log2(charset)
    return round(entropy, 2)

# ===================== PASSWORD SUGGESTIONS =====================

def suggest_passwords(password):
    suggestions = []

    for _ in range(4):
        new_pass = password

        if not re.search(r'[A-Z]', new_pass):
            new_pass += random.choice(string.ascii_uppercase)

        if not re.search(r'[a-z]', new_pass):
            new_pass += random.choice(string.ascii_lowercase)

        if not re.search(r'[0-9]', new_pass):
            new_pass += random.choice(string.digits)

        new_pass += random.choice("!@#$%")
        new_pass += ''.join(random.choices(string.ascii_letters + string.digits, k=2))

        suggestions.append(new_pass)

    return suggestions

# ===================== ROUTE =====================

@app.route('/', methods=['GET', 'POST'])
def home():
    results = None
    final_strength = None
    reasons = None
    suggestions = None
    entropy = None
    meter_width = 0

    if request.method == 'POST':
        password = request.form['password']

        results = predict_all(password)

        final_strength, reasons, score = analyze_password(password)

        entropy = calculate_entropy(password)

        suggestions = suggest_passwords(password)

        # Meter animation width calculation
        meter_width = int((score / 5) * 100)

    return render_template(
        'index.html',
        results=results,
        final_strength=final_strength,
        reasons=reasons,
        suggestions=suggestions,
        entropy=entropy,
        meter_width=meter_width
    )

@app.route('/api/analyze', methods=['POST'])
def api_analyze():
    data = request.get_json()
    if not data or 'password' not in data:
        return jsonify({"error": "No password provided"}), 400
    
    password = data['password']
    if not password:
         return jsonify({
            "results": {},
            "final_strength": "",
            "reasons": [],
            "entropy": 0,
            "suggestions": [],
            "score": 0
         })

    results = predict_all(password)
    final_strength, reasons, score = analyze_password(password)
    entropy = calculate_entropy(password)
    suggestions = suggest_passwords(password)

    return jsonify({
        "results": results,
        "final_strength": final_strength,
        "reasons": reasons,
        "entropy": entropy,
        "suggestions": suggestions,
        "score": score
    })

if __name__ == "__main__":
    app.run(debug=True)