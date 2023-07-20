import Papa from 'papaparse'
import Fuse from 'fuse.js'
import { papaConfig, fuseConfig } from './constants'


export const fetchEpisodeIndex = () => new Promise((resolve, reject) =>
  Papa.parse('/episode_list.tsv', {
    ...papaConfig,
    complete: (results) => {
      const index = new Fuse(results.data, fuseConfig.episode)
      resolve({ 
        episodes: results.data,
        index
      })
    }
  })
)

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

export const highlightMatches = (result = '', query) => {
  if (!query) {
    return result
  }
  return query
  .trim()
  .split(/\s+/)
  .reduce((acc, cur) =>
    acc.replace(new RegExp(`(${cur})`, 'gi'), '<em>$1</em>'), result)
}

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

  return [
    hours,
    minutesRemaining.toString().padStart(2, '0'),
    secondsRemaining.toString().padStart(2, '0')
  ]
  .filter(Boolean)
  .join(':')
}