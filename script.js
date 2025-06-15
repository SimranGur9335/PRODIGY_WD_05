const apiKey = "Y89G9CPAB64ACZTTYSXXJ2MJR"; // Replace with your actual Visual Crossing API key
let unit = "metric"; // or "us"
let lang = "en";

// Update clock every second
setInterval(() => {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
}, 1000);

// Event listeners
document.getElementById("unitToggle").addEventListener("click", () => {
  unit = unit === "us" ? "metric" : "us";
  document.getElementById("unitToggle").textContent = unit === "us" ? "°F" : "°C";
  getWeather(); // Refresh with new unit
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  document.getElementById("themeToggle").textContent = 
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});

document.getElementById("languageSelect").addEventListener("change", (e) => {
  lang = e.target.value;
  getWeather(); // Refresh with selected language
});

// Weather fetch
async function getWeather() {
  const searchInput = document.getElementById("searchInput").value || "Pune";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(searchInput)}?unitGroup=${unit}&key=${apiKey}&contentType=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    document.getElementById("cityName").textContent = data.resolvedAddress;
    const current = data.currentConditions;
    const temperature = current.temp;
    const condition = current.conditions;
    const uv = current.uvindex;

    document.getElementById("temperature").textContent = `${temperature}° ${unit === "us" ? "F" : "C"}`;
    document.getElementById("weatherCondition").textContent = condition;
    document.getElementById("uvIndex").textContent = `UV Index: ${uv}`;

    // Suggestions
    const umbrella = condition.toLowerCase().includes("rain") ? "☂ Don't forget your umbrella!" : "";
    let advice = "";
    if (temperature < 10) advice = "🧥 Wear a warm jacket!";
    else if (temperature < 20) advice = "🧦 Light sweater should be fine.";
    else if (temperature < 30) advice = "👕 Stay light and hydrated.";
    else advice = "🧴 Stay indoors or use sunscreen!";

    document.getElementById("umbrellaReminder").textContent = umbrella;
    document.getElementById("advice").textContent = advice;

    // 5-Day Forecast
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const day = data.days[i];
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${new Date(day.datetime).toDateString().slice(0, 10)}</strong><br/>
        🌡️ ${day.temp}°<br/>
        ☁️ ${day.conditions}
      `;
      forecastContainer.appendChild(div);
    }

  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Could not fetch weather. Please check your input or try again later.");
  }
}

// Initial fetch
getWeather();
