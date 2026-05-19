import { createFileRoute } from '@tanstack/react-router'
import { STANDALONE_VIDEOS } from '../config/days'
import { DelayedVideo } from '../components/DelayedVideo'

export const Route = createFileRoute('/intro')({
  component: () => <DelayedVideo videoId={STANDALONE_VIDEOS.intro} />,
})
