import { describe, it, expect } from 'vitest'
import { DAY_VIDEOS } from '../../src/config/days'

const DAY_NAME_PATTERN = /^[a-z]+$/
const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/

describe('DAY_VIDEOS config', () => {
  it('has at least one entry', () => {
    expect(Object.keys(DAY_VIDEOS).length).toBeGreaterThan(0)
  })

  for (const [name, id] of Object.entries(DAY_VIDEOS)) {
    it(`entry "${name}" has a valid day name`, () => {
      expect(name).toMatch(DAY_NAME_PATTERN)
    })

    it(`entry "${name}" has a valid YouTube video ID`, () => {
      expect(id).toMatch(YOUTUBE_ID_PATTERN)
    })
  }
})
