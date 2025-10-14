// ==================== Footer Section ====================
const today = new Date();
const thisYear = today.getFullYear();
const footer = document.querySelector("footer");
const copyright = document.createElement("p");
copyright.innerHTML = `© ${thisYear} Riah Johnson`;
footer.appendChild(copyright);
footer.classList.add("footer");
copyright.classList.add("copyright");

// ==================== Dark Mode Toggle ====================
const themeToggle = document.getElementById("toggle-theme");
const body = document.body;
const nav = document.querySelector("nav");

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
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

// ==================== Weather Section ====================
const tempBtn = document.getElementById("temp-btn");
const conditionBtn = document.getElementById("condition-btn");
const outputDiv = document.getElementById("weather-data");
const weatherBtn = document.querySelector(".weather-toggle");
const weatherContainer = document.querySelector(".weather-container");

let latitude, longitude;

function getLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
        callback(); // run whatever you need after coords load
      },
      () => {
        outputDiv.innerHTML = `<p>Location access denied. Showing Dallas weather as fallback.</p>`;
        latitude = 32.7767;
        longitude = -96.7970;
        callback();
      }
    );
  } else {
    outputDiv.innerHTML = `<p>Geolocation not supported. Showing Dallas weather as fallback.</p>`;
    latitude = 32.7767;
    longitude = -96.7970;
    callback();
  }
}


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
  
  if (condition.includes("clear")) emoji.textContent = "☀️";
  else if (condition.includes("mainly clear")) emoji.textContent = "🌤️";
  else if (condition.includes("partly cloudy")) emoji.textContent = "⛅";
  else if (condition.includes("overcast")) emoji.textContent = "☁️";
  else if (condition.includes("fog")) emoji.textContent = "🌫️";
  else if (condition.includes("drizzle")) emoji.textContent = "🌦️";
  else if (condition.includes("rain")) emoji.textContent = "🌧️";
  else if (condition.includes("snow")) emoji.textContent = "❄️";
  else if (condition.includes("thunderstorm")) emoji.textContent = "⛈️";
  else emoji.textContent = "🌈"; // fallback
}


tempBtn.addEventListener("click", () => {
  getLocation(() => {
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
});

conditionBtn.addEventListener("click", () => {
  getLocation(() => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
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

// ==================== Starfield Animation ====================
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
const floatingThemeToggle = document.getElementById("toggle-theme");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let stars = [];
let shootingStars = [];
let bursts = [];
function generateStars() {
  stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.3 + 0.1,
    color: ["#ffffff", "#ff66cc", "#aaff00"][Math.floor(Math.random() * 3)]
  }));
}
generateStars();

// animation control
let animationId;
function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
    ctx.fillStyle = star.color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = star.color;
    ctx.fill();
    star.y += star.speed;
    if (star.y > canvas.height) star.y = 0;
  });
  animationId = requestAnimationFrame(animateStars);
}

function startStars() {
  if (!animationId) {
    generateStars();
    canvas.style.display = "block";
    animateStars();
    canvas.classList.add("active");
  }
}

function stopStars() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = "none";
    canvas.classList.remove("active"); 
  }
}

function spawnShootingStar() {
  const startX = Math.random() * canvas.width;
  const startY = Math.random() * canvas.height / 2;
  const length = Math.random() * 100 + 50;
  const speed = Math.random() * 8 + 4;
  const color = Math.random() < 0.5 ? "#ffa500" : "#ffff66"; // orange or yellow
  shootingStars.push({ x: startX, y: startY, length, speed, color });
}

// inside your animateStars function, after drawing regular stars:
function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // regular stars
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
    ctx.fillStyle = star.color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = star.color;
    ctx.fill();
    star.y += star.speed;
    if (star.y > canvas.height) star.y = 0;
  });

  // shooting stars
  shootingStars.forEach((star, index) => {
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(star.x + star.length, star.y + star.length * 0.3);
    ctx.strokeStyle = star.color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = star.color;
    ctx.stroke();

    star.x += star.speed;
    star.y += star.speed * 0.3;

    if (star.x > canvas.width || star.y > canvas.height) {
      shootingStars.splice(index, 1);
    }
  });

  // bursts
bursts.forEach((burst, i) => {
  ctx.beginPath();
  ctx.arc(burst.x, burst.y, burst.size, 0, 2 * Math.PI);
  ctx.fillStyle = burst.color;
  ctx.shadowBlur = 8;
  ctx.shadowColor = burst.color;
  ctx.fill();

  burst.life -= 1;
  burst.size *= .5;
  if (burst.life <= 0) bursts.splice(i, 1); // remove when dead
});

  animationId = requestAnimationFrame(animateStars);
}

function spawnBurst(x, y) {
  bursts.push({
    x,
    y,
    size: Math.random() * 3 + 2,
    life: 20,
    color: ["#dcd242ff", "#c983e1ff", "#ff5e00ff"][Math.floor(Math.random() * 3)] // galaxy colors
  });
}

// spawn shooting stars randomly
setInterval(() => {
  if (Math.random() < 0.05) { 
    spawnShootingStar();
  }
}, 1000);

setInterval(() => {
  if (Math.random() < 0.03) { // 3% chance per interval
    spawnBurst(Math.random() * canvas.width, Math.random() * canvas.height / 2);
  }
}, 800); // every 0.8 seconds

// 🌙 Handle toggle (no double dark-mode toggle)
floatingThemeToggle.addEventListener("change", () => {
  const darkModeActive = floatingThemeToggle.checked;
  if (darkModeActive) {
    startStars();
  } else {
    stopStars();
  }
});

window.addEventListener("load", () => {
  const popup = document.getElementById("welcome-popup");
  const closeBtn = document.getElementById("close-popup");

  setTimeout(() => {
    popup.classList.add("active"); // fades in using CSS
  }, 1000);

  closeBtn.addEventListener("click", () => {
    popup.classList.remove("active"); // fades out
    // optional: hide after transition ends
    setTimeout(() => {
      popup.style.display = "none";
    }, 400); // match the transition duration
  });
});