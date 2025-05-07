// DOM elements
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

let userName = "";
let language = "en";
let timerInterval = null;
let totalSeconds = 0;
let isPaused = true;

// Load time-of-day image
const hour = new Date().getHours();
introImage.src = hour < 12 ? "img/morning.jpg"
               : hour < 18 ? "img/afternoon.jpg"
               : "img/evening.jpg";

// Start app
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

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Language toggle
languageToggle.addEventListener('click', () => {
  language = language === "en" ? "de" : "en";
  updateLanguage();
});

function updateLanguage() {
  greeting.textContent = language === "en"
    ? "Welcome to the Coffee Calculator"
    : "Willkommen beim Kaffeerechner";
  document.querySelector('[data-i18n="choose_brew"]').textContent =
    language === "en"
      ? "Select a brew method to get started:"
      : "Wähle eine Brühmethode:";
}

// Show filter section
document.getElementById('filterIcon').addEventListener('click', () => {
  document.getElementById('espressoIcon').style.display = 'none';
  document.getElementById('filterIcon').style.margin = '0 auto';
  document.querySelector('.icon-container').style.justifyContent = 'center';
  iconSection.classList.remove('visible');
  filterSection.classList.remove('hidden');
  filterSection.classList.add('visible');
  backButton.classList.remove('hidden');
});

// Show espresso section
document.getElementById('espressoIcon').addEventListener('click', () => {
  document.getElementById('filterIcon').style.display = 'none';
  document.getElementById('espressoIcon').style.margin = '0 auto';
  document.querySelector('.icon-container').style.justifyContent = 'center';
  iconSection.classList.remove('visible');
  espressoSection.classList.remove('hidden');
  espressoSection.classList.add('visible');
  backButton.classList.remove('hidden');
});

// Back button
backButton.addEventListener('click', () => {
  filterSection.classList.remove('visible');
  espressoSection.classList.remove('visible');
  iconSection.classList.add('visible');
  backButton.classList.add('hidden');
  document.querySelectorAll('.icon-container img').forEach(img => {
    img.style.display = 'inline-block';
    img.style.margin = '';
  });
  document.querySelector('.icon-container').style.justifyContent = 'center';
});

// Reset app
resetButton.addEventListener('click', () => location.reload());

// Custom ratio toggle
document.getElementById('useCustomRatio').addEventListener('change', e => {
  document.getElementById('customRatio').classList.toggle('hidden', !e.target.checked);
});

// Shot quality slider label
const qualitySlider = document.getElementById('shotQuality');
const qualityLabel = document.getElementById('qualityLabel');
if (qualitySlider && qualityLabel) {
  qualitySlider.addEventListener('input', () => {
    const val = parseInt(qualitySlider.value);
    qualityLabel.textContent = val === 1 ? 'Sour' : val === 3 ? 'Bitter' : 'Balanced';
  });
}

// Filter calculation
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
  if (useCustom && customRatio.value) ratio = parseFloat(customRatio.value);
  else {
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
  localStorage.setItem('lastBrew', JSON.stringify({ output, time: now }));
}

// Espresso calculation
function calculateEspresso() {
  const dose = parseFloat(document.getElementById('espressoDose').value);
  const ratio = parseFloat(document.getElementById('espressoRatio').value);
  const time = parseFloat(document.getElementById('espressoTime').value);
  const yieldActual = parseFloat(document.getElementById('espressoYield').value);
  const quality = parseInt(document.getElementById('shotQuality').value);
  const qualityText = quality === 1 ? "Sour" : quality === 3 ? "Bitter" : "Balanced";
  const result = document.getElementById('espressoResult');
  const history = document.getElementById('previousEspresso');

  if (!isNaN(dose)) {
    const targetYield = dose * ratio;
    let output = `Hey ${userName}, your target yield is ${targetYield.toFixed(1)}g.`;
    if (!isNaN(time)) output += ` Shot time: ${time}s.`;
    if (!isNaN(yieldActual)) {
      const diff = yieldActual - targetYield;
      output += ` Actual yield: ${yieldActual}g. Difference: ${diff >= 0 ? '+' : ''}${diff.toFixed(1)}g.`;
    }
    output += ` Taste: ${qualityText}.`;

    result.innerHTML = output + "<br><em>Enjoy your coffee!</em>";

    const log = {
      dose,
      ratio,
      targetYield: targetYield.toFixed(1),
      actual: yieldActual || 'N/A',
      time: time || 'N/A',
      taste: qualityText,
      timestamp: new Date().toLocaleString()
    };

    localStorage.setItem('lastEspresso', JSON.stringify(log));
  } else {
    result.innerHTML = "Please enter a coffee dose.";
  }
}

// Load previous brews
window.addEventListener('DOMContentLoaded', () => {
  const last = JSON.parse(localStorage.getItem('lastBrew'));
  if (last) {
    const history = document.getElementById('filterHistory');
    if (history) {
      history.innerHTML += `<div>🕓 Last Saved – ${last.time}: ${last.output}</div>`;
    }
  }

  const lastEsp = JSON.parse(localStorage.getItem('lastEspresso'));
  if (lastEsp && document.getElementById('previousEspresso')) {
    document.getElementById('previousEspresso').innerHTML = `
      <strong>Previous Espresso:</strong><br>
      Dose: ${lastEsp.dose}g<br>
      Ratio: 1:${lastEsp.ratio}<br>
      Target Yield: ${lastEsp.targetYield}g<br>
      Actual Yield: ${lastEsp.actual}g<br>
      Time: ${lastEsp.time}s<br>
      Taste: ${lastEsp.taste}<br>
      Logged: ${lastEsp.timestamp}
    `;
  }
});

// Give dial-in grind advice
function giveDialAdvice(brewType) {
  const taste = document.getElementById('dialInTaste').value;
  const adviceBox = document.getElementById('dialAdvice');
  const summary = document.querySelector('.dial-summary');

  if (!taste) {
    adviceBox.textContent = "Please choose a flavour outcome first.";
    return;
  }

  const isEspresso = brewType === 'espresso';

  let summaryText = "";
  let advice = "";

  switch (taste) {
    case "sour":
      summaryText = "Sourness often means your grind is too coarse.";
      advice = isEspresso
        ? "Make the grind finer and increase shot time. Think: tightening a tap to control flow."
        : "Grind finer – like moving from gravel to sand. Slows the brew and boosts sweetness.";
      break;
    case "bitter":
      summaryText = "Bitterness usually means you're over-extracting.";
      advice = isEspresso
        ? "Grind coarser and reduce shot time or dose. Think: easing pressure in a hose."
        : "Go coarser – like shifting from flour to breadcrumbs. Speeds brew and removes harshness.";
      break;
    case "weak":
      summaryText = "A weak brew may need a tighter grind.";
      advice = isEspresso
        ? "Grind finer or increase dose. You need more resistance to slow extraction."
        : "Try a finer grind – imagine soaking water through a sponge. Finer grinds absorb more flavour.";
      break;
    case "balanced":
      summaryText = "If it tastes balanced – you're dialled in!";
      advice = "No adjustment needed. Log this and enjoy!";
      break;
  }

  summary.textContent = summaryText;
  adviceBox.textContent = advice;
}

// Timer
function startTimer() {
  const input = document.getElementById('timerInput');
  const display = document.getElementById('timerDisplay');
  const bell = document.getElementById('bellSound');

  if (input.value && totalSeconds === 0) {
    totalSeconds = parseInt(input.value, 10);
    display.textContent = formatTime(totalSeconds);
  }

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
  totalSeconds = 0;
  document.getElementById('timerDisplay').textContent = "00:00";
  document.getElementById('timerInput').value = "";
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}
