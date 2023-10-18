import Papa from 'papaparse'
import Fuse from 'fuse.js'
import { papaConfig, fuseConfig } from './constants'

// fetch and parse the TSV file of all episodes
export const fetchEpisodeIndex = () => new Promise((resolve, reject) =>
  Papa.parse('/episode_list.tsv', {
    ...papaConfig,
    complete: (results) => {
      resolve(results.data)
    }
  })
)

// fetch and parse the TSV file of a transcript with the passed episode `number`
export const fetchTranscript = (number) => new Promise((resolve, reject) =>
  Papa.parse(`/transcripts/${number}.tsv`, {
    ...papaConfig,
    complete: (results) => {
      const index = new Fuse(results.data, fuseConfig.transcript)
      resolve({ 
        transcript: results.data,
        index
      })
    }
  })
)

// given some search `result` text and the original `query`, return a markup
// string with whole words in `query` that match a substring of the `result`
// wrapped in an <mark> tag
export const highlightMatches = (result = '', query) => {
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
export const findEpisodeByNumber = (episodes, number) =>
  episodes.find(ep => ep.number === number)

// returns if `value` is between `start` (inclusive) and `end` (exclusive)
export const inRange = (value, start, end) =>
  value >= start && value < end

// take a timecode in milliseconds and return a string in the format "H:MM:SS"
export const formatTimecode = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const secondsRemaining = seconds % 60;
  const minutesRemaining = minutes % 60;

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

// jump to an anchor (element ID) on the page
const jumpToHash = (id) => {
  const { location, history } = window
  const originalUrl = location.href;               // Save down the URL without hash
  location.href = `#${id}`;                        // Go to the target element
  history.replaceState(null, null, originalUrl);   // Remove the hash after jump
}

export const jumpToMediaPlayer = () => 
  jumpToHash('media-player')

export const getQueryParamsWithoutTimecode = () => {
  const params = new URLSearchParams(window.location.search)
  params.delete('t')
  return params.size ? `?${params.toString()}` : ''
}

// call `callback` if the passed event was a keypress that should act as a
// selection of the focused element (keyboard accessibility)
export const handleKeyboardSelect = (ev, callback) => {
  // enter or space keys
  if (ev.keyCode === 13 || ev.keyCode === 32) {
    ev.preventDefault()
    callback()
  }
}

export const mask = (str = '') =>
  new Array(str.length).fill('█').join('')