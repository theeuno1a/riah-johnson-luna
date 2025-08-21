// ==================== Footer Section ====================
const today = new Date();
const thisYear = today.getFullYear();
const footer = document.querySelector("footer");
const copyright = document.createElement("p");
copyright.innerHTML = `© ${thisYear} Riah Johnson`;
footer.appendChild(copyright);
footer.classList.add("footer");
copyright.classList.add("copyright");

// ==================== Skills Section ====================
const skills = [
  "HTML",
  "Basic Networking",
  "CSS",
  "Google IT Support Certified",
  "CompTIA Tech+ Certified",
  "Google Project Management Certified",
  "JavaScript (Beginner)"
];

const skillsSection = document.getElementById("Skills");
const skillsLists = skillsSection.querySelectorAll("ul.skills-list");

// Add TECH & PROGRAMMING skills to first list
skills.forEach(skill => {
  const li = document.createElement("li");
  li.innerText = skill;
  skillsLists[0].appendChild(li);
});

// ==================== Dark Mode Toggle ====================
const toggle = document.getElementById("toggle-theme");
const body = document.body;
const nav = document.querySelector("nav");

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    body.classList.replace("light-mode", "dark-mode");
    nav.classList.replace("light-mode", "dark-mode");
  } else {
    body.classList.replace("dark-mode", "light-mode");
    nav.classList.replace("dark-mode", "light-mode");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  body.classList.add("light-mode");
  nav.classList.add("light-mode");
});

// ==================== GitHub Repos ====================
fetch("https://api.github.com/users/theeuno1a/repos")
  .then(res => res.json())
  .then(repos => {
    const projectList = document.getElementById("projects-list");
      repos.forEach(repo => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = repo.html_url;
      link.textContent = repo.name;
      link.target = "_blank";
      li.appendChild(link);
      projectList.appendChild(li);
    });

  })
  .catch(err => console.error("Error fetching repos:", err));

// ==================== Weather Section ====================
const tempBtn = document.getElementById("temp-btn");
const conditionBtn = document.getElementById("condition-btn");
const outputDiv = document.getElementById("weather-data");
const weatherBtn = document.querySelector(".weather-toggle");
const weatherContainer = document.querySelector(".weather-container");

const latitude = 32.7767;
const longitude = -96.7970;

function cToF(c) {
  return (c * 9 / 5 + 32).toFixed(1);
}

// Emoji element
let emoji = document.getElementById("weather-emoji");
if (!emoji) {
  emoji = document.createElement("div");
  emoji.id = "weather-emoji";
  emoji.style.fontSize = "3rem";
  emoji.style.marginBottom = "10px";
  emoji.classList.add("weather-emoji");
  weatherContainer.prepend(emoji);
}

function getWeatherDescription(code) {
  const codes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    61: "Light rain",
    71: "Light snow",
    95: "Thunderstorm"
  };
  return codes[code] || "Unknown";
}

function updateWeatherEmoji(code) {
  const condition = getWeatherDescription(code).toLowerCase();
  if (condition.includes("rain") || condition.includes("drizzle")) emoji.textContent = "🌧️";
  else if (condition.includes("cloud")) emoji.textContent = "☁️";
  else if (condition.includes("sun") || condition.includes("clear")) emoji.textContent = "☀️";
  else if (condition.includes("snow")) emoji.textContent = "❄️";
  else emoji.textContent = "🌈";
}

tempBtn.addEventListener("click", () => {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      const tempC = data.current_weather.temperature;
      const tempF = cToF(tempC);
      const code = data.current_weather.weathercode;
      outputDiv.innerHTML = `<p>Current Temperature:<br><strong>${tempC}°C / ${tempF}°F</strong></p>`;
      updateWeatherEmoji(code);
    })
    .catch(() => {
      outputDiv.innerHTML = `<p>Error loading temperature data</p>`;
      emoji.textContent = "🌈";
    });
});

conditionBtn.addEventListener("click", () => {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code`)
    .then(res => res.json())
    .then(data => {
      const code = data.current_weather.weathercode;
      const description = getWeatherDescription(code);
      outputDiv.innerHTML = `<p>Current Condition:<br><strong>${description}</strong></p>`;
      updateWeatherEmoji(code);
    })
    .catch(() => {
      outputDiv.innerHTML = `<p>Error loading weather condition</p>`;
      emoji.textContent = "🌈";
    });
});

weatherBtn.addEventListener("click", () => {
  weatherContainer.classList.toggle("open");
});

// ==================== Scroll to Top Button ====================
const scrollBtn = document.getElementById("scrollTopBtn");

window.onscroll = () => {
  scrollBtn.style.display = (document.documentElement.scrollTop > 100) ? "block" : "none";
};

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    panel.style.backgroundColor = "#222";
    panel.style.color = "#fff";
  } else {
    panel.style.backgroundColor = "#fff";
    panel.style.color = "#000";
  }
}

// ==================== Mobile Nav Toggle ====================
 const navToggle = document.querySelector(".nav-toggle");
const navList = document.querySelector(".nav-list");

navToggle.addEventListener("click", () => {
  navList.classList.toggle("open"); // matches CSS
});
