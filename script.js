document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("submit");
    const stateSelect = document.getElementById("state");
    const citySelect = document.getElementById("city");
    const seasonSelect = document.getElementById("season");
    const outputDiv = document.getElementById("output");
    const container = document.querySelector('.container');

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
                citySelect.innerHTML = '<option value="">Select City</option>'; // Reset cities dropdown
                
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
            const crops = new Set(); // To ensure uniqueness
            const seasons = new Set(); // To store unique seasons
            
            data.forEach(entry => {
                crops.add(entry.Crop.trim()); // Add crop name
                seasons.add(entry.Season.trim()); // Add season name
            });

            // Populate season dropdown
            seasons.forEach(season => {
                const option = document.createElement("option");
                option.value = season;
                option.textContent = season;
                seasonSelect.appendChild(option);
            });

            // Save crop data for future use
            window.cropData = data; // Save the crop data globally
        })
        .catch(error => console.error('Error loading csvjson.json:', error));

    form.addEventListener("click", function () {
        const budget = parseFloat(document.getElementById("budget").value);
        const landSize = parseFloat(document.getElementById("landSize").value);
        const selectedSeason = seasonSelect.value;

        // Filter crops based on the budget and land size
        const recommendedCrops = getTopCrops(budget, landSize, selectedSeason);
        
        // Display recommendations
        displayRecommendations(recommendedCrops);
        
        // Remove centering after output
        container.style.position = 'static'; // Allow normal scrolling
        document.body.style.height = 'auto'; // Allow body to adjust height
    });
});

// Function to get top crops based on budget, land size, and selected season
// Function to get top crops based on budget, land size, and selected season
function getTopCrops(budget, landSize, selectedSeason) {
    // Filter crop data based on selected season
    const filteredCrops = window.cropData.filter(crop => crop.Season === selectedSeason);
    console.log("Filtered Crops:", filteredCrops);

    // Sort crops by yield for simplicity
    const sortedCrops = filteredCrops.sort((a, b) => b.Yield - a.Yield);

    const topCrops = [];
    const cropNames = new Set(); 

    for (const crop of sortedCrops) {
        const requiredBudget = calculateBudget(crop, landSize);
        console.log("Required Budget for", crop.Crop, ":", requiredBudget);

        // Check if the required budget is within the user's budget
        if (topCrops.length < 5 && !cropNames.has(crop.Crop) && requiredBudget <= budget) {
            cropNames.add(crop.Crop);
            topCrops.push({
                name: crop.Crop,
                yield: crop.Yield,
                production: crop.Production,
                area: crop.Area,
                budgetRequired: requiredBudget
            });
        }
    }

    console.log("Top Crops:", topCrops);
    return topCrops;
}



// Function to calculate required budget based on crop data
function calculateBudget(crop, landSize) {
    const costPerAcre = 1000; // Hypothetical cost per acre for simplicity
    return costPerAcre * landSize; // Total budget required for the specified land size
}

// Function to display recommendations
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
}
