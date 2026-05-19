import backgroundUrl from '../assets/background.webp'

export function BackgroundImage() {
  return (
    <>
      <img
        src={backgroundUrl}
        alt=""
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -2,
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
        }}
      />
    </>
  )
}
