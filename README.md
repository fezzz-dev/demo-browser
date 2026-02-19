# AI Text Summarizer - Browser Extension

A Chrome/Edge browser extension that summarizes text using the OpenAI API.

## Features

- Summarize any text using OpenAI's GPT-3.5-turbo model
- Secure API key storage in browser sync storage
- Easy-to-use popup interface
- Configurable options page

## Installation

1. Clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory

## Setup

1. Get your OpenAI API key from [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
2. Click on the extension icon and select "Configure API Key"
3. Enter your API key and click "Save API Key"
4. The extension is now ready to use!

## Usage

1. Click on the extension icon
2. Enter or paste the text you want to summarize
3. Click "Summarize"
4. The summarized text will appear below

## Security

- Your API key is stored securely in Chrome's sync storage
- The API key is never hardcoded in the extension
- API calls are made directly from your browser to OpenAI

## Files

- `manifest.json` - Extension configuration
- `background.js` - Background service worker handling API calls
- `popup.html/js` - Main popup interface
- `options.html/js` - Options page for API key configuration
- `icon*.png` - Extension icons

## Fixed Issue

This version addresses the hardcoded API key issue. Previously, the API key was hardcoded as `YOUR_API_KEY` in background.js, causing authentication errors. Now users can configure their own API key through the options page.