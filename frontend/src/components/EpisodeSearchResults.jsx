import { useState, useRef, useEffect } from 'react'
import Fuse from 'fuse.js'
import EpisodeResult from './EpisodeResult'
import s from './EpisodeSearchResults.module.scss'
import { fuseConfig } from '../constants'

export default function EpisodeSearchResults({
  episodes,
  query,
  currentEpisodeNumber,
  setCurrentEpisode
}) {
  const [results, setResults] = useState([])
  const fuse = useRef(null)

  useEffect(() => {
    if (episodes.length) {
      fuse.current = new Fuse(episodes, fuseConfig.episode)
    }
  }, [episodes])

  useEffect(() => {
    if (query && fuse.current) {
      setResults(fuse.current.search(query))
    }
  }, [query])

  if (!results.length) {
    return null
  }
  return (
    <>
      <h2>
        <span className="numResults">{results.length} </span>
        Episode description{results.length > 1 ? 's' : null}
      </h2>
      <ol className={s.results}>
        {results.map(result => 
          <EpisodeResult
            key={result.item.number}
            query={query}
            selected={result.item.number === currentEpisodeNumber}
            setEpisode={setCurrentEpisode}
            result={result.item} />
        )}
      </ol>
    </>
  )
}