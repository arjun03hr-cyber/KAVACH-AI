import pandas as pd
import numpy as np
import random
import joblib
import os

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.tree import DecisionTreeRegressor

print("Loading dataset...")
data = pd.read_csv('Dataset/data.csv', on_bad_lines='skip')
data.dropna(inplace=True)

password_tuple = np.array(data)
random.shuffle(password_tuple)

x = [labels[0] for labels in password_tuple]
y = [labels[1] for labels in password_tuple]

def word_divide_char(inputs):
    return list(inputs)

print("Initializing TF-IDF Vectorizer...")
vectorizer = TfidfVectorizer(
    tokenizer=word_divide_char,
    token_pattern=None
)

print("Fitting Vectorizer and Transforming Data...")
X = vectorizer.fit_transform(x)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

print("Training Logistic Regression Model...")
log_model = LogisticRegression(random_state=0, max_iter=2000)
log_model.fit(X_train, y_train)

print("Training Ridge Regression Model...")
ridge_model = Ridge()
ridge_model.fit(X_train, y_train)

print("Training Decision Tree Regressor Model...")
tree_model = DecisionTreeRegressor()
tree_model.fit(X_train, y_train)

print("Saving models and vectorizer to models/ directory...")
# Ensure models directory exists
os.makedirs("models", exist_ok=True)

joblib.dump(vectorizer, 'models/vectorizer.pkl')
joblib.dump(log_model, 'models/log_model.pkl')
joblib.dump(ridge_model, 'models/ridge_model.pkl')
joblib.dump(tree_model, 'models/tree_model.pkl')

print("Models successfully saved!")
