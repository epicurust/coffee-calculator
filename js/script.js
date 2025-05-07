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
const nameBlock = document.getElementById('nameBlock');

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
  const timeGreeting = hour < 12 ? "Good morning"
                      : hour < 18 ? "Good afternoon"
                      : "Good evening";

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

// Filter icon selected
document.getElementById('filterIcon').addEventListener('click', () => {
  document.getElementById('espressoIcon').style.display = 'none';
  document.getElementById('filterIcon').style.margin = '0 auto';
  document.querySelector('.icon-container').style.justifyContent = 'center';
  iconSection.classList.remove('visible');
  filterSection.classList.remove('hidden');
  filterSection.classList.add('visible');
  backButton.classList.remove('hidden');
});

// Espresso icon selected
document.getElementById('espressoIcon').addEventListener('click', () => {
  document.getElementById('filterIcon').style.display = 'none';
  document.getElementById('espressoIcon').style.margin = '0 auto';
  document.querySelector('.icon-container').style.justifyContent = 'center';
  iconSection.classList.remove('visible');
  espressoSection.classList.remove('hidden');
  espressoSection.classList.add('visible');
  backButton.classList.remove('hidden');
});

// Back button logic
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

// Reset the app
resetButton.addEventListener('click', () => location.reload());

// Dark mode
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Language toggle
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
