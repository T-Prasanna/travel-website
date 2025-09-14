document.getElementById('searchBtn').addEventListener('click', performSearch);
document.getElementById('clearBtn').addEventListener('click', clearResults);

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!query) {
        alert('Please enter a valid search keyword.');
        return;
    }

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            const resultsSection = document.getElementById('resultsSection');
            resultsSection.innerHTML = '';

            let found = false;

            // ✅ Search beaches
            data.beaches.forEach(beach => {
                if (beach.name.toLowerCase().includes(query) || query === "beach") {
                    createCard(beach.name, beach.imageUrl, beach.description);
                    found = true;
                }
            });

            // ✅ Search temples
            data.temples.forEach(temple => {
                if (temple.name.toLowerCase().includes(query) || query === "temple") {
                    createCard(temple.name, temple.imageUrl, temple.description);
                    found = true;
                }
            });

            // ✅ Search countries & cities
            data.countries.forEach(country => {
                if (country.name.toLowerCase().includes(query) || query === "country") {
                    country.cities.forEach(city => {
                        createCard(city.name, city.imageUrl, city.description, country.name);
                        found = true;
                    });
                } else {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(query)) {
                            createCard(city.name, city.imageUrl, city.description, country.name);
                            found = true;
                        }
                    });
                }
            });

            // If nothing matched
            if (!found) {
                resultsSection.innerHTML = '<p>No results found. Try another keyword.</p>';
            }
        })
        .catch(err => console.error("Error fetching data:", err));
}

function createCard(name, imageUrl, description, country = null) {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
        <h3>${name}</h3>
        <img src="${imageUrl}" alt="${name}" width="300" />
        <p>${description}</p>
        ${country ? showTimeForCountry(country) : ""}
    `;
    document.getElementById('resultsSection').appendChild(card);
}

function clearResults() {
    document.getElementById('resultsSection').innerHTML = '';
    document.getElementById('searchInput').value = '';
}

// ✅ Optional: Show time for countries
function showTimeForCountry(country) {
    let timeZoneMap = {
        "Australia": "Australia/Sydney",
        "Japan": "Asia/Tokyo",
        "Brazil": "America/Sao_Paulo",
        "India": "Asia/Kolkata",
        "Cambodia": "Asia/Phnom_Penh",
        "France": "Europe/Paris"
    };

    if (timeZoneMap[country]) {
        const options = {
            timeZone: timeZoneMap[country],
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        const localTime = new Date().toLocaleTimeString('en-US', options);
        return `<p><strong>Current Time in ${country}:</strong> ${localTime}</p>`;
    }
    return '';
}
