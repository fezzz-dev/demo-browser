// Options page script

// Load saved API key
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['openaiApiKey'], (result) => {
    if (result.openaiApiKey) {
      document.getElementById('api-key').value = result.openaiApiKey;
    }
  });
});

// Save API key
document.getElementById('options-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const apiKey = document.getElementById('api-key').value.trim();
  const statusDiv = document.getElementById('status');
  
  if (!apiKey) {
    showStatus('Please enter an API key', 'error');
    return;
  }
  
  if (!apiKey.startsWith('sk-')) {
    showStatus('API key should start with "sk-"', 'error');
    return;
  }
  
  // Save to storage
  chrome.storage.sync.set({ openaiApiKey: apiKey }, () => {
    showStatus('API key saved successfully!', 'success');
  });
});

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';
  
  // Hide after 3 seconds for success messages
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
}
