import { useState, useEffect } from 'react'
import Header from './components/Header'
import ApiKeyInput from './components/ApiKeyInput'
import TranscriptDisplay from './components/TranscriptDisplay'
import ScreenshotPreview from './components/ScreenshotPreview'
import { useGeminiSession } from './hooks/useGeminiSession'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    const listener = (request, _sender, sendResponse) => {
      if (request.action === 'closeSidePanel') {
        sendResponse({ success: true })
        window.close()
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])
  const { start, stop, status, statusText, messages, screenshot, setScreenshot } = useGeminiSession()

  function handleToggle() {
    if (status === 'idle' || status === 'error') {
      start(apiKey)
    } else {
      stop()
    }
  }

  const isLive = status === 'recording' || status === 'thinking'

  return (
    <div className="app">
      <Header
        status={status}
        statusText={statusText}
        isLive={isLive}
        onToggle={handleToggle}
      />
      <ApiKeyInput onSaved={setApiKey} />
      {screenshot && (
        <ScreenshotPreview
          dataUrl={screenshot.dataUrl}
          tabUrl={screenshot.tabUrl}
          onClear={() => setScreenshot(null)}
        />
      )}
      <TranscriptDisplay messages={messages} />
      
    </div>
  )
}

export default App
