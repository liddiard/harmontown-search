import { Episode, EpisodeList, QueryParams, MediaType } from '@/types'


// given some search `result` text and the original `query`, return a markup
// string with whole words in `result` that contain one of the words in `query`
// wrapped in an <mark> tag
export const highlightMatches = (result = '', query = '') => {
  if (!query) {
    return result
  }
  const queryWords = query.split(' ')
  const resultContainsQuery = (resultWord: string) => 
    queryWords.some(queryWord => new RegExp(queryWord, 'i').test(resultWord))
  
  return result
  .split(' ')
  .map(word => resultContainsQuery(word) ? `<mark>${word}</mark>` : word)
  .join(' ')
}

// given the `episodes` list and an episode `number`, return the episode
// metadata object matching the passed `number`
export const findEpisodeByNumber = (episodes: EpisodeList, number: number) =>
  episodes.find(ep => ep.number === number) || null

// returns if `value` is between `start` (inclusive) and `end` (exclusive)
export const inRange = (value: number, start: number, end: number) =>
  value >= start && value < end

// take a timecode in milliseconds and return a string in the format "H:MM:SS"
export const formatTimecode = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const secondsRemaining = seconds % 60
  const minutesRemaining = minutes % 60

  // if the timecode has hours, pad minutes like "1:05:20"
  // else pad minutes like "5:20" or "0:20"
  const minutesPadding = hours ? 2 : 1

  return [
    hours,
    minutesRemaining.toString().padStart(minutesPadding, '0'),
    secondsRemaining.toString().padStart(2, '0')
  ]
  .filter(Boolean)
  .join(':')
}

const dateFormat: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric' 
}

// format a Date object into an an array of parts which when joined make a
// string like "Jul 4, 2012"
export const formatDateToParts = (date: string | Date) => 
  Intl.DateTimeFormat('en-US', dateFormat).formatToParts(new Date(date))

export const formatDateToString = (date: string | Date) => 
  Intl.DateTimeFormat('en-US', dateFormat).format(new Date(date))

// jump to an anchor (element ID) on the page
export const jumpToHash = (id: string) => {
  const { location, history } = window
  const originalUrl = location.href              // Save down the URL without hash
  location.href = `#${id}`                       // Go to the target element
  history.replaceState(null, '', originalUrl)    // Remove the hash after jump
}

export const getQueryParamsWithoutTimecode = (querystring: string | QueryParams) => {
  const params = new URLSearchParams(querystring)
  params.delete('t')
  return params.size ? `?${params.toString()}` : ''
}

// call `callback` if the passed event was a keypress that should act as a
// selection of the focused element (keyboard accessibility)
export const handleKeyboardSelect = (ev: React.KeyboardEvent, callback: () => void) => {
  // enter or space keys
  if (['Enter', ' '].includes(ev.key)) {
    ev.preventDefault()
    callback()
  }
}

export const mask = (str = '') =>
  new Array(str.length).fill('█').join('')

// return media type (audio or video) + local media urls in development and
// CDN urls in prod
export const getMediaData = (episode: Episode) => {
  const { video_link, audio_link } = episode
  const mediaType = video_link ? MediaType.Video : MediaType.Audio
  let url
  if (process.env.NODE_ENV === 'development') {
    const ext = mediaType === MediaType.Video ? 'mp4' : 'mp3'
    url = `/episodes/${episode.number}.${ext}`
  } else {
    url = video_link || audio_link
  }
  return { mediaType, url }
}

// local storage key prefix for last listened-to timecode on an episode
// (to resume where you left off)
export const getTimecodeLocalStorageKey = (epNumber: number) =>
  `ep_timecode_${epNumber}`