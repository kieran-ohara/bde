import { createFileRoute } from '@tanstack/react-router'
import { STANDALONE_VIDEOS } from '../config/days'
import { DelayedVideo } from '../components/DelayedVideo'

export const Route = createFileRoute('/sidequest')({
  component: () => <DelayedVideo videoId={STANDALONE_VIDEOS.sidequest} />,
})
