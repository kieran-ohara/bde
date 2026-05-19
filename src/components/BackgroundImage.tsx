import { useState } from 'react'
import backgroundUrl from '../assets/background.webp'

const FADE_IN_MS = 800

export function BackgroundImage() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <img
        src={backgroundUrl}
        alt=""
        aria-hidden
        onLoad={() => setLoaded(true)}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'contain',
          zIndex: -2,
          opacity: loaded ? 1 : 0,
          transition: `opacity ${FADE_IN_MS}ms ease`,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.5) 75%, rgba(0, 0, 0, 0.9) 100%)',
          pointerEvents: 'none',
          zIndex: -1,
          opacity: loaded ? 1 : 0,
          transition: `opacity ${FADE_IN_MS}ms ease`,
        }}
      />
    </>
  )
}
