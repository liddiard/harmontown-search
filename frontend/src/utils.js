import Papa from 'papaparse'
import Fuse from 'fuse.js'
import { fuseConfig } from './constants'

export const getEpisodeIndex = () => new Promise((resolve, reject) =>
  Papa.parse('/episode_list.tsv', {
    download: true,
    header: true,
    dynamicTyping: true,
    delimiter: '\t',
    complete: function(results) {
      const index = new Fuse(results.data, fuseConfig.episode)
      resolve({ 
        episodes: results.data,
        index
      })
    }
  })
)

export const highlightMatches = (result = '', query = '') =>
  query
  .trim()
  .split(/\s+/)
  .reduce((acc, cur) =>
    acc.replace(new RegExp(`(${cur})`, 'gi'), '<em>$1</em>'), result)

export const findEpisodeByNumber = (episodes, number) => 
  episodes.find(ep => ep.number === number)