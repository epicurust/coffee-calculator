const greeting = document.getElementById('greeting');
const nameInput = document.getElementById('nameInput');
const startButton = document.getElementById('startButton');
const timeImage = document.getElementById('timeImage');
const iconSection = document.getElementById('iconSection');

const hour = new Date().getHours();
if (hour < 12) {
  timeImage.src = "https://img.freepik.com/premium-vector/morning-coffee_925452-21.jpg";
  greeting.textContent = "Good Morning";
} else if (hour < 18) {
  timeImage.src = "https://images.template.net/182120/coffee-vector-edit-online.jpg";
  greeting.textContent = "Good Afternoon";
} else {
  timeImage.src = "https://img.freepik.com/premium-vector/coffee-mug-night-illustration_188544-5097.jpg";
  greeting.textContent = "Good Evening";
}

let userName = "";

startButton.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name) {
    userName = name;
    greeting.textContent += `, ${userName}!`;
    nameInput.style.display = 'none';
    startButton.style.display = 'none';
    timeImage.classList.add('fade-out');
    iconSection.classList.remove('hidden');
  }
});

function showSection(sectionId) {
  document.getElementById('filter').classList.add('hidden');
  document.getElementById('espresso').classList.add('hidden');
  document.getElementById(sectionId).classList.remove('hidden');
}

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
    output = "Please enter coffee, water, or people.";
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
