import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import Fuse from 'fuse.js'

import s from './EpisodeSearchResults.module.scss'
import downArrow from 'img/triangle-down.svg'
import { Episode, fuseConfig } from '@/constants'
import { getQueryParamsWithoutTimecode } from 'utils'
import EpisodeInfo from 'EpisodeInfo'


interface EpisodeSearchResultsProps {
  episodes: Episode[],
  query: string,
  currentEpisode: number
}

export default function EpisodeSearchResults({
  episodes = [],
  query,
  currentEpisode,
}: EpisodeSearchResultsProps) {
  const [results, setResults] = useState<Fuse.FuseResult<Episode>[]>([])
  const [contentExceedsHeight, setContentExceedsHeight] = useState(false)
  const [scrollable, setScrollable] = useState(false)
  
  const resultListEl = useRef<HTMLOListElement>(null)
  const fuse = useRef<Fuse<Episode> | null>(null)

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
  }, [query, episodes])

  useEffect(() => {
    const el = resultListEl.current
    if (el) {
      setContentExceedsHeight(el && el.scrollHeight > el.clientHeight)
    }
  }, [results])

  if (!query || !results.length) {
    return
  }

  return (
    <div className={s.results}>
      <h2>
        <span className="numResults">{results.length} </span>
        Episode description{results.length !== 1 ? 's' : null}
      </h2>
      {results.length ? <ol 
        className={scrollable ? s.scrollable : ''}
        ref={resultListEl}
      >
        {results.map(result => {
          const { number } = result.item
          const selected = number === currentEpisode
          return <li 
            key={number}
          >
            <Link
              href={`/episode/${number}${getQueryParamsWithoutTimecode(window.location.search)}`}
              className={`selectable result ${selected ? 'selected' : ''}`}
            >
              <EpisodeInfo {...result.item} query={query} selected={selected} />
            </Link>
          </li>
        })}
      </ol> : null}
      {contentExceedsHeight && !scrollable ?
        <button 
          className={s.moreResults}
          onClick={() => setScrollable(true)}
        >
          More episodes <Image src={downArrow} alt="" />
        </button>
        : null
      }
    </div>
  )
}