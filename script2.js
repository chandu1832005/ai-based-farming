// Mock data for states and cities
const statesData = [
    { "id": 1, "name": "Andhra Pradesh" },
    { "id": 2, "name": "Maharashtra" },
    { "id": 3, "name": "Karnataka" }
];

const citiesData = {
    "1": [
        { "id": 1, "name": "Vijayawada" },
        { "id": 2, "name": "Visakhapatnam" }
    ],
    "2": [
        { "id": 3, "name": "Mumbai" },
        { "id": 4, "name": "Pune" }
    ],
    "3": [
        { "id": 5, "name": "Bengaluru" },
        { "id": 6, "name": "Mysuru" }
    ]
};

// Sample water quality data
const waterData = [
    {
        "Station Code": 26,
        "Station Name": "WELL AT GRAM PANCHAYAT OFFICE, KAANURU, VIJAYWADA",
        "STATE": "ANDHRA PRADESH",
        "Temperature Min": 25,
        "Temperature Max": 26,
        "pH Min": 7.8,
        "pH Max": 7.9,
        "Conductivity (µmhos/cm) Min": 1814,
        "Conductivity (µmhos/cm) Max": 1841,
        "Year": 2019
    },
    // Add more data entries for other cities and years
];

// Sample crop recommendations based on water quality
const cropRecommendations = {
    "Kharif": ["Rice", "Maize", "Cotton", "Soybean", "Sorghum"],
    "Rabi": ["Wheat", "Barley", "Mustard", "Chickpeas", "Oats"],
    "Zaid": ["Cucumber", "Pumpkin", "Watermelon", "Tomato", "Bitter gourd"]
};

// Populate state dropdown
const stateSelect = document.getElementById("stateSelect");
statesData.forEach(state => {
    const option = document.createElement("option");
    option.value = state.id;
    option.textContent = state.name;
    stateSelect.appendChild(option);
});

// Populate city dropdown based on selected state
stateSelect.addEventListener("change", () => {
    const selectedStateId = stateSelect.value;
    const citySelect = document.getElementById("citySelect");
    citySelect.innerHTML = ''; // Clear previous options

    if (citiesData[selectedStateId]) {
        citiesData[selectedStateId].forEach(city => {
            const option = document.createElement("option");
            option.value = city.id;
            option.textContent = city.name;
            citySelect.appendChild(option);
        });
    }
});

// Function to get water availability for selected city
function getWaterAvailability(state, city) {
    // Filter the water data based on state and city
    const cityWaterData = waterData.filter(data => 
        data.STATE === state && data["Station Name"].includes(city)
    );

    if (cityWaterData.length > 0) {
        const minConductivity = cityWaterData[0]["Conductivity (µmhos/cm) Min"];
        const maxConductivity = cityWaterData[0]["Conductivity (µmhos/cm) Max"];
        return `Water Conductivity: ${minConductivity} - ${maxConductivity} µmhos/cm`;
    } else {
        return "No water data available for this city.";
    }
}

// Get water availability and crops on button click
document.getElementById("submitButton").addEventListener("click", () => {
    const selectedState = stateSelect.options[stateSelect.selectedIndex].text;
    const selectedCity = document.getElementById("citySelect").options[document.getElementById("citySelect").selectedIndex].text;
    const selectedSeason = document.getElementById("seasonSelect").value;

    // Get water availability
    const waterAvailability = getWaterAvailability(selectedState, selectedCity);

    // Get recommended crops based on season
    const recommendedCrops = cropRecommendations[selectedSeason] || [];

    // Display results
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `
        <strong>Selected:</strong> State: ${selectedState}, City: ${selectedCity}, Season: ${selectedSeason}.<br>
        <strong>Water Availability:</strong> ${waterAvailability}<br>
        <strong>Recommended Crops:</strong> ${recommendedCrops.join(', ') || 'No crops available for this season.'}<br>
        <strong>Water Management Techniques:</strong><br>
        <ul>
            <li>Rainwater harvesting</li>
            <li>Drip irrigation</li>
            <li>Mulching</li>
            <li>Soil moisture monitoring</li>
            <li>Crop rotation</li>
        </ul>
    `;
});
