import './ScreenshotPreview.css'

export default function ScreenshotPreview({ dataUrl, tabUrl, onClear }) {
  if (!dataUrl) return null

  let hostname = ''
  try { hostname = new URL(tabUrl).hostname } catch (_) {}

  return (
    <div className="screenshot-preview">
      <div className="screenshot-header">
        <span className="screenshot-source">{hostname || 'Screenshot'}</span>
        <button className="screenshot-clear" onClick={onClear} title="Remove">✕</button>
      </div>
      <img className="screenshot-img" src={dataUrl} alt="screenshot" />
    </div>
  )
}