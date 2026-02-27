// Your OpenWeatherMap API Key
const API_KEY = 'YOUR_API_KEY_HERE';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Get references to HTML elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');

// ===============================
// Show Loading State
// ===============================
function showLoading() {
    const loadingHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p class="loading">Fetching weather data...</p>
        </div>
    `;
    weatherDisplay.innerHTML = loadingHTML;
}

// ===============================
// Show Error Message
// ===============================
function showError(message) {
    const errorHTML = `
        <div class="error-message">
            ⚠️ ${message}
        </div>
    `;
    weatherDisplay.innerHTML = errorHTML;
}

// ===============================
// Fetch Weather (Async/Await)
// ===============================
async function getWeather(city) {

    showLoading();

    const url = ${API_URL}?q=${city}&appid=${API_KEY}&units=metric;

    // Disable button during search
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';

    try {
        const response = await axios.get(url);

        console.log('Weather Data:', response.data);

        displayWeather(response.data);

    } catch (error) {
        console.error('Error:', error);

        if (error.response && error.response.status === 404) {
            showError('City not found. Please check the spelling and try again.');
        } else {
            showError('Something went wrong. Please try again later.');
        }

    } finally {
        // Re-enable button
        searchBtn.disabled = false;
        searchBtn.textContent = '🔍 Search';
    }
}

// ===============================
// Display Weather Data
// ===============================
function displayWeather(data) {

    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = https://openweathermap.org/img/wn/${icon}@2x.png;

    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    weatherDisplay.innerHTML = weatherHTML;

    // Focus back to input for better UX
    cityInput.focus();
}

// ===============================
// Search Button Click Event
// ===============================
searchBtn.addEventListener('click', function () {

    const city = cityInput.value.trim();

    // Validation
    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    if (city.length < 2) {
        showError('City name too short.');
        return;
    }

    getWeather(city);
});

// ===============================
// Enter Key Support
// ===============================
cityInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

// ===============================
// Initial Welcome Message
// ===============================
weatherDisplay.innerHTML = `
    <p class="loading">
        🌍 Welcome to SkyFetch! <br>
        Enter a city name above to get started.
    </p>
`;
