// ==================== Footer Section ====================
const today = new Date();
const thisYear = today.getFullYear();
const footer = document.querySelector("footer");
if (footer) {
  const copyright = document.createElement("p");
  copyright.innerHTML = `© ${thisYear} Riah Johnson`;
  footer.appendChild(copyright);
  footer.classList.add("footer");
  copyright.classList.add("copyright");
}

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
const themeToggle = document.getElementById("toggle-theme");
const body = document.body;
const nav = document.querySelector("nav");

if (themeToggle && body && nav) {
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
}

// ==================== GitHub Repos ====================
const projectList = document.getElementById("projects-list");
if (projectList) {
  fetch("https://api.github.com/users/theeuno1a/repos")
    .then(res => res.json())
    .then(repos => {
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
}

// ==================== Weather Section ====================
const tempBtn = document.getElementById("temp-btn");
const conditionBtn = document.getElementById("condition-btn");
const outputDiv = document.getElementById("weather-data");
const weatherBtn = document.querySelector(".weather-toggle");
const weatherContainer = document.querySelector(".weather-container");

if (tempBtn && conditionBtn && outputDiv && weatherBtn && weatherContainer) {
  let latitude, longitude;

  function getLocation(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          latitude = pos.coords.latitude;
          longitude = pos.coords.longitude;
          callback();
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
    else emoji.textContent = "🌈"; 
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
}

// ==================== Scroll to Top Button ====================
const scrollBtn = document.getElementById("scrollTopBtn");
if (scrollBtn) {
  window.onscroll = () => {
    scrollBtn.style.display = (document.documentElement.scrollTop > 100) ? "block" : "none";
  };

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ==================== Mobile Nav Toggle ====================
const navToggle = document.querySelector(".nav-toggle");
const navList = document.querySelector(".nav-list");

if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    navList.classList.toggle("open"); 
  });
}

// ==================== Starfield Animation ====================
const canvas = document.getElementById("starfield");
const ctx = canvas?.getContext("2d");
const floatingThemeToggle = document.getElementById("toggle-theme");

if (canvas && ctx) {
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

      if (star.x > canvas.width || star.y > canvas.height) shootingStars.splice(index, 1);
    });

    bursts.forEach((burst, i) => {
      ctx.beginPath();
      ctx.arc(burst.x, burst.y, burst.size, 0, 2 * Math.PI);
      ctx.fillStyle = burst.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = burst.color;
      ctx.fill();

      burst.life -= 1;
      burst.size *= .5;
      if (burst.life <= 0) bursts.splice(i, 1);
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
    const color = Math.random() < 0.5 ? "#ffa500" : "#ffff66"; 
    shootingStars.push({ x: startX, y: startY, length, speed, color });
  }

  function spawnBurst(x, y) {
    bursts.push({
      x,
      y,
      size: Math.random() * 3 + 2,
      life: 20,
      color: ["#dcd242ff", "#c983e1ff", "#ff5e00ff"][Math.floor(Math.random() * 3)]
    });
  }

  setInterval(() => {
    if (Math.random() < 0.05) spawnShootingStar();
  }, 1000);

  setInterval(() => {
    if (Math.random() < 0.03) spawnBurst(Math.random() * canvas.width, Math.random() * canvas.height / 2);
  }, 800);

  if (floatingThemeToggle) {
    floatingThemeToggle.addEventListener("change", () => {
      const darkModeActive = floatingThemeToggle.checked;
      if (darkModeActive) startStars();
      else stopStars();
    });
  }
}
// ==================== Welcome Popup ====================
  const popup = document.getElementById('welcome-popup');
  const closeBtn = document.getElementById('close-popup');

  // close popup on button click
  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  // open popup when page loads
  window.addEventListener('load', () => {
    popup.style.display = 'block';
  });

