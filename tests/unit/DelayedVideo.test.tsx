import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { DelayedVideo } from '../../src/components/DelayedVideo'

describe('<DelayedVideo />', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('does not render the YouTube iframe before the 5s delay', () => {
    render(<DelayedVideo videoId="dQw4w9WgXcQ" />)
    expect(screen.queryByTitle(/video/i)).toBeNull()
  })

  it('renders the YouTube iframe after the 5s delay', () => {
    render(<DelayedVideo videoId="dQw4w9WgXcQ" />)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    const iframe = screen.getByTitle(/video/i)
    expect(iframe).toBeInTheDocument()
    expect(iframe.getAttribute('src')).toContain('dQw4w9WgXcQ')
    expect(iframe.getAttribute('src')).toContain('youtube-nocookie.com')
  })

  it('does not render the iframe before timer fires (4999ms)', () => {
    render(<DelayedVideo videoId="dQw4w9WgXcQ" />)

    act(() => {
      vi.advanceTimersByTime(4999)
    })

    expect(screen.queryByTitle(/video/i)).toBeNull()
  })
})
