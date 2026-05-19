export const DAY_VIDEOS = {
  two: 'T5MOtCLiP1Y',
  three: 'TkEgbwloPq8',
} as const satisfies Record<string, string>

export const STANDALONE_VIDEOS = {
  intro: 'JDAm_fcU6nY',
  sidequest: 'mpyxh8IckzI',
  end: 'M273a_GPXpw',
} as const satisfies Record<string, string>

export type DayName = keyof typeof DAY_VIDEOS

export function isDayName(value: string): value is DayName {
  return value in DAY_VIDEOS
}
