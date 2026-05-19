import { useEffect, useState } from 'react'

const REVEAL_DELAY_MS = 5000

interface DelayedVideoProps {
  videoId: string
}

export function DelayedVideo({ videoId }: DelayedVideoProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setVisible(true)
    }, REVEAL_DELAY_MS)

    return () => {
      window.clearTimeout(handle)
    }
  }, [])

  if (!visible) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(90vw, 960px)',
        aspectRatio: '16 / 9',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.6)',
      }}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title="video"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 0 }}
      />
    </div>
  )
}
