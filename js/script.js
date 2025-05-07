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

// Start button logic with contextual greeting
startButton.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) return;

  userName = name;

  const hour = new Date().getHours();
  const timeGreeting = hour < 12
    ? "Good morning"
    : hour < 18
    ? "Good afternoon"
    : "Good evening";

  greeting.textContent = `${timeGreeting}, ${userName}!`;

  introImage.classList.add('fade-out');
  introImage.addEventListener('transitionend', () => {
    imageContainer.style.display = 'none';
    iconSection.classList.remove('hidden');
    iconSection.classList.add('visible');
  }, { once: true });

  nameInput.classList.add('hide');
  startButton.classList.add('hide');
  darkModeToggle.style.display = 'inline-block';
  languageToggle.style.display = 'inline-block';
  resetButton.classList.remove('hidden');
});

// Icon click logic
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
  document.querySelectorAll('.icon-container img').forEach(img => {
    img.style.display = 'inline-block';
    img.style.margin = '';
  });
  document.querySelector('.icon-container').style.justifyContent = 'center';
});

resetButton.addEventListener('click', () => location.reload());

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

languageToggle.addEventListener('click', () => {
  language = language === "en" ? "de" : "en";
  updateLanguage();
});

function updateLanguage() {
  greeting.textContent = language === "en"
    ? `Let's make some coffee`
    : `Lass uns Kaffee machen`;
  document.querySelector('[data-i18n="choose_brew"]').textContent =
    language === "en"
      ? "Select a brew method to get started:"
      : "Wähle eine Brühmethode:";
}

// Roast and coffee type advice logic
function giveRoastAndTypeAdvice(roastId, typeId, targetId, isEspresso = false) {
  const roast = document.getElementById(roastId).value;
  const type = document.getElementById(typeId).value;
  const output = document.getElementById(targetId);

  let msg = "";

  if (roast === "dark") {
    msg += isEspresso
      ? "Darker roasts tend to take up more space in the portafilter and can taste more intense. You might consider starting with 16g instead of 18g for a more balanced shot."
      : "Dark roasts are more soluble. A slightly lower dose can improve clarity and balance.";
    msg += " That said, if you enjoy it strong — trust your taste and keep doing what works!";
  } else {
    msg += "Light roasts can be harder to extract. A higher dose and finer grind are often needed to bring out sweetness.";
  }

  if (type === "single") {
    msg += " Single origins tend to highlight subtle flavours, so adjusting grind and dose can really showcase their character.";
  } else if (type === "blend") {
    msg += " Blends are usually built for consistency, so use what’s comfortable — they’re forgiving.";
  }

  output.textContent = msg;
}

// Attach roast/type change events
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

// Water temperature feedback
document.getElementById('waterTemp').addEventListener('input', () => {
  const temp = parseFloat(document.getElementById('waterTemp').value);
  const feedback = document.getElementById('tempFeedback');
  if (isNaN(temp)) return feedback.textContent = "";
  if (temp < 88) feedback.textContent = "Too cool — may under-extract.";
  else if (temp > 96) feedback.textContent = "Very hot — could extract bitterness.";
  else feedback.textContent = "Perfect temp range.";
});

document.getElementById('espressoWaterTemp').addEventListener('input', () => {
  const temp = parseFloat(document.getElementById('espressoWaterTemp').value);
  const feedback = document.getElementById('espressoTempFeedback');
  if (isNaN(temp)) return feedback.textContent = "";
  if (temp < 88) feedback.textContent = "Too cool — espresso may be sour.";
  else if (temp > 96) feedback.textContent = "Very hot — could extract bitterness.";
  else feedback.textContent = "Looks good.";
});

// Shot quality slider
const qualitySlider = document.getElementById('shotQuality');
const qualityLabel = document.getElementById('qualityLabel');
if (qualitySlider && qualityLabel) {
  qualitySlider.addEventListener('input', () => {
    const val = parseInt(qualitySlider.value);
    qualityLabel.textContent = val === 1 ? 'Sour' : val === 3 ? 'Bitter' : 'Balanced';
  });
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
