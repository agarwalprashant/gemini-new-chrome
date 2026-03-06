# Gemini Live Assistant Chrome Extension

A professional Chrome extension that enables voice conversations with Google's Gemini AI while sharing your screen for intelligent, context-aware assistance.

## Features

- **Voice Chat**: Natural voice conversations with AI-powered audio responses
- **Screen Sharing**: Real-time screen capture for visual context
- **Live Conversations**: Simultaneous voice and screen sharing for enhanced assistance
- **Auto-transcription**: Real-time transcription of conversations
- **Audio Visualization**: Visual feedback for microphone input levels

## Prerequisites

Before installing this extension, you need:
- Google Chrome version 114 or higher
- A valid Google Gemini API key (see setup instructions below)
- Microphone access for voice features
- Screen recording permissions for screen sharing features

---

## Installation & Setup Instructions

### Step 1: Obtain Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the generated API key (it will look like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
5. Keep this key secure - you'll need it in the next step

> **Important:** Your API key is personal and should not be shared. It will be stored locally in the extension code on your computer only.

### Step 2: Configure Your API Key

**REQUIRED BEFORE INSTALLATION:**

1. Open the `sidepanel.js` file in a text editor (VS Code, Sublime Text, Notepad++, or any code editor)
2. Locate **line 58** which contains:
   ```javascript
   this.apiKey = '';  // <-- PUT YOUR API KEY HERE BETWEEN THE QUOTES
   ```
3. Replace the empty string with your API key from Step 1:
   ```javascript
   this.apiKey = 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
   ```
4. **Save the file** (Ctrl+S or Cmd+S)

**Example:**
```javascript
// Before (line 58):
this.apiKey = '';

// After (with your actual API key):
this.apiKey = 'AIzaSyDEMOKEY123456789ABCDEFGHIJKLMNOP';
```

> **Critical:** The extension will NOT work without completing this step. Make sure to save the file after adding your API key.

### Step 3: Install the Extension in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/` (paste this in the address bar)
3. Enable **"Developer mode"** using the toggle switch in the top-right corner
4. Click the **"Load unpacked"** button (top-left area)
5. Browse and select the folder containing these extension files
6. The extension will now appear in your extensions list with a bot icon

> **Note:** You may see a warning that the extension is in "Developer mode" - this is normal for unpacked extensions.

### Step 4: Grant Required Permissions

When you first use the extension, Chrome will ask for permissions:
- **Microphone access**: Required for voice input
- **Screen recording**: Required for screen sharing feature

Click "Allow" when prompted to enable full functionality.

---

## How to Use

### Starting a Live Conversation

1. Click the **Gemini Live Assistant** icon in your Chrome toolbar (or extensions menu)
2. The side panel will open on the right side of your browser
3. Click the blue **Play button** (▶) to start a live conversation
4. **Grant permissions** when prompted:
   - Allow microphone access for voice input
   - Allow screen capture for visual context
5. Start speaking - the AI will:
   - Listen to your voice in real-time
   - Capture screenshots of your active tab every 3 seconds
   - Respond with voice and text
6. Click the **Stop button** (■) to end the conversation

### Understanding the Interface

- **Breathing Indicator**: The animated circle shows connection status
  - Breathing animation = Connected and listening
  - Pulsing = AI is processing or responding
  - Red = Error state

- **Real-time Transcript**: The bottom section displays:
  - Your spoken words (transcribed automatically)
  - AI responses in text form
  - System messages and status updates

- **Audio Visualizer**: Shows your microphone input levels in real-time

- **Screenshot Preview**: Displays the current screen capture being analyzed by the AI

### Use Cases

- **Web Development**: Get live coding assistance while the AI sees your code
- **Research**: Ask questions about web content while browsing
- **Learning**: Get explanations about what you're viewing on screen
- **Troubleshooting**: Show error messages and get instant help
- **Navigation**: Get guidance while exploring new websites or applications

---

## Troubleshooting

### Extension Won't Load
- **Issue**: Extension fails to install
- **Solution**: Ensure you're using Chrome 114 or higher. Check `chrome://version/`

### "API Key Not Found" or Connection Errors
- **Issue**: Extension loads but won't connect
- **Solution**:
  1. Verify you completed **Step 2** above
  2. Open `sidepanel.js` and check line 58 has your API key
  3. Ensure your API key is valid at [Google AI Studio](https://aistudio.google.com/apikey)
  4. Check that the API key is within the quotes: `this.apiKey = 'YOUR_KEY_HERE';`

### Microphone Not Working
- **Issue**: Voice input not detected
- **Solutions**:
  1. Check Chrome's microphone permissions: `chrome://settings/content/microphone`
  2. Ensure your microphone is connected and working
  3. Try speaking louder or adjusting microphone settings
  4. Check the audio visualizer for input levels
  5. Close other applications using the microphone

### Screen Capture Not Working
- **Issue**: Screenshots not appearing or permission denied
- **Solutions**:
  1. Grant screen recording permission when prompted
  2. On macOS: System Preferences → Security & Privacy → Screen Recording → Enable Chrome
  3. On Windows: Ensure Chrome has screen capture permissions
  4. Refresh the browser tab and try again

### AI Not Responding
- **Issue**: No voice or text response from AI
- **Solutions**:
  1. Check your internet connection
  2. Verify your API key is active and has available quota
  3. Check the browser console (F12) for error messages
  4. Stop and restart the live conversation

### Audio Playback Issues
- **Issue**: Can't hear AI responses
- **Solutions**:
  1. Check your system volume and browser volume
  2. Ensure no other tabs are playing audio
  3. Try refreshing the extension
  4. Check Chrome's audio permissions

---

## Privacy & Security

### Data Handling
- **API Key Storage**: Your API key is stored locally in the extension code only
- **Voice Data**: Audio is sent directly to Google's Gemini API (not stored by the extension)
- **Screen Captures**: Screenshots are sent to Gemini API for analysis (not stored locally)
- **No Third-party Services**: All communication is between your browser and Google's API

### Important Notes
- This extension does NOT store any conversation history
- Voice and screen data are processed in real-time by Google's Gemini API
- Your API key never leaves your computer (except to authenticate with Google)
- Review [Google's Gemini API Terms of Service](https://ai.google.dev/terms) for data handling policies

---

## Technical Details

### Technologies Used
- **Manifest V3**: Latest Chrome extension standard
- **Google Gemini 2.0 Flash Live API**: Real-time AI model
- **Web Audio API**: Audio processing and playback
- **Chrome TabCapture API**: Screen sharing functionality
- **AudioWorklet**: Low-latency audio processing

### Browser Compatibility
- Google Chrome 114+
- Chromium-based browsers (Edge, Brave, Opera) - may require testing

### API Usage & Costs
- This extension uses Google's Gemini API
- Check [Google AI Studio pricing](https://ai.google.dev/pricing) for current rates
- Free tier available with usage limits
- Voice and image processing consume API quota

---

## File Structure

```
GeminiChrome/
├── manifest.json          # Extension configuration
├── sidepanel.js          # Main extension logic (CONFIGURE API KEY HERE - LINE 58)
├── sidepanel.html        # Side panel UI
├── sidepanel.css         # Side panel styling
├── background.js         # Background service worker
├── content.js            # Content script
├── content.css           # Content script styles
├── audio-processor.js    # Audio worklet processor
├── permission.html       # Permission handling UI
├── permission.js         # Permission handling logic
├── icons/                # Extension icons
└── README.md            # This file
```

---

## Support & Additional Resources

### Useful Links
- **Get API Key**: [Google AI Studio](https://aistudio.google.com/apikey)
- **Gemini API Documentation**: [ai.google.dev/docs](https://ai.google.dev/docs)
- **Chrome Extensions Guide**: [developer.chrome.com/extensions](https://developer.chrome.com/docs/extensions/)

### Debugging
To view detailed logs and debug issues:
1. Right-click the extension in the side panel
2. Select "Inspect" to open Developer Tools
3. Check the **Console** tab for error messages and logs
4. Look for messages prefixed with `[Gemini Live Assistant]`

### Common Console Messages
- `[startLiveChat] Starting live screen share chat...` - Conversation starting
- `[AudioWorklet] Audio level: XX%` - Microphone input detected
- `[captureScreenshotSilent] Sent screenshot to Gemini` - Screen capture successful
- `[connectToGemini] Setup complete` - Successfully connected to API

---

## License & Terms

This is provided as source code for personal use. By using this extension:
- You acknowledge responsibility for your API key security
- You agree to comply with Google's Gemini API Terms of Service
- You understand that API usage may incur costs based on Google's pricing

---

## Version Information

**Current Version**: 0.1.0
**Last Updated**: 2025
**Minimum Chrome Version**: 114

---

**Thank you for your purchase! If you have any questions about setup, please refer to the troubleshooting section above.** 