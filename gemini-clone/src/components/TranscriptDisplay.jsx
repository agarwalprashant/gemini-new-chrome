import { useEffect, useRef } from 'react'
import './TranscriptDisplay.css'

export default function TranscriptDisplay({ messages }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!messages.length) {
    return (
      <div className="transcript empty">
        <p className="transcript-hint">Start a live conversation to see the transcript here.</p>
      </div>
    )
  }

  return (
    <div className="transcript">
      {messages.map((msg) => (
        <div key={msg.id} className={`transcript-message ${msg.role}`}>
          <span className="speaker">{msg.role === 'user' ? 'You' : 'AI'}</span>
          <span className="text">{msg.text}</span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}