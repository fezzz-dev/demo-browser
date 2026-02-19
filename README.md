# demo-browser

## AI Text Summarizer – Chrome Extension

Summarize any selected text on a web page using OpenAI, via a right-click context menu.

---

## How to add your API key – step by step

### Step 1 – Get your OpenAI API key

1. Go to <https://platform.openai.com/account/api-keys> (create a free account if you don't have one).
2. Click **Create new secret key**, give it a name (e.g. "AI Text Summarizer"), and click **Create secret key**.
3. **Copy the key** – it starts with `sk-` and looks like `sk-proj-...`. You will only see it once, so copy it now.

---

### Step 2 – Load the extension in Chrome

1. Open a new Chrome tab and go to `chrome://extensions`.
2. Turn on **Developer mode** using the toggle in the **top-right corner** of the page.
3. Click **Load unpacked** (top-left).
4. In the file picker, select the folder that contains this repository (the folder with `manifest.json` in it).
5. The **AI Text Summarizer** extension will appear in the list.

---

### Step 3 – Enter your API key in the extension

**Option A – from the Extensions page (recommended):**

1. On `chrome://extensions`, find **AI Text Summarizer** and click **Details**.
2. Scroll down and click **Extension options**.
3. Paste your `sk-...` key into the **OpenAI API Key** field.
4. Click **Save**. You should see a green "Saved!" confirmation.

**Option B – from the extension icon:**

1. Click the puzzle-piece icon (🧩) in the Chrome toolbar and find **AI Text Summarizer**.
2. Right-click the extension icon → **Options**.
3. Paste your key and click **Save**.

> **Your key is stored only in your browser** (via `chrome.storage.sync`) and is sent exclusively to `api.openai.com`. It is never stored on any third-party server.

---

### Step 4 – Use the extension

1. Navigate to any web page and **select some text**.
2. **Right-click** the selected text.
3. Choose **Summarize with AI** from the context menu.
4. The extension popup opens and shows the summary.

---

### Troubleshooting

| Problem | Solution |
|---|---|
| "No API key configured" error in the popup | Open the extension options (Step 3) and save your key |
| "Incorrect API key" error | Your key may have been copied incompletely – go back to Step 1 and copy it again |
| "Summarize with AI" not in the right-click menu | Make sure you selected some text before right-clicking |
| Extension not visible after loading | Refresh `chrome://extensions` and ensure Developer mode is on |