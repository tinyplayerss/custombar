// Get the progress bar, fill, and input elements
const progressBar = document.querySelector('.progress-fill');
const progressInput = document.getElementById('progress-input');
const incrementButton = document.getElementById('increment');
const decrementButton = document.getElementById('decrement');
const goalInput = document.getElementById('goal-input');
const updateTitleInput = document.getElementById('update-title-input');
const labelStart = document.getElementById('label-start');
const labelEnd = document.getElementById('label-end');
const labelStartInput = document.getElementById('label-start-input');
const labelEndInput = document.getElementById('label-end-input');
const updateRumbleApiKeyInput = document.getElementById('update-rumble-api-key-input');
const updateLabelsButton = document.getElementById('update-labels-button');
const updateTitleButton = document.getElementById('update-title-button');
const updateRumbleApiKeyButton = document.getElementById('update-rumble-api-key-button');
const saveValuesButton = document.getElementById('save-values-button');
const loadValuesButton = document.getElementById('load-values-button');
const loadValuesInput = document.getElementById('load-values-input');

// Function to update the progress bar and labels
function updateProgressBar(value) {
  const newValue = Math.min(Math.max(value, 0), parseInt(goalInput.value));
  progressBar.style.width = (newValue / parseInt(goalInput.value)) * 100 + '%';
  progressInput.value = newValue;
  labelEnd.textContent = '100'; // Reset to 100

  if (newValue === parseInt(goalInput.value)) {
    // Change the color to gold when the progress reaches the goal
    progressBar.style.background = 'gold';
    // Add a glowing effect when filled and gold
    progressBar.style.boxShadow = '0 0 30px 5px gold';
    // Change text color of labels to black when value is max
    labelStart.style.color = 'black';
    labelEnd.style.color = 'black';
  } else {
    // Reset the color and glow
    progressBar.style.background = '';
    progressBar.style.boxShadow = '';
    // Reset the text color of labels
    labelStart.style.color = 'white';
    labelEnd.style.color = 'white';
  }
}

// Function to get Rumble API data
function getRumbleApi(value) {
  fetch(`https://corsproxy.io/?${value}`).then(data => data.json())
  .then(data => {
    labelStart.textContent = data.followers.num_followers;
    progressBar.style.width = (data.followers.num_followers / parseInt(goalInput.value)) * 100 + '%';
    // progressInput.value = data.followers.num_followers;
  })
}
// Event listener for updating Rumble API Key
updateRumbleApiKeyButton.addEventListener('click', () => {
  getRumbleApi(updateRumbleApiKeyInput.value)
});
// Timer to update num_followers
setInterval(() => {
  if (updateRumbleApiKeyInput.value.length > 48) {
    getRumbleApi(updateRumbleApiKeyInput.value)
  }
}, 30000) // 30 seconds

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
  updateProgressBar(parseInt(progressInput.value));
});

// Event listener for updating the title
updateTitleButton.addEventListener('click', () => {
  document.getElementById('goal-title').textContent = updateTitleInput.value;
});

// Event listener for updating the labels
updateLabelsButton.addEventListener('click', () => {
  labelEnd.textContent = labelEndInput.value;
});

// ...

// Event listener for saving values to JSON
saveValuesButton.addEventListener('click', () => {
  const valuesToSave = {
    progress: progressInput.value,
    goal: goalInput.value,
    title: document.getElementById('goal-title').textContent,
    labelStart: labelStart.textContent,
    labelEnd: labelEnd.textContent,
    updateRumbleApiKeyInput: updateRumbleApiKeyInput.value,
  };

  const jsonData = JSON.stringify(valuesToSave);

  // Create a data URI and trigger a download
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'values.json';

  // Programmatically click the hidden "a" element
  a.click();

  URL.revokeObjectURL(url);
});

// Event listener for loading values from a JSON file
loadValuesButton.addEventListener('click', () => {
  loadValuesInput.click(); // Trigger the file input
});

// Event listener for handling the selected JSON file
loadValuesInput.addEventListener('change', () => {
  const file = loadValuesInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const loadedValues = JSON.parse(event.target.result);
      progressInput.value = loadedValues.progress;
      goalInput.value = loadedValues.goal;
      document.getElementById('goal-title').textContent = loadedValues.title;
      labelStart.textContent = loadedValues.labelStart;
      labelEnd.textContent = loadedValues.labelEnd;
      updateRumbleApiKeyInput.value = loadedValues.updateRumbleApiKeyInput;
      updateProgressBar(loadedValues.progress);
    };
    reader.readAsText(file);
  }
});

// Add an event listener for saving values to JSON
saveValuesButton.addEventListener('click', () => {
    const valuesToSave = {
        progress: progressInput.value,
        goal: goalInput.value,
        title: document.getElementById('goal-title').textContent,
        labelStart: labelStart.textContent,
        labelEnd: labelEnd.textContent,
    };

    const jsonData = JSON.stringify(valuesToSave);

    // Instead of saving to a file, you can use `localStorage` to store data locally.
    localStorage.setItem('progressData', jsonData);
    // Notify OBS Studio via JavaScript that data is saved
    if (window.obsstudio) {
        window.obsstudio.saveData(jsonData);
    }
});

// Event listener for loading values from a JSON file (if allowed in OBS browser source)
loadValuesButton.addEventListener('click', () => {
    // Instead of loading from a file, try to retrieve data from `localStorage`.
    const jsonData = localStorage.getItem('progressData');
    if (jsonData) {
        const loadedValues = JSON.parse(jsonData);
        progressInput.value = loadedValues.progress;
        goalInput.value = loadedValues.goal;
        document.getElementById('goal-title').textContent = loadedValues.title;
        labelStart.textContent = loadedValues.labelStart;
        labelEnd.textContent = loadedValues.labelEnd;
        updateProgressBar(loadedValues.progress);
        // Notify OBS Studio via JavaScript that data is loaded
        if (window.obsstudio) {
            window.obsstudio.loadData(jsonData);
        }
    }
});

// Initial setup
updateProgressBar(parseInt(progressInput.value));

