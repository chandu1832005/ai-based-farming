from flask import Flask, request, jsonify
import joblib

# Load the trained model
model = joblib.load('water_quality_model.pkl')

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # Get JSON data from the request
    data = request.json

    # Prepare the input features
    features = [[
        data['Temperature Min'],
        data['Temperature Max'],
        data['pH Min'],
        data['pH Max'],
        data['Conductivity (µmhos/cm) Min'],
        data['Conductivity (µmhos/cm) Max']
    ]]

    # Make prediction
    prediction = model.predict(features)

    # Return the prediction result
    return jsonify({
        'predicted_conductivity': prediction[0]
    })

if __name__ == '__main__':
    app.run(debug=True)
