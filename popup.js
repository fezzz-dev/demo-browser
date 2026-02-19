/**
 * popup.js
 *
 * Controls the popup UI for the AI Text Summarizer extension.
 * Responsibilities:
 *  - Read the current summarization state from chrome.storage.local.
 *  - Render the appropriate UI panel (idle / loading / success / error).
 *  - Listen for storage changes so the popup updates in real-time when the
 *    background service worker finishes the API call.
 *  - Handle "Copy" and "Clear" button actions.
 */

// ---------------------------------------------------------------------------
// DOM references
// ---------------------------------------------------------------------------

const stateSetup   = document.getElementById("state-setup");
const stateIdle    = document.getElementById("state-idle");
const stateLoading = document.getElementById("state-loading");
const stateSuccess = document.getElementById("state-success");
const stateError   = document.getElementById("state-error");
const summaryText  = document.getElementById("summary-text");
const errorMessage = document.getElementById("error-message");
const footer       = document.getElementById("footer");
const btnCopy      = document.getElementById("btn-copy");
const btnClear     = document.getElementById("btn-clear");
const btnOpenOptions = document.getElementById("btn-open-options");
const toast        = document.getElementById("toast");

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

/**
 * Hide all state panels, then show only the one matching `status`.
 *
 * @param {"idle"|"loading"|"success"|"error"} status
 * @param {object} [data] - Optional payload for success/error states.
 * @param {string} [data.text]  - Summary text (success).
 * @param {string} [data.error] - Error message (error).
 */
function renderState(status, data = {}) {
  // Hide every panel and the footer first.
  stateSetup.style.display   = "none";
  stateIdle.style.display    = "none";
  stateLoading.style.display = "none";
  stateSuccess.style.display = "none";
  stateError.style.display   = "none";
  footer.style.display       = "none";

  switch (status) {
    case "setup":
      stateSetup.style.display = "flex";
      break;

    case "loading":
      stateLoading.style.display = "flex";
      break;

    case "success":
      stateSuccess.style.display = "block";
      // Use textContent to avoid XSS risks with user-generated / API content.
      summaryText.textContent    = data.text || "";
      footer.style.display       = "flex";
      break;

    case "error":
      stateError.style.display = "block";
      errorMessage.textContent = data.error || "An unexpected error occurred.";
      footer.style.display     = "flex";
      break;

    case "idle":
    default:
      stateIdle.style.display = "flex";
      break;
  }
}

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

/**
 * Read the persisted summary state from storage and render the UI accordingly.
 * If no API key has been configured, show the setup panel instead.
 */
function loadAndRender() {
  chrome.storage.sync.get("openaiApiKey", ({ openaiApiKey }) => {
    if (!openaiApiKey) {
      renderState("setup");
      return;
    }
    chrome.storage.local.get("summaryState", (result) => {
      const state = result.summaryState;
      if (!state) {
        renderState("idle");
        return;
      }
      renderState(state.status, { text: state.text, error: state.error });
    });
  });
}

/**
 * Clear the stored state and reset the UI to idle.
 */
function clearState() {
  chrome.storage.local.remove("summaryState", () => {
    renderState("idle");
  });
}

// ---------------------------------------------------------------------------
// Real-time update listener
// ---------------------------------------------------------------------------

/**
 * Listen for storage changes from the background service worker.
 * This ensures the popup reflects the latest status even while it is open
 * during an in-flight API request.
 */
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.summaryState) return;
  const newState = changes.summaryState.newValue;
  if (newState) {
    renderState(newState.status, { text: newState.text, error: newState.error });
  }
});

// ---------------------------------------------------------------------------
// Button handlers
// ---------------------------------------------------------------------------

/** Open the extension options page so the user can enter their API key. */
btnOpenOptions.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

/** Copy the summary text to the clipboard and show a brief toast. */
btnCopy.addEventListener("click", async () => {
  const text = summaryText.textContent;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied!");
  } catch (_err) {
    showToast("Copy failed");
  }
});

/** Clear the stored summary and return to the idle state. */
btnClear.addEventListener("click", () => {
  clearState();
});

// ---------------------------------------------------------------------------
// Toast helper
// ---------------------------------------------------------------------------

let toastTimer = null;

/**
 * Briefly display a toast notification with the given message.
 *
 * @param {string} message
 */
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2000);
}

// ---------------------------------------------------------------------------
// Initialize
// ---------------------------------------------------------------------------

// Render the correct state as soon as the popup opens.
loadAndRender();
