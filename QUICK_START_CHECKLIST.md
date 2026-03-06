# Quick Start Checklist

## ✅ Installation Checklist

Print this page and check off each step as you complete it!

---

### Before You Begin
- [ ] I have Google Chrome version 114 or higher installed
- [ ] I have a text editor ready (VS Code, Notepad++, Sublime Text, or Notepad)
- [ ] I have internet connection

---

### Step 1: Get Gemini API Key (5 minutes)

- [ ] Visit [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- [ ] Sign in with Google account
- [ ] Click "Create API Key" or "Get API Key"
- [ ] Copy the API key (starts with `AIzaSy...`)
- [ ] Keep the API key somewhere safe temporarily

**My API Key:** (write it here for reference during setup)
```
_________________________________________________________________
```

---

### Step 2: Configure the Extension (2 minutes)

- [ ] Open the `sidepanel.js` file with a text editor
- [ ] Find **line 58** that says: `this.apiKey = '';`
- [ ] Paste your API key between the quotes
- [ ] It should look like: `this.apiKey = 'AIzaSy...';`
- [ ] **Save the file** (Ctrl+S or Cmd+S)
- [ ] Close the text editor

**Important:** Did you save the file? Double-check! ✓

---

### Step 3: Install in Chrome (2 minutes)

- [ ] Open Chrome browser
- [ ] Go to: `chrome://extensions/` (copy and paste this)
- [ ] Turn ON "Developer mode" (toggle switch, top-right)
- [ ] Click "Load unpacked" button (top-left)
- [ ] Select the folder containing these extension files
- [ ] Extension appears in the list with a bot icon
- [ ] Pin the extension to toolbar (click puzzle icon → pin)

---

### Step 4: Test the Extension (2 minutes)

- [ ] Click the extension icon in Chrome toolbar
- [ ] Side panel opens on the right
- [ ] Click the blue Play button (▶)
- [ ] Allow microphone access when prompted
- [ ] Allow screen capture when prompted
- [ ] Say "Hello, can you hear me?"
- [ ] AI responds with voice

---

## 🎉 Success!

If you completed all steps above, your extension is working!

---

## ❌ Troubleshooting (If Something Went Wrong)

### Problem: "API Key Not Found" or won't connect

**Fix:**
- [ ] Open `sidepanel.js` again
- [ ] Check line 58 has your API key
- [ ] Make sure API key is inside quotes: `'YOUR_KEY_HERE'`
- [ ] Make sure you saved the file
- [ ] Reload extension in `chrome://extensions/` (click reload icon)

### Problem: Microphone not working

**Fix:**
- [ ] Check Chrome settings: `chrome://settings/content/microphone`
- [ ] Make sure microphone is selected and allowed
- [ ] Close other apps using microphone (Zoom, Discord, etc.)
- [ ] Refresh the browser tab

### Problem: Screen capture not working

**Fix:**
- [ ] Click "Allow" when Chrome asks for screen recording permission
- [ ] **On Mac:** System Preferences → Security & Privacy → Screen Recording → Enable Chrome
- [ ] **On Windows:** Check Windows Privacy settings for screen recording

### Problem: Extension won't install

**Fix:**
- [ ] Check Chrome version: `chrome://version/` (must be 114+)
- [ ] Make sure "Developer mode" is turned ON
- [ ] Try restarting Chrome
- [ ] Select the correct folder (should contain `manifest.json`)

---

## 📞 Still Need Help?

1. **Check the detailed README.md** - It has comprehensive troubleshooting
2. **Check browser console** - Press F12 and look for error messages
3. **Verify API key** - Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) and check if your key is valid

---

## 🔒 Security Reminder

- ✓ Your API key is stored locally in the code only
- ✓ Don't share your API key with anyone
- ✓ Your conversations are processed by Google Gemini API
- ✓ No conversation history is saved by the extension

---

## 💡 Tips for Best Experience

1. **Speak clearly** - The AI works best with clear speech
2. **Good microphone** - Use a decent microphone for better recognition
3. **Stable internet** - Ensure good connection for smooth responses
4. **Check API usage** - Monitor your usage at [https://aistudio.google.com](https://aistudio.google.com)

---

**Estimated Total Setup Time:** 10-15 minutes

**You're all set! Enjoy your AI-powered browsing assistant!** 🚀
