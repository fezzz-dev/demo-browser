# demo-browser

## AI Text Summarizer – Chrome Extension

Summarize any selected text on a web page using OpenAI, via a right-click context menu.

### Setup

1. **Load the extension** in Chrome:
   - Open `chrome://extensions`
   - Enable **Developer mode** (top-right toggle)
   - Click **Load unpacked** and select this repository folder

2. **Enter your OpenAI API key:**
   - On the `chrome://extensions` page, find **AI Text Summarizer** and click **Details**
   - Click **Extension options** (or right-click the extension icon → **Options**)
   - Paste your API key (starts with `sk-`) and click **Save**
   - Get a key at <https://platform.openai.com/account/api-keys>

3. **Use the extension:**
   - Select any text on a page
   - Right-click and choose **Summarize with AI**
   - The summary appears in the extension popup