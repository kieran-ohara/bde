import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$')({
  beforeLoad: () => {
    throw redirect({ to: '/day-{$dayName}', params: { dayName: 'one' } })
  },
})
