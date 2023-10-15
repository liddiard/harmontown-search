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
  const [contentExceedsHeight, setContentExceedsHeight] = useState(false)
  const [scrollable, setScrollable] = useState(false)
  
  const resultListEl = useRef(null)
  const fuse = useRef(null)

  useEffect(() => {
    if (episodes.length) {
      fuse.current = new Fuse(episodes, fuseConfig.episode)
    }
  }, [episodes])

  useEffect(() => {
    if (query && fuse.current) {
      setResults(fuse.current.search(query))
      setScrollable(false)
    }
    if (resultListEl.current) {
      resultListEl.current.scrollTop = 0
    }
  }, [query])

  useEffect(() => {
    const el = resultListEl.current
    if (el) {
      setContentExceedsHeight(el.scrollHeight > el.clientHeight)
    }
  }, [results])

  if (!results.length) {
    return null
  }
  return (
    <div className={s.results}>
      <h2>
        <span className="numResults">{results.length} </span>
        Episode description{results.length > 1 ? 's' : null}
      </h2>
      <ol 
        className={scrollable ? s.scrollable : ''}
        ref={resultListEl}
      >
        {results.map(result => 
          <EpisodeResult
            key={result.item.number}
            query={query}
            selected={result.item.number === currentEpisodeNumber}
            setEpisode={setCurrentEpisode}
            result={result.item} />
        )}
      </ol>
      {contentExceedsHeight && !scrollable ?
        <button 
          className={s.moreResults}
          onClick={() => setScrollable(true)}
        >
          More episode results ⏷
        </button>
        : null
      }
    </div>
  )
}