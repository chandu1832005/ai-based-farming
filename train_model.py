import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load your actual JSON file
data = pd.read_json('your_soil_data.json')  # Replace with your actual JSON file name

# Features and labels
X = data[['pH', 'Organic_Matter', 'Sand', 'Silt', 'Clay']]
y = data['Soil_Type']

# Split and train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, 'soil_classifier.pkl')
print("Model saved as soil_classifier.pkl")
