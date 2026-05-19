import { describe, it, expect } from 'vitest'
import { DAY_VIDEOS, STANDALONE_VIDEOS } from '../../src/config/days'

const PAGE_NAME_PATTERN = /^[a-z]+$/
const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/

describe.each([
  ['DAY_VIDEOS', DAY_VIDEOS],
  ['STANDALONE_VIDEOS', STANDALONE_VIDEOS],
])('%s config', (_label, videos) => {
  it('has at least one entry', () => {
    expect(Object.keys(videos).length).toBeGreaterThan(0)
  })

  for (const [name, id] of Object.entries(videos)) {
    it(`entry "${name}" has a valid page name`, () => {
      expect(name).toMatch(PAGE_NAME_PATTERN)
    })

    it(`entry "${name}" has a valid YouTube video ID`, () => {
      expect(id).toMatch(YOUTUBE_ID_PATTERN)
    })
  }
})
