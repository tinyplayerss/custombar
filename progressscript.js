// Get the progress bar, fill, and input elements
const progressBar = document.querySelector('.progress-fill');
const progressInput = document.getElementById('progress-input');
const incrementButton = document.getElementById('increment');
const decrementButton = document.getElementById('decrement');
const goalText = document.getElementById('goal-text');
const goalTitle = document.getElementById('goal-title');
const goalInput = document.getElementById('goal-input');
const updateTitleInput = document.getElementById('update-title-input');
const labelStart = document.getElementById('label-start');
const labelEnd = document.getElementById('label-end');
const labelStartInput = document.getElementById('label-start-input');
const labelEndInput = document.getElementById('label-end-input');
const updateLabelsButton = document.getElementById('update-labels-button');
const updateTitleButton = document.getElementById('update-title-button');

// Function to update the progress bar
function updateProgressBar(value) {
  const newValue = Math.min(Math.max(value, 0), parseInt(goalInput.value));
  progressBar.style.width = (newValue / parseInt(goalInput.value)) * 100 + '%';
  progressInput.value = newValue;
}

// Event listener for the increment button
incrementButton.addEventListener('click', () => {
  updateProgressBar(parseInt(progressInput.value) + 1);
});

// Event listener for the decrement button
decrementButton.addEventListener('click', () => {
  updateProgressBar(parseInt(progressInput.value) - 1);
});

// Event listener for the input field
progressInput.addEventListener('input', () => {
  updateProgressBar(parseInt(progressInput.value));
});

// Event listener for the goal input field
goalInput.addEventListener('input', () => {
  // Dynamically set the max attribute of progressInput
  progressInput.max = goalInput.value;
  updateGoalText(parseInt(goalInput.value));
});

// Function to update the goal text
function updateGoalText(newGoalValue) {
  goalText.textContent = newGoalValue;
  updateProgressBar(parseInt(progressInput.value));
}

// Event listener for updating the title
updateTitleButton.addEventListener('click', () => {
  goalTitle.textContent = updateTitleInput.value;
});

// Event listener for updating the labels
updateLabelsButton.addEventListener('click', () => {
  labelStart.textContent = labelStartInput.value;
  labelEnd.textContent = labelEndInput.value;
});

// Initial setup
updateProgressBar(parseInt(progressInput.value));
updateGoalText(parseInt(goalInput.value));
