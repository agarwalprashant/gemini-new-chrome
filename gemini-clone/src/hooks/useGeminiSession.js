import { useRef, useState, useCallback } from 'react'

const MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025'
const API_VERSION = 'v1beta'
const TARGET_SAMPLE_RATE = 16000
const WORKLET_BUFFER_SIZE = 4096
const PLAYBACK_SAMPLE_RATE = 24000
const SCREENSHOT_INTERVAL_MS = 3000

// ── helpers ──────────────────────────────────────────────────────────────────
function ab2b64(buffer) {
  const bytes = new Uint8Array(buffer)
  let bin = ''
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

function b642ab(b64) {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out.buffer
}

// ── hook ─────────────────────────────────────────────────────────────────────
export function useGeminiSession() {
  const [status, setStatus]         = useState('idle')
  const [statusText, setStatusText] = useState('Ready')
  const [messages, setMessages]     = useState([])
  const [screenshot, setScreenshot] = useState(null)

  // session refs (never trigger re-render)
  const wsRef           = useRef(null)
  const audioCtxRef     = useRef(null)
  const micStreamRef    = useRef(null)
  const workletNodeRef  = useRef(null)
  const audioQueueRef   = useRef([])
  const isPlayingRef    = useRef(false)
  const screenshotTimer = useRef(null)
  const setupDoneRef    = useRef(false)
  const liveRef         = useRef(false)
  const userMsgIdRef    = useRef(null)
  const aiMsgIdRef      = useRef(null)

  // ── audio playback ────────────────────────────────────────────────────────
  function playNext() {
    if (!audioQueueRef.current.length) { isPlayingRef.current = false; return }
    isPlayingRef.current = true
    const buf = audioQueueRef.current.shift()
    if (buf.byteLength < 2) { playNext(); return }
    const ctx = audioCtxRef.current
    if (!ctx || ctx.state !== 'running') { isPlayingRef.current = false; return }
    try {
      const i16 = new Int16Array(buf)
      const f32 = new Float32Array(i16.length)
      for (let i = 0; i < i16.length; i++) f32[i] = i16[i] / 32768.0
      const ab  = ctx.createBuffer(1, f32.length, PLAYBACK_SAMPLE_RATE)
      ab.copyToChannel(f32, 0)
      const src = ctx.createBufferSource()
      src.buffer = ab
      src.connect(ctx.destination)
      src.start()
      src.onended = () => playNext()
    } catch (e) {
      console.error('[playNext]', e)
      isPlayingRef.current = false
    }
  }

  function enqueueAudio(arrayBuffer) {
    audioQueueRef.current.push(arrayBuffer)
    if (!isPlayingRef.current) playNext()
  }

  // ── transcript ────────────────────────────────────────────────────────────
  // Each event is a delta chunk — accumulate into existing bubble
  function appendToMessage(idRef, role, chunk) {
    setMessages(prev => {
      if (idRef.current) {
        return prev.map(m => m.id === idRef.current ? { ...m, text: m.text + chunk } : m)
      }
      const id = `${role}-${Date.now()}`
      idRef.current = id
      return [...prev, { id, role, text: chunk }]
    })
  }

  // ── incoming WS message handler ───────────────────────────────────────────
  function handleMsg(data) {
    if (data.setupComplete) {
      setupDoneRef.current = true
      setStatus('recording')
      setStatusText('Listening...')
      return
    }

    const sc = data.serverContent
    if (!sc) return

    if (sc.inputTranscription?.text)  appendToMessage(userMsgIdRef, 'user', sc.inputTranscription.text)
    if (sc.outputTranscription?.text) {
      setStatus('thinking')
      appendToMessage(aiMsgIdRef, 'ai', sc.outputTranscription.text)
    }

    sc.modelTurn?.parts?.forEach(part => {
      if (part.inlineData?.data) enqueueAudio(b642ab(part.inlineData.data))
    })

    if (sc.turnComplete) {
      userMsgIdRef.current = null
      aiMsgIdRef.current   = null
      if (liveRef.current) { setStatus('recording'); setStatusText('Listening...') }
    }
  }

  // ── start ─────────────────────────────────────────────────────────────────
  const start = useCallback(async (apiKey) => {
    if (!apiKey) { setStatus('error'); setStatusText('API key missing'); return }

    liveRef.current      = true
    setupDoneRef.current = false
    setMessages([])
    setStatus('idle')
    setStatusText('Connecting...')

    // 1. AudioContext + Worklet
    try {
      const ctx = new AudioContext({ sampleRate: 48000 })
      audioCtxRef.current = ctx
      await ctx.audioWorklet.addModule(chrome.runtime.getURL('src/audio-processor.js'))
    } catch (e) {
      setStatus('error'); setStatusText('Audio init failed'); liveRef.current = false; return
    }

    // 2. Microphone — request permission via iframe flow, then getUserMedia
    setStatusText('Requesting microphone...')
    try {
      // Injects iframe into active tab → triggers browser mic permission prompt
      await chrome.runtime.sendMessage({ action: 'requestMicrophonePermission' })
    } catch (_) { /* ignore — permission may already be granted */ }

    let micStream
    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, sampleRate: 48000, echoCancellation: true, noiseSuppression: true }
      })
      micStreamRef.current = micStream
    } catch (e) {
      setStatus('error')
      setStatusText(e.name === 'NotAllowedError' ? 'Microphone access denied' : `Mic error: ${e.message}`)
      liveRef.current = false
      return
    }

    // 3. WebSocket to Gemini Live
    setStatusText('Connecting...')
    const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.${API_VERSION}.GenerativeService.BidiGenerateContent?key=${apiKey}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(JSON.stringify({
        setup: {
          model: `models/${MODEL}`,
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
          },
          systemInstruction: {
            parts: [{ text: 'You are a helpful AI assistant. Respond naturally to voice input. Use screen captures for context. Keep responses concise.' }]
          },
          inputAudioTranscription:  {},
          outputAudioTranscription: {}
        }
      }))

      // Fallback: assume ready if no setupComplete within 2s
      setTimeout(() => {
        if (!setupDoneRef.current && liveRef.current) {
          setupDoneRef.current = true
          setStatus('recording')
          setStatusText('Listening...')
        }
      }, 2000)
    }

    ws.onmessage = async (ev) => {
      try {
        const text = ev.data instanceof Blob ? await ev.data.text() : ev.data
        handleMsg(JSON.parse(text))
      } catch (e) { console.error('[ws.onmessage]', e) }
    }

    ws.onerror = () => {
      if (liveRef.current) { setStatus('error'); setStatusText('Connection error') }
    }

    ws.onclose = (ev) => {
      if (liveRef.current) {
        setStatus('error')
        setStatusText(`Disconnected (${ev.code})`)
        liveRef.current = false
      }
    }

    // 4. Pipe mic → AudioWorklet → WS
    const ctx    = audioCtxRef.current
    const source = ctx.createMediaStreamSource(micStream)
    const node   = new AudioWorkletNode(ctx, 'audio-processor', {
      processorOptions: { targetSampleRate: TARGET_SAMPLE_RATE, bufferSize: WORKLET_BUFFER_SIZE }
    })
    node.port.onmessage = (e) => {
      if (!e.data.audioData) return
      if (ws.readyState !== WebSocket.OPEN || !setupDoneRef.current) return
      ws.send(JSON.stringify({
        realtime_input: {
          media_chunks: [{ mime_type: `audio/pcm;rate=${TARGET_SAMPLE_RATE}`, data: ab2b64(e.data.audioData) }]
        }
      }))
    }
    const gain = ctx.createGain()
    gain.gain.value = 0
    source.connect(node)
    node.connect(gain)
    gain.connect(ctx.destination)
    workletNodeRef.current = node

    // 5. Auto-screenshot every 3s → send to Gemini
    screenshotTimer.current = setInterval(async () => {
      const currentWs = wsRef.current
      if (!currentWs || currentWs.readyState !== WebSocket.OPEN || !setupDoneRef.current) return
      try {
        const resp = await chrome.runtime.sendMessage({ action: 'captureScreenshot' })
        if (!resp?.success || !resp.dataUrl) return
        setScreenshot({ dataUrl: resp.dataUrl, tabUrl: resp.tabUrl })
        const b64 = resp.dataUrl.substring(resp.dataUrl.indexOf(',') + 1)
        currentWs.send(JSON.stringify({
          realtime_input: { media_chunks: [{ mime_type: 'image/png', data: b64 }] }
        }))
      } catch (_) { /* silent */ }
    }, SCREENSHOT_INTERVAL_MS)
  }, [])

  // ── stop ──────────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    liveRef.current      = false
    setupDoneRef.current = false

    clearInterval(screenshotTimer.current); screenshotTimer.current = null
    micStreamRef.current?.getTracks().forEach(t => t.stop()); micStreamRef.current = null
    workletNodeRef.current?.disconnect(); workletNodeRef.current = null
    wsRef.current?.close(1000); wsRef.current = null
    audioCtxRef.current?.close(); audioCtxRef.current = null
    audioQueueRef.current = []
    isPlayingRef.current  = false

    setStatus('idle')
    setStatusText('Ready')
  }, [])

  return { start, stop, status, statusText, messages, screenshot, setScreenshot }
}