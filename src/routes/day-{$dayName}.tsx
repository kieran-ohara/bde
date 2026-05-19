import { createFileRoute, redirect } from '@tanstack/react-router'
import { DAY_VIDEOS, isDayName } from '../config/days'
import { DelayedVideo } from '../components/DelayedVideo'

export const Route = createFileRoute('/day-{$dayName}')({
  beforeLoad: ({ params }) => {
    if (!isDayName(params.dayName)) {
      throw redirect({ to: '/day-{$dayName}', params: { dayName: 'one' } })
    }
  },
  component: DayPage,
})

function DayPage() {
  const { dayName } = Route.useParams()

  if (!isDayName(dayName)) {
    return null
  }

  return <DelayedVideo videoId={DAY_VIDEOS[dayName]} />
}
