import { useState, useEffect } from 'react'
import './ApiKeyInput.css'

export default function ApiKeyInput({ onSaved }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    chrome.storage.local.get('geminiApiKey', (result) => {
      if (result.geminiApiKey) {
        setValue(result.geminiApiKey)
        onSaved?.(result.geminiApiKey)
      }
    })
  }, [])

  function handleSave() {
    if (!value.trim()) return
    chrome.storage.local.set({ geminiApiKey: value.trim() }, () => {
      onSaved?.(value.trim())
      setSaved(true)
      setOpen(false)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="apikey-wrap">
      <button className="apikey-toggle" onClick={() => setOpen(o => !o)}>
        {saved ? '✓ Saved' : '🔑 API Key'}
      </button>
      {open && (
        <div className="apikey-box">
          <input
            type="password"
            className="apikey-input"
            placeholder="Enter Gemini API key"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          <button className="apikey-save" onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  )
}