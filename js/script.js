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
let language = "EN";
let timerInterval = null;
let totalSeconds = 0;
let isPaused = true;

// Start Button Click
startButton.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) return;

  userName = name;
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  greeting.innerHTML = `
    <span class="caps-title">${timeGreeting.toUpperCase()}</span>
    <h1 class="script-title">${userName}</h1>
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

// Toggle Dark Mode
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Toggle Language
languageToggle.addEventListener('click', () => {
  language = language === "EN" ? "DE" : "EN";

  const subtitle = language === "EN" ? "LET'S MAKE" : "LASS UNS MACHEN";
  const title = language === "EN" ? "Coffee" : "Kaffee";
  const placeholder = language === "EN" ? "What's your name?" : "Wie heißt du?";
  const buttonText = language === "EN" ? "Start" : "Starten";

  document.querySelector('.caps-title').textContent = subtitle;
  document.querySelector('.script-title').textContent = title;
  nameInput.placeholder = placeholder;
  startButton.textContent = buttonText;
});

// Icon Selection
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

resetButton.addEventListener('click', () => location.reload());
// Roast + Coffee Type Advice
function giveRoastAndTypeAdvice(roastId, typeId, targetId, isEspresso = false) {
  const roast = document.getElementById(roastId).value;
  const type = document.getElementById(typeId).value;
  const output = document.getElementById(targetId);
  let msg = "";

  if (roast === "dark") {
    msg += isEspresso
      ? "Darker roasts take up more space and can be overpowering. Try 16g instead of 18g for a more balanced shot."
      : "Dark roasts are more soluble — a lower dose can help avoid bitterness.";
    msg += " But if you love it strong, trust your taste!";
  } else {
    msg += "Light roasts often need a finer grind and higher dose to extract sweetness.";
  }

  msg += type === "single"
    ? " Single origins are delicate — dial-in slowly."
    : " Blends are built for balance — use what’s comfortable.";

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

// Water Temp Feedback
function setupTempFeedback(inputId, outputId, lower, upper, tooLowMsg, tooHighMsg, goodMsg) {
  const input = document.getElementById(inputId);
  const output = document.getElementById(outputId);

  input.addEventListener('input', () => {
    const val = parseFloat(input.value);
    if (isNaN(val)) {
      output.textContent = "";
    } else if (val < lower) {
      output.textContent = tooLowMsg;
    } else if (val > upper) {
      output.textContent = tooHighMsg;
    } else {
      output.textContent = goodMsg;
    }
  });
}

setupTempFeedback("waterTemp", "tempFeedback", 88, 96,
  "Too cool — may under-extract.",
  "Very hot — could extract bitterness.",
  "Perfect temp range.");

setupTempFeedback("espressoWaterTemp", "espressoTempFeedback", 88, 96,
  "Too cool — espresso may be sour.",
  "Very hot — could extract bitterness.",
  "Looks good.");

// Shot Quality Slider
const qualitySlider = document.getElementById('shotQuality');
const qualityLabel = document.getElementById('qualityLabel');
if (qualitySlider && qualityLabel) {
  qualitySlider.addEventListener('input', () => {
    const val = parseInt(qualitySlider.value);
    qualityLabel.textContent = val === 1 ? 'Sour' : val === 3 ? 'Bitter' : 'Balanced';
  });
}

// FILTER Calculator
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
    output = `For ${people} people: use ${neededCoffee.toFixed(1)}g coffee and ${totalWater.toFixed(0)}g water.`;
  } else if (!isNaN(coffee)) {
    const totalWater = (coffee / ratio) * 1000;
    const yieldInCup = totalWater - (coffee * 2);
    output = `With ${coffee}g coffee: use ${totalWater.toFixed(0)}g water. Yield: ${yieldInCup.toFixed(0)}g.`;
  } else if (!isNaN(water)) {
    const neededCoffee = (water / 1000) * ratio;
    const yieldInCup = water - (neededCoffee * 2);
    output = `With ${water}g water: use ${neededCoffee.toFixed(1)}g coffee. Yield: ${yieldInCup.toFixed(0)}g.`;
  } else {
    output = "Please enter coffee, water, or number of people.";
  }

  result.innerHTML = output + "<br><em>Enjoy your coffee!</em>";
  const now = new Date().toLocaleTimeString();
  history.innerHTML += `<div>🕓 ${now} – ${output}</div>`;
  localStorage.setItem('lastBrew', JSON.stringify({ output, time: now }));
}

// ESPRESSO Calculator
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
    let output = `Target yield: ${targetYield.toFixed(1)}g.`;

    if (!isNaN(time)) output += ` Shot time: ${time}s.`;
    if (!isNaN(yieldActual)) {
      const diff = yieldActual - targetYield;
      output += ` Actual: ${yieldActual}g. Diff: ${diff >= 0 ? '+' : ''}${diff.toFixed(1)}g.`;
    }

    output += ` Taste: ${qualityText}.`;
    result.innerHTML = output + "<br><em>Enjoy your espresso!</em>";

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

// Load previous brews on page load
window.addEventListener('DOMContentLoaded', () => {
  const last = JSON.parse(localStorage.getItem('lastBrew'));
  if (last && document.getElementById('filterHistory')) {
    document.getElementById('filterHistory').innerHTML += `<div>🕓 Last Brew – ${last.time}: ${last.output}</div>`;
  }

  const lastEsp = JSON.parse(localStorage.getItem('lastEspresso'));
  if (lastEsp && document.getElementById('previousEspresso')) {
    document.getElementById('previousEspresso').innerHTML = `
      <strong>Previous Espresso:</strong><br>
      Dose: ${lastEsp.dose}g<br>
      Ratio: 1:${lastEsp.ratio}<br>
      Target Yield: ${lastEsp.targetYield}g<br>
      Actual: ${lastEsp.actual}g<br>
      Time: ${lastEsp.time}s<br>
      Taste: ${lastEsp.taste}<br>
      Logged: ${lastEsp.timestamp}
    `;
  }
});
