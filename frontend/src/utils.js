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