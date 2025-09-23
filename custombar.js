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

// Optimized Rumble API function with caching and error handling
let apiCache = {};
let apiTimeout;

function getRumbleApi(value) {
  // Cache check
  if (apiCache[value] && Date.now() - apiCache[value].timestamp < 30000) {
    const data = apiCache[value].data;
    labelStart.textContent = data.followers.num_followers;
    progressBar.style.width = (data.followers.num_followers / parseInt(goalInput.value)) * 100 + '%';
    return;
  }

  fetch(`https://corsproxy.io/?${value}`)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      // Cache the result
      apiCache[value] = {
        data: data,
        timestamp: Date.now()
      };
      
      labelStart.textContent = data.followers.num_followers;
      progressBar.style.width = (data.followers.num_followers / parseInt(goalInput.value)) * 100 + '%';
    })
    .catch(error => {
      console.error('Rumble API error:', error);
    });
}

// Debounced API update function
const debouncedApiUpdate = (value) => {
  clearTimeout(apiTimeout);
  apiTimeout = setTimeout(() => {
    if (value.length > 48) {
      getRumbleApi(value);
    }
  }, 1000);
};

// Event listener for updating Rumble API Key
updateRumbleApiKeyButton.addEventListener('click', () => {
  getRumbleApi(updateRumbleApiKeyInput.value);
});

// Optimized timer for API updates
setInterval(() => {
  const apiValue = updateRumbleApiKeyInput.value;
  if (apiValue.length > 48) {
    getRumbleApi(apiValue);
  }
}, 30000); // 30 seconds

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

// Optimized save/load functionality with debouncing
let saveTimeout;
const debouncedSave = () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const valuesToSave = {
      progress: progressInput.value,
      goal: goalInput.value,
      title: document.getElementById('goal-title').textContent,
      labelStart: labelStart.textContent,
      labelEnd: labelEnd.textContent,
      updateRumbleApiKeyInput: updateRumbleApiKeyInput.value,
    };
    
    const jsonData = JSON.stringify(valuesToSave);
    localStorage.setItem('progressData', jsonData);
    
    // OBS Studio integration
    if (window.obsstudio) {
      window.obsstudio.saveData(jsonData);
    }
  }, 300);
};

// Event listener for saving values
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

  // Create download
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'values.json';
  a.click();
  URL.revokeObjectURL(url);

  // Also save to localStorage
  localStorage.setItem('progressData', jsonData);
  if (window.obsstudio) {
    window.obsstudio.saveData(jsonData);
  }
});

// Event listener for loading values from file
loadValuesButton.addEventListener('click', () => {
  loadValuesInput.click();
});

// Handle file selection
loadValuesInput.addEventListener('change', () => {
  const file = loadValuesInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const loadedValues = JSON.parse(event.target.result);
        progressInput.value = loadedValues.progress || 0;
        goalInput.value = loadedValues.goal || 100;
        document.getElementById('goal-title').textContent = loadedValues.title || 'Goal';
        labelStart.textContent = loadedValues.labelStart || '0';
        labelEnd.textContent = loadedValues.labelEnd || '100';
        updateRumbleApiKeyInput.value = loadedValues.updateRumbleApiKeyInput || '';
        updateProgressBar(parseInt(loadedValues.progress) || 0);
      } catch (e) {
        console.error('Error parsing JSON file:', e);
      }
    };
    reader.readAsText(file);
  }
});

// Initial setup
updateProgressBar(parseInt(progressInput.value) || 0);

