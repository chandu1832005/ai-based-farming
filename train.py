import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib

# Generate synthetic data
data = {
    "Temperature Min": np.random.uniform(15, 30, 100),
    "Temperature Max": np.random.uniform(30, 45, 100),
    "pH Min": np.random.uniform(6, 8, 100),
    "pH Max": np.random.uniform(7, 9, 100),
    "Conductivity (µmhos/cm) Min": np.random.uniform(200, 1000, 100),
    "Conductivity (µmhos/cm) Max": np.random.uniform(300, 1200, 100),
    "Conductivity (µmhos/cm)": np.random.uniform(400, 1400, 100)  # Target variable
}

df = pd.DataFrame(data)

# Features and target
X = df[["Temperature Min", "Temperature Max", "pH Min", "pH Max", "Conductivity (µmhos/cm) Min", "Conductivity (µmhos/cm) Max"]]
y = df["Conductivity (µmhos/cm)"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, 'water_quality_model.pkl')

print("Model trained and saved as 'water_quality_model.pkl'")
