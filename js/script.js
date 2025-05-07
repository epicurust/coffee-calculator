const greeting = document.getElementById('greeting');
const nameInput = document.getElementById('nameInput');
const startButton = document.getElementById('startButton');
const nameBlock = document.getElementById('nameBlock');
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

// START BUTTON LOGIC
startButton.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) return;

  userName = name;
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  greeting.innerHTML = `
    <span class="caps-title">${timeGreeting.toUpperCase()}</span><br>
    <span class="script-title">${userName}</span>
  `;

  introImage.classList.add('fade-out');
  introImage.addEventListener('transitionend', () => {
    imageContainer.style.display = 'none';
    iconSection.classList.remove('hidden');
    iconSection.classList.add('visible');
  }, { once: true });

  nameBlock.classList.add('hide');
  resetButton.classList.remove('hidden');
});

// ICON SELECTION LOGIC
document.getElementById('filterIcon').addEventListener('click', () => {
  document.getElementById('espressoIcon').style.display = 'none';
  document.getElementById('filterIcon').style.margin = '0 auto';
  document.querySelector('.icon-container').style.justifyContent = 'center';
  iconSection.classList.remove('visible');
  filterSection.classList.remove('hidden');
  filterSection.classList.add('visible');
  backButton.classList.remove('hidden');
});

document.getElementById('espressoIcon').addEventListener('click', () => {
  document.getElementById('filterIcon').style.display = 'none';
  document.getElementById('espressoIcon').style.margin = '0 auto';
  document.querySelector('.icon-container').style.justifyContent = 'center';
  iconSection.classList.remove('visible');
  espressoSection.classList.remove('hidden');
  espressoSection.classList.add('visible');
  backButton.classList.remove('hidden');
});

backButton.addEventListener('click', () => {
  filterSection.classList.remove('visible');
  espressoSection.classList.remove('visible');
  iconSection.classList.add('visible');
  backButton.classList.add('hidden');
  document.getElementById('filterIcon').style.display = 'inline-block';
  document.getElementById('espressoIcon').style.display = 'inline-block';
  document.getElementById('filterIcon').style.margin = '';
  document.getElementById('espressoIcon').style.margin = '';
  document.querySelector('.icon-container').style.justifyContent = 'center';
});

// RESET
resetButton.addEventListener('click', () => location.reload());

// DARK MODE
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// LANGUAGE TOGGLE
languageToggle.addEventListener('click', () => {
  language = language === "en" ? "de" : "en";
  updateLanguage();
});

function updateLanguage() {
  greeting.innerHTML = language === "en"
    ? `<span class="caps-title">LETS MAKE SOME</span><br><span class="script-title">Coffee</span>`
    : `<span class="caps-title">LOS GEHT'S</span><br><span class="script-title">Kaffee</span>`;

  document.querySelector('[data-i18n="choose_brew"]').textContent =
    language === "en"
      ? "Select a brew method to get started:"
      : "Wähle eine Brühmethode:";
}

// CUSTOM RATIO TOGGLE
document.getElementById('useCustomRatio').addEventListener('change', e => {
  document.getElementById('customRatio').classList.toggle('hidden', !e.target.checked);
});

// SHOT QUALITY SLIDER
const qualitySlider = document.getElementById('shotQuality');
const qualityLabel = document.getElementById('qualityLabel');
if (qualitySlider && qualityLabel) {
  qualitySlider.addEventListener('input', () => {
    const val = parseInt(qualitySlider.value);
    qualityLabel.textContent = val === 1 ? 'Sour' : val === 3 ? 'Bitter' : 'Balanced';
  });
}

// ROAST & TYPE ADVICE
function giveRoastAndTypeAdvice(roastId, typeId, targetId, isEspresso = false) {
  const roast = document.getElementById(roastId).value;
  const type = document.getElementById(typeId).value;
  const output = document.getElementById(targetId);

  let msg = "";

  if (roast === "dark") {
    msg += isEspresso
      ? "Darker roasts take up more space in the portafilter and can taste more intense. Try 16g instead of 18g for balance."
      : "Dark roasts are more soluble — a slightly lower dose may improve clarity.";
    msg += " But if you love it strong, trust your taste!";
  } else {
    msg += "Light roasts can be harder to extract — you may need a higher dose and finer grind.";
  }

  msg += type === "single"
    ? " Single origins highlight subtle flavours — precise grind helps."
    : " Blends are forgiving and built for consistency.";

  output.textContent = msg;
}

document.getElementById('roastLevel').addEventListener('change', () => {
  giveRoastAndTypeAdvice('roastLevel', 'coffeeType', 'roastAdvice', false);
});
document.getElementById('coffeeType').addEventListener('change', () => {
  giveRoastAndTypeAdvice('roastLevel', 'coffeeType', 'roastAdvice', false);
});
document.getElementById('espressoRoastLevel').addEventListener('change', () => {
  giveRoastAndTypeAdvice('espressoRoastLevel', 'espressoCoffeeType', 'espressoRoastAdvice', true);
});
document.getElementById('espressoCoffeeType').addEventListener('change', () => {
  giveRoastAndTypeAdvice('espressoRoastLevel', 'espressoCoffeeType', 'espressoRoastAdvice', true);
});

// WATER TEMP FEEDBACK
document.getElementById('waterTemp').addEventListener('input', () => {
  const temp = parseFloat(document.getElementById('waterTemp').value);
  const feedback = document.getElementById('tempFeedback');
  if (isNaN(temp)) return feedback.textContent = "";
  feedback.textContent =
    temp < 88 ? "Too cool — may under-extract." :
    temp > 96 ? "Very hot — could extract bitterness." :
    "Perfect temp range.";
});

document.getElementById('espressoWaterTemp').addEventListener('input', () => {
  const temp = parseFloat(document.getElementById('espressoWaterTemp').value);
  const feedback = document.getElementById('espressoTempFeedback');
  if (isNaN(temp)) return feedback.textContent = "";
  feedback.textContent =
    temp < 88 ? "Too cool — espresso may be sour." :
    temp > 96 ? "Very hot — could extract bitterness." :
    "Looks good.";
});

// TIMER
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
