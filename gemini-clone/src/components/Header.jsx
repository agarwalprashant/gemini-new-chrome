import './Header.css'

export default function Header({ status = 'idle', statusText = 'Click to start', isLive = false, onToggle }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className={`breathing-indicator ${status}`} />
        <div className="status-text">
          <span className="status-main">{statusText}</span>
          <span className="status-sub">
            {isLive ? 'Live conversation active' : 'Click to start live conversation'}
          </span>
        </div>
      </div>
      <button className={`toggle-btn ${isLive ? 'stop' : 'play'}`} onClick={onToggle}>
        {isLive ? '⏹' : '▶'}
      </button>
    </header>
  )
}