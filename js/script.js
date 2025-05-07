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

// Start button click
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

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Toggle language
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

// Reset page
resetButton.addEventListener('click', () => location.reload());

// Brew icon logic
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
