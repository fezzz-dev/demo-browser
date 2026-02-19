// Popup script

document.getElementById('summarize-btn').addEventListener('click', async () => {
  const textInput = document.getElementById('text-input');
  const resultDiv = document.getElementById('result');
  const button = document.getElementById('summarize-btn');
  
  const text = textInput.value.trim();
  
  if (!text) {
    showResult('Please enter some text to summarize', true);
    return;
  }
  
  // Check if API key is set
  const result = await chrome.storage.sync.get(['openaiApiKey']);
  if (!result.openaiApiKey) {
    showResult('Please configure your OpenAI API key first. Click the link below to set it up.', true);
    return;
  }
  
  // Disable button and show loading
  button.disabled = true;
  button.textContent = 'Summarizing...';
  resultDiv.style.display = 'none';
  
  // Send message to background script
  chrome.runtime.sendMessage(
    { action: 'summarize', text: text },
    (response) => {
      button.disabled = false;
      button.textContent = 'Summarize';
      
      if (response.success) {
        showResult(response.summary, false);
      } else {
        showResult(`Error: ${response.error}`, true);
      }
    }
  );
});

// Settings link
document.getElementById('settings-link').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

function showResult(message, isError) {
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = message;
  resultDiv.className = isError ? 'error' : '';
  resultDiv.style.display = 'block';
}
