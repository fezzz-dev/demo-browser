/**
 * options.js
 *
 * Controls the options page for the AI Text Summarizer extension.
 * Loads the saved API key on open and persists changes to chrome.storage.sync.
 */

const apiKeyInput = document.getElementById("api-key-input");
const btnSave = document.getElementById("btn-save");
const statusEl = document.getElementById("status");

// Load the saved key (if any) when the options page opens.
chrome.storage.sync.get("openaiApiKey", ({ openaiApiKey }) => {
  if (openaiApiKey) {
    apiKeyInput.value = openaiApiKey;
  }
});

btnSave.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();

  if (!key) {
    showStatus("Please enter an API key.", true);
    return;
  }

  chrome.storage.sync.set({ openaiApiKey: key }, () => {
    showStatus("Saved!", false);
  });
});

let statusTimer = null;

function showStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.className = isError ? "error" : "";

  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    statusEl.textContent = "";
  }, 3000);
}
