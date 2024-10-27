let soilData = [];

// Load soil data JSON
fetch('indian_soil_data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        soilData = data;
        populateStatesDropdown(data);
    })
    .catch(error => console.error('Error loading soil data:', error));

// Populate the dropdown with states from JSON
function populateStatesDropdown(data) {
    const stateDropdown = document.getElementById("state");
    const placeholderOption = document.createElement("option");
    placeholderOption.text = "Select a state...";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    stateDropdown.add(placeholderOption);

    data.forEach(entry => {
        const option = document.createElement("option");
        option.value = entry.State;
        option.text = entry.State;
        stateDropdown.add(option);
    });
}

// Fetch selected state's soil data and send to backend
function loadSoilData(event) {
    event.preventDefault(); // Prevent form submission and page refresh
    const selectedState = document.getElementById("state").value;

    if (!selectedState || selectedState === "Select a state...") {
        alert("Please select a state!");
        return;
    }

    const selectedData = soilData.find(entry => entry.State === selectedState);
    
    if (selectedData) {
        predictSoilType(selectedData);
    } else {
        console.error("No data found for the selected state.");
    }
}

// Send data to backend for prediction
function predictSoilType(soilData) {
    console.log("Sending data to server:", soilData); // Debugging line
    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pH: soilData.pH,
            Organic_Matter: soilData.Organic_Matter,
            Sand: soilData.Sand,
            Silt: soilData.Silt,
            Clay: soilData.Clay
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Received prediction:", data); // Debugging line
        document.getElementById("result").innerHTML = `
            Predicted Soil Type: ${data.soil_type}<br>
            pH: ${soilData.pH}
        `;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("result").innerText = "An error occurred while fetching the prediction.";
    });
}

// Attach event listener to the form
document.getElementById("soilForm").addEventListener("submit", loadSoilData);
// Add this code snippet to script3.js
document.getElementById("backButton").addEventListener("click", function() {
    window.location.href = "home.html"; // Redirect to home.html
});
