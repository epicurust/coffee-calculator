// Element references
const greeting = document.getElementById('greeting');
const nameInput = document.getElementById('nameInput');
const startButton = document.getElementById('startButton');
const introImage = document.getElementById('introImage');
const imageContainer = document.getElementById('imageContainer');
const iconSection = document.getElementById('iconSection');
const filterSection = document.getElementById('filter');
const espressoSection = document.getElementById('espresso');
const backButton = document.getElementById('backButton');
const resetButton = document.getElementById('resetButton');
const darkModeToggle = document.getElementById('darkModeToggle');
const languageToggle = document.getElementById('languageToggle');

// Global state
let userName = "";
let language = "en"; // default language
let timerInterval = null;
let totalSeconds = 180; // default 3:00
let isPaused = true;

// Set intro image based on time
const hour = new Date().getHours();
if (hour < 12) {
  introImage.src = "img/morning.jpg";
} else if (hour < 18) {
  introImage.src = "img/afternoon.jpg";
} else {
  introImage.src = "img/evening.jpg";
}

// Event: Start app
startButton.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) return;

  userName = name;
  greeting.textContent = `Hello, ${userName}!`;

  introImage.classList.add('fade-out');
  introImage.addEventListener('transitionend', () => {
    imageContainer.style.display = 'none';
    iconSection.classList.remove('hidden');
    iconSection.classList.add('visible');
  }, { once: true });

  nameInput.style.display = 'none';
  startButton.style.display = 'none';
  darkModeToggle.style.display = 'inline-block';
  languageToggle.style.display = 'inline-block';
  resetButton.classList.remove('hidden');
});

// Event: Icon click - filter
document.getElementById('filterIcon').addEventListener('click', () => {
  document.getElementById('espressoIcon').style.display = 'none';
  document.getElementById('filterIcon').style.margin = '0 auto';

  iconSection.classList.remove('visible');
  filterSection.classList.remove('hidden');
  filterSection.classList.add('visible');
  backButton.classList.remove('hidden');
});

// Event: Icon click - espresso
document.getElementById('espressoIcon').addEventListener('click', () => {
  document.getElementById('filterIcon').style.display = 'none';
  document.getElementById('espressoIcon').style.margin = '0 auto';

  iconSection.classList.remove('visible');
  espressoSection.classList.remove('hidden');
  espressoSection.classList.add('visible');
  backButton.classList.remove('hidden');
});

// Event: Back to brew method selection
backButton.addEventListener('click', () => {
  filterSection.classList.remove('visible');
  espressoSection.classList.remove('visible');
  iconSection.classList.add('visible');
  backButton.classList.add('hidden');

  // Reset icons
  document.getElementById('filterIcon').style.display = 'inline-block';
  document.getElementById('espressoIcon').style.display = 'inline-block';
  document.getElementById('filterIcon').style.margin = '';
  document.getElementById('espressoIcon').style.margin = '';
});

// Event: Reset app to start
resetButton.addEventListener('click', () => {
  location.reload();
});

// Event: Dark mode toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Event: Language toggle
languageToggle.addEventListener('click', () => {
  language = language === "en" ? "de" : "en";
  updateLanguage();
});

function updateLanguage() {
  greeting.textContent = language === "en" ? `Welcome to the Coffee Calculator` : `Willkommen beim Kaffeerechner`;
  document.querySelector('[data-i18n="choose_brew"]').textContent = language === "en" ? "Select a brew method to get started:" : "Wähle eine Brühmethode:";
}

// FILTER CALCULATION
function calculateFilter() {
  const coffee = parseFloat(document.getElementById('filterCoffee').value);
  const water = parseFloat(document.getElementById('filterWater').value);
  const people = parseFloat(document.getElementById('filterPeople').value);
  const customRatio = document.getElementById('customRatio');
  const useCustom = document.getElementById('useCustomRatio').checked;
  const flavour = document.getElementById('flavourProfile').value;
  const result = document.getElementById('filterResult');
  const history = document.getElementById('filterHistory');

  let ratio = 60;
  if (useCustom && customRatio.value) {
    ratio = parseFloat(customRatio.value);
  } else {
    if (flavour === "light") ratio = 55;
    if (flavour === "balanced") ratio = 60;
    if (flavour === "syrupy") ratio = 65;
    if (flavour === "bold") ratio = 70;
  }

  let output = "";

  if (!isNaN(people)) {
    const targetYield = people * 250;
    const totalWater = targetYield / 0.7;
    const neededCoffee = totalWater * (ratio / 1000);
    output = `Hey ${userName}, for ${people} people: use ${neededCoffee.toFixed(1)}g coffee and ${totalWater.toFixed(0)}g water.`;
  } else if (!isNaN(coffee)) {
    const totalWater = (coffee / ratio) * 1000;
    const yieldInCup = totalWater - (coffee * 2);
    output = `Hey ${userName}, with ${coffee}g coffee: use ${totalWater.toFixed(0)}g water. Estimated yield: ${yieldInCup.toFixed(0)}g.`;
  } else if (!isNaN(water)) {
    const neededCoffee = (water / 1000) * ratio;
    const yieldInCup = water - (neededCoffee * 2);
    output = `Hey ${userName}, with ${water}g water: use ${neededCoffee.toFixed(1)}g coffee. Estimated yield: ${yieldInCup.toFixed(0)}g.`;
  } else {
    output = "Please enter coffee, water, or number of people.";
  }

  result.innerHTML = output + `<br><em>Enjoy your coffee!</em><br><a href="https://www.beanz.com/en-gb" target="_blank">☕ Recommended Coffees on Beanz.com</a>`;
  const now = new Date().toLocaleTimeString();
  history.innerHTML += `<div>🕓 ${now} – ${output}</div>`;

  // Save to localStorage
  localStorage.setItem('lastBrew', JSON.stringify({ output, time: now }));
}

// ESPRESSO CALCULATION
function calculateEspresso() {
  const dose = parseFloat(document.getElementById('espressoDose').value);
  const ratio = parseFloat(document.getElementById('espressoRatio').value);
  const result = document.getElementById('espressoResult');

  if (!isNaN(dose)) {
    const yieldAmount = dose * ratio;
    const output = `Hey ${userName}, your target yield is ${yieldAmount.toFixed(1)}g.`;
    result.innerHTML = output + "<br><em>Enjoy your coffee!</em>";
    localStorage.setItem('lastBrew', JSON.stringify({ output, time: new Date().toLocaleTimeString() }));
  } else {
    result.innerHTML = "Please enter a coffee dose.";
  }
}

// Custom ratio toggle logic
document.getElementById('useCustomRatio').addEventListener('change', e => {
  const input = document.getElementById('customRatio');
  input.classList.toggle('hidden', !e.target.checked);
});

// Load last brew on page load
window.addEventListener('DOMContentLoaded', () => {
  const last = JSON.parse(localStorage.getItem('lastBrew'));
  if (last) {
    const history = document.getElementById('filterHistory');
    history.innerHTML += `<div>🕓 Last Saved – ${last.time}: ${last.output}</div>`;
  }
});


// TIMER LOGIC
function startTimer() {
  const display = document.getElementById('timerDisplay');
  const bell = document.getElementById('bellSound');

  if (!isPaused) return;

  isPaused = false;
  timerInterval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      bell.play();
      return;
    }
    totalSeconds--;
    display.textContent = formatTime(totalSeconds);
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isPaused = true;
}

function resetTimer() {
  pauseTimer();
  totalSeconds = 180;
  document.getElementById('timerDisplay').textContent = formatTime(totalSeconds);
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}
