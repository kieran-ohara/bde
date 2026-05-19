import { createRootRoute, Outlet } from '@tanstack/react-router'
import { BackgroundImage } from '../components/BackgroundImage'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <BackgroundImage />
      <Outlet />
    </div>
  )
}
