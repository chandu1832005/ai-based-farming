document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("yieldPredictionForm");
    const stateSelect = document.getElementById("state");
    const citySelect = document.getElementById("city");
    const cropSelect = document.getElementById("crop");
    const seasonSelect = document.getElementById("season");

    // Load states from states.json
    fetch('states.json')
        .then(response => response.json())
        .then(states => {
            states.forEach(state => {
                if (state.country_code === "IN") { // Filter for Indian states
                    const option = document.createElement("option");
                    option.value = state.name;
                    option.textContent = state.name;
                    stateSelect.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Error loading states.json:', error));

    // Load cities based on selected state
    fetch('cities.json')
        .then(response => response.json())
        .then(cities => {
            stateSelect.addEventListener("change", function () {
                const selectedState = this.value;
                citySelect.innerHTML = '<option value="">--Select City--</option>'; // Reset cities dropdown
                
                cities.forEach(city => {
                    if (city.state_name === selectedState) {
                        const option = document.createElement("option");
                        option.value = city.name;
                        option.textContent = city.name;
                        citySelect.appendChild(option);
                    }
                });
            });
        })
        .catch(error => console.error('Error loading cities.json:', error));

    // Load crops and seasons from csvjson.json
    fetch('csvjson.json')
        .then(response => response.json())
        .then(data => {
            const crops = new Set(); // Use a Set to ensure uniqueness
            const seasons = new Set(); // Use a Set for unique seasons
            
            data.forEach(entry => {
                crops.add(entry.Crop.trim()); // Add crop name to the Set
                seasons.add(entry.Season.trim()); // Add season name to the Set
            });

            // Populate crop dropdown
            crops.forEach(crop => {
                const option = document.createElement("option");
                option.value = crop;
                option.textContent = crop;
                cropSelect.appendChild(option);
            });

            // Populate season dropdown
            seasons.forEach(season => {
                const option = document.createElement("option");
                option.value = season;
                option.textContent = season;
                seasonSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading csvjson.json:', error));

    // Load crop images from crop_details.json
    let cropImages = {};
    fetch('crop_details.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                cropImages[item.crop.toLowerCase()] = item.path; // Store image paths with crop names as keys
            });
        })
        .catch(error => console.error('Error loading crop_details.json:', error));

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        predictYield(cropImages);
    });
});

function getRandomSuggestion() {
    const suggestions = [
        `<p>1. **Soil Health:** Regularly test your soil to monitor pH levels and nutrient content. Add organic matter like compost or well-rotted manure to improve soil structure and fertility.</p>
        <p>2. **Crop Rotation:** Practice crop rotation to enhance soil health and reduce pest and disease buildup.</p>`,
        
        `<p>1. **Natural Pest Control:** Use beneficial insects such as ladybugs and lacewings to manage pests naturally. Consider companion planting to deter harmful insects.</p>
        <p>2. **Mulching:** Apply organic mulch to retain moisture, suppress weeds, and improve soil quality as it decomposes.</p>`,
        
        `<p>1. **Organic Fertilizers:** Utilize organic fertilizers like bone meal, blood meal, or fish emulsion to provide nutrients without harming beneficial soil organisms.</p>
        <p>2. **Water Management:** Implement rainwater harvesting and efficient irrigation techniques to ensure adequate moisture for crops.</p>`
    ];

    // Get a random suggestion from the array
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    return suggestions[randomIndex];
}

function predictYield(cropImages) {
    const crop = document.getElementById("crop").value;
    const cropYear = parseInt(document.getElementById("Crop_Year").value);
    const season = document.getElementById("season").value;
    const state = document.getElementById("state").value;
    const city = document.getElementById("city").value; 
    const area = parseFloat(document.getElementById("Area").value);
    const annualRainfall = parseFloat(document.getElementById("Annual_Rainfall").value);
    const fertilizer = parseFloat(document.getElementById("Fertilizer").value);
    const pesticide = parseFloat(document.getElementById("Pesticide").value);

    // Simple yield prediction formula
    const yieldPrediction = (annualRainfall * fertilizer * area) / 1000000;

    const resultDiv = document.getElementById("result");
    const cropImagePath = cropImages[crop.toLowerCase()] || 'https://journalsofindia.com/wp-content/uploads/2021/02/Cropping-Systems-in-India.jpg'; // Fallback to specified URL

    resultDiv.innerHTML = `
        <h2>Predicted Yield</h2>
        <p>Predicted Yield for <strong>${crop}</strong> in <strong>${city}, ${state}</strong> (${cropYear}, ${season}): <strong>${yieldPrediction.toFixed(2)} tons</strong></p>
        <img src="${cropImagePath}" alt="${crop}" style="width:100%; max-height:300px; object-fit:cover;">
        <h3>Organic Suggestions to Improve Yield:</h3>
        ${getRandomSuggestion()}
    `;
}
// Function to display recommendations and scroll to the top
function displayRecommendations(crops) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "<h2>Recommended Crops:</h2>";

    if (crops.length === 0) {
        outputDiv.innerHTML += "<p>No crops available for the selected season.</p>";
        return;
    }

    crops.forEach(crop => {
        outputDiv.innerHTML += `
            <p>
                <strong>${crop.name}</strong>: 
                Yield: ${crop.yield} tons/acre, 
                Estimated Budget Required: INR ${crop.budgetRequired}
            </p>
        `;
    });

    // Scroll to the top of the output
    outputDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

