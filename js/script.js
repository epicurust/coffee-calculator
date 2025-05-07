const greeting = document.getElementById('greeting');
const nameInput = document.getElementById('nameInput');
const startButton = document.getElementById('startButton');
const introImage = document.getElementById('introImage');
const imageContainer = document.getElementById('imageContainer');
const iconSection = document.getElementById('iconSection');
const filterSection = document.getElementById('filter');
const espressoSection = document.getElementById('espresso');
const backButton = document.getElementById('backButton');
const darkModeToggle = document.getElementById('darkModeToggle');

let userName = "";

const hour = new Date().getHours();
if (hour < 12) {
  introImage.src = "https://img.freepik.com/premium-vector/morning-coffee_925452-21.jpg";
} else if (hour < 18) {
  introImage.src = "https://images.template.net/182120/coffee-vector-edit-online.jpg";
} else {
  introImage.src = "https://img.freepik.com/premium-vector/coffee-mug-night-illustration_188544-5097.jpg";
}

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
});

document.getElementById('filterIcon').addEventListener('click', () => {
  iconSection.classList.remove('visible');
  filterSection.classList.remove('hidden');
  filterSection.classList.add('visible');
  backButton.classList.remove('hidden');
});

document.getElementById('espressoIcon').addEventListener('click', () => {
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
});

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

function calculateFilter() {
  const coffee = parseFloat(document.getElementById('filterCoffee').value);
  const water = parseFloat(document.getElementById('filterWater').value);
  const people = parseFloat(document.getElementById('filterPeople').value);
  const ratio = parseFloat(document.getElementById('filterRatio').value);
  const result = document.getElementById('filterResult');

  let output = "";

  if (!isNaN(people)) {
    const targetYield = people * 250;
    const totalWater = targetYield / 0.7;
    const neededCoffee = totalWater * (ratio / 1000);
    output = `Hey ${userName}, for ${people} people: use ${neededCoffee.toFixed(1)}g coffee and ${totalWater.toFixed(0)}g water.`;
  } else if (!isNaN(coffee)) {
    const totalWater = (coffee / ratio) * 1000;
    const yieldInCup = totalWater - (coffee * 2);
    output = `Hey ${userName}, with ${coffee}g coffee: use ${totalWater.toFixed(0)}g water. Estimated in-cup yield: ${yieldInCup.toFixed(0)}g.`;
  } else if (!isNaN(water)) {
    const neededCoffee = (water / 1000) * ratio;
    const yieldInCup = water - (neededCoffee * 2);
    output = `Hey ${userName}, with ${water}g water: use ${neededCoffee.toFixed(1)}g coffee. Estimated in-cup yield: ${yieldInCup.toFixed(0)}g.`;
  } else {
    output = "Please enter coffee, water, or number of people.";
  }

  result.innerHTML = output + "<br><em>Enjoy your coffee!</em>";
}

function calculateEspresso() {
  const dose = parseFloat(document.getElementById('espressoDose').value);
  const ratio = parseFloat(document.getElementById('espressoRatio').value);
  const result = document.getElementById('espressoResult');

  if (!isNaN(dose)) {
    const yieldAmount = dose * ratio;
    result.innerHTML = `Hey ${userName}, your target yield is ${yieldAmount.toFixed(1)}g.<br><em>Enjoy your coffee!</em>`;
  } else {
    result.innerHTML = "Please enter a coffee dose.";
  }
}
