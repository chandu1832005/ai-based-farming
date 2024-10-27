# app.py
from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model
model = joblib.load('soil_classifier.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    pH = data['pH']
    organic_matter = data['Organic_Matter']
    sand = data['Sand']
    silt = data['Silt']
    clay = data['Clay']

    # Predict soil type
    prediction = model.predict([[pH, organic_matter, sand, silt, clay]])
    return jsonify({'soil_type': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
