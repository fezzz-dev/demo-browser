/**
 * background.js
 *
 * Service worker for the AI Text Summarizer extension.
 * Responsibilities:
 *  - Register a "Summarize with AI" context menu item on text selection.
 *  - Capture the selected text when the menu item is clicked.
 *  - Call the OpenAI Chat Completions API and store the result.
 *  - Open (or focus) the extension popup so the user sees the summary.
 */

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/**
 * Replace "YOUR_API_KEY" with your actual OpenAI API key before loading the
 * extension.  In a production deployment, store the key via an options page
 * that writes to chrome.storage.local so it is never hard-coded in source.
 */
const OPENAI_API_KEY = "YOUR_API_KEY";

/** OpenAI model to use for summarization. */
const OPENAI_MODEL = "gpt-4o-mini";

/** System prompt sent to OpenAI. */
const SYSTEM_PROMPT =
  "You are a concise summarization assistant. " +
  "Summarize the provided text clearly and briefly in plain language. " +
  "Use bullet points when the content has multiple distinct ideas.";

// ---------------------------------------------------------------------------
// Context menu setup
// ---------------------------------------------------------------------------

/**
 * Create the context menu item once when the service worker is installed.
 * Using onInstalled avoids duplicate entries on each service-worker restart.
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize-with-ai",
    title: "Summarize with AI",
    // Only show the item when the user has selected some text.
    contexts: ["selection"],
  });
});

// ---------------------------------------------------------------------------
// Context menu click handler
// ---------------------------------------------------------------------------

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "summarize-with-ai") return;

  const selectedText = info.selectionText?.trim();
  if (!selectedText) return;

  // Persist a "loading" state so the popup can show a spinner immediately.
  await chrome.storage.local.set({
    summaryState: { status: "loading", text: "", error: "" },
  });

  // Open the popup programmatically so the user sees feedback right away.
  // (chrome.action.openPopup is available in Chrome 99+ for extensions with
  //  the "activeTab" or "tabs" permission; we fall back gracefully if absent.)
  try {
    await chrome.action.openPopup();
  } catch (_e) {
    // openPopup may not be available in all environments – not fatal.
  }

  // Call the OpenAI API and store the result.
  try {
    const summary = await fetchSummary(selectedText);
    await chrome.storage.local.set({
      summaryState: { status: "success", text: summary, error: "" },
    });
  } catch (err) {
    await chrome.storage.local.set({
      summaryState: {
        status: "error",
        text: "",
        error: err.message || "An unexpected error occurred.",
      },
    });
  }
});

// ---------------------------------------------------------------------------
// OpenAI API helper
// ---------------------------------------------------------------------------

/**
 * Sends `text` to the OpenAI Chat Completions endpoint and returns the
 * assistant's reply as a plain string.
 *
 * @param {string} text - The selected text to summarize.
 * @returns {Promise<string>} The summary returned by the model.
 * @throws {Error} When the network request fails or the API returns an error.
 */
async function fetchSummary(text) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Please summarize the following text:\n\n${text}` },
      ],
      temperature: 0.3,
      max_tokens: 512,
    }),
  });

  if (!response.ok) {
    // Attempt to surface the API error message to the user.
    let apiMessage = `API error ${response.status}`;
    try {
      const body = await response.json();
      if (body?.error?.message) {
        apiMessage = body.error.message;
      }
    } catch (_parseErr) {
      // Ignore JSON parse failures; the status code message is sufficient.
    }
    throw new Error(apiMessage);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("The API returned an empty response. Please try again.");
  }

  return content.trim();
}
