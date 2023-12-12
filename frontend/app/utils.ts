import Papa from 'papaparse'
import Fuse from 'fuse.js'

import { papaConfig, fuseConfig } from '@/constants'
import { Episode, EpisodeList, Transcript, TranscriptLine, QueryParams, MediaType } from '@/types'

interface TranscriptResponse {
  transcript: Transcript,
  index: Fuse<TranscriptLine>
}

// fetch and parse the TSV file of all episodes
let episodeIndex: EpisodeList
export const fetchEpisodeIndex = (): Promise<EpisodeList> => new Promise((resolve, reject) => {
  // return locally cached version if available
  if (episodeIndex) {
    return resolve(episodeIndex)
  }
  Papa.parse('/episode_list.tsv', {
    ...papaConfig as Papa.ParseRemoteConfig,
    complete: (results) => {
      episodeIndex = results.data as EpisodeList
      resolve(episodeIndex)
    }
  })
})

// fetch and parse the TSV file of a transcript with the passed episode `number`
export const fetchTranscript = (number: number): Promise<TranscriptResponse> => new Promise((resolve, reject) =>
  // I believe TypeScript is not able to read `download: true` from the
  // `papaConfig` which causes it to complain that I'm using a `complete`
  // function without downloading. The error goes away if I move the
  // `download: true` into the second argument here (i.e. the exact same code).
  Papa.parse(`/transcripts/${number}.tsv`, {
    ...papaConfig as Papa.ParseRemoteConfig,
    complete: (results) => {
      const transcript = results.data
      const index = new Fuse(transcript, fuseConfig.transcript)
      resolve({ 
        transcript,
        index
      })
    }
  })
)

// given some search `result` text and the original `query`, return a markup
// string with whole words in `query` that match a substring of the `result`
// wrapped in an <mark> tag
export const highlightMatches = (result = '', query = '') => {
  if (!query) {
    return result
  }
  return query
  .trim()
  .split(/\s+/)
  .reduce((acc, cur) =>
    acc.replace(new RegExp(`(${cur})`, 'gi'), '<mark>$1</mark>'), result)
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
const jumpToHash = (id: string) => {
  const { location, history } = window
  const originalUrl = location.href              // Save down the URL without hash
  location.href = `#${id}`                       // Go to the target element
  history.replaceState(null, '', originalUrl)    // Remove the hash after jump
}

export const jumpToMediaPlayer = () => 
  jumpToHash('media-player')

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