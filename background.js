const OPENAI_API_KEY = "YOUR_API_KEY";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const CONTEXT_MENU_ID = "summarize-with-ai";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Summarize with AI",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) return;

  const selectedText = info.selectionText;

  chrome.storage.local.set({ selectedText, summary: null, error: null }, () => {
    chrome.action.openPopup();
    summarizeText(selectedText);
  });
});

async function summarizeText(text) {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Summarize the following text:\n\n${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content ?? "";

    chrome.storage.local.set({ summary, error: null }, () => {
      chrome.runtime.sendMessage({ type: "SUMMARY_READY", summary }).catch(() => {});
    });
  } catch (err) {
    const error = err.message || "An unknown error occurred.";
    chrome.storage.local.set({ summary: null, error }, () => {
      chrome.runtime.sendMessage({ type: "SUMMARY_ERROR", error }).catch(() => {});
    });
  }
}
