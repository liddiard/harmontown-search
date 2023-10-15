import { useState, useRef, useEffect } from 'react'
import Fuse from 'fuse.js'
import s from './EpisodeSearchResults.module.scss'
import { fuseConfig } from '../constants'
import { handleKeyboardSelect } from '../utils';
import EpisodeInfo from './EpisodeInfo'

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
        {results.map(result => {
          const selected = result.item.number === currentEpisodeNumber
          return <li 
            className={`selectable result ${selected ? 'selected' : ''}`}
            onClick={() => setCurrentEpisode(currentEpisodeNumber)}
            onKeyDown={(ev) => 
              handleKeyboardSelect(ev, () => setCurrentEpisode(currentEpisodeNumber))}
            role="link"
            tabIndex={0}
          >
            <EpisodeInfo {...result.item} query={query} selected={selected} />
          </li>
        })}
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