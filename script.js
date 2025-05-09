document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchBtn = document.getElementById('search-btn');
    const countryInput = document.getElementById('country-input');
    const resultsContainer = document.getElementById('results-container');
    const errorMessage = document.getElementById('error-message');
    
    // Event Listeners
    searchBtn.addEventListener('click', searchCountry);
    countryInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchCountry();
    });

    // Main search function
    function searchCountry() {
        const searchTerm = countryInput.value.trim();
        
        // Validate input
        if (!searchTerm) {
            showError('Please enter a country name');
            return;
        }
        
        // Clear previous results and errors
        resultsContainer.innerHTML = '';
        errorMessage.textContent = '';
        
        // Show loading state
        showLoading();
        
        // Fetch country data - Here we replace {country name} with actual input
        fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(searchTerm)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Country not found. Please check spelling.');
                }
                return response.json();
            })
            .then(data => {
                // Clear loading and display new results
                resultsContainer.innerHTML = '';
                displayCountryData(data);
            })
            .catch(error => {
                showError(error.message);
                showInitialState();
            });
    }

    function displayCountryData(countries) {
        // Process each country in the response
        countries.forEach(country => {
            const card = document.createElement('div');
            card.className = 'country-card';
            
            // Required data points
            const name = country.name.common;
            const capital = country.capital ? country.capital.join(', ') : 'No capital';
            const flag = country.flags.png;
            
            // Format currency information
            let currencies = 'No currency data';
            if (country.currencies) {
                currencies = Object.values(country.currencies)
                    .map(c => `${c.name} (${c.symbol || '—'})`)
                    .join(', ');
            }
            
            // Additional data points (3 required)
            const population = country.population.toLocaleString();
            const languages = country.languages ? Object.values(country.languages).join(', ') : 'No data';
            const region = `${country.region}${country.subregion ? ` (${country.subregion})` : ''}`;
            
            // Build card HTML
            card.innerHTML = `
                <img src="${flag}" alt="${name} flag" class="country-flag">
                <div class="country-info">
                    <h2>${name}</h2>
                    <div class="info-item">
                        <i class="fas fa-city"></i>
                        <span>Capital: ${capital}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>Currency: ${currencies}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-users"></i>
                        <span>Population: ${population}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-language"></i>
                        <span>Languages: ${languages}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Region: ${region}</span>
                    </div>
                </div>
            `;
            
            resultsContainer.appendChild(card);
        });
    }

    function showLoading() {
        resultsContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading country data...</p>
            </div>
        `;
    }

    function showInitialState() {
        resultsContainer.innerHTML = `
            <div class="initial-state">
                <i class="fas fa-globe"></i>
                <h2>Search for a Country</h2>
                <p>Enter a country name to begin</p>
            </div>
        `;
    }

    function showError(message) {
        errorMessage.textContent = message;
        setTimeout(() => errorMessage.textContent = '', 5000);
    }

    // Initialize with empty state
    showInitialState();
});