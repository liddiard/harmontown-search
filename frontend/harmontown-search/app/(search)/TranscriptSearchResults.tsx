import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import Typesense from 'typesense'

import s from './TranscriptSearchResults.module.scss'
import { TYPESENSE_CONFIG, Episode } from '@/constants'
import { findEpisodeByNumber, formatTimecode, jumpToMediaPlayer } from '../utils';
import EpisodeInfo from '../EpisodeInfo'
import LoadingSpinner from '../LoadingSpinner'

const client = new Typesense.Client(TYPESENSE_CONFIG)
const RESULTS_PER_PAGE = 10

interface TranscriptSearchResultsProps {
  query: string
  episodes: Episode[],
  currentEpisode: Episode
}

export default function TranscriptSearchResults({
  query = '',
  episodes = [],
  currentEpisode
}: TranscriptSearchResultsProps) {
  const [results, setResults] = useState([])
  const [numFound, setNumFound] = useState<number | null>(null)
  
  const resultsEl = useRef<HTMLOListElement>(null)
  // current last page of search results
  const page = useRef(1)
  const loading = useRef(false)

  const transcriptId = 'transcript-search-results'

  const search = useCallback(async (query, page) => {
    loading.current = true
    const res = await client.collections('transcripts').documents().search({
      q: query,
      query_by: 'text',
      group_by: 'episode',
      group_limit: 10,
      sort_by: 'episode:asc',
      page
    })
    return res
  }, [])

  const handleScroll = useCallback(async () => {
    const currentlyDisplayed = page.current * RESULTS_PER_PAGE
    if (
      !resultsEl.current ||
      currentlyDisplayed >= numFound ||
      loading.current
    ) {
      return
    }
    const { innerHeight } = window
    const { y, height } = resultsEl.current.getBoundingClientRect()
    // y: top of search results list, relative to viewport
    // height: height of search results list
    // innerHeight: viewport height
    const distanceToBottomOfResults = (y + height) - innerHeight
    if (distanceToBottomOfResults < innerHeight / 2) {
      const res = await search(query, ++page.current)
      setResults(prevResults => [...prevResults, ...res.grouped_hits])
    }
  }, [query, search, numFound])

  const getHitUrl = (epNumber, document) => {
    const params = new URLSearchParams(window.location.search)
    params.set('t', Math.floor(document.start/1000).toString())
    return `/episode/${epNumber}?${params.toString()}`
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    // wait for the results to be added to the DOM for infinite scroll before
    // considering loading complete
    loading.current = false
  }, [results])

  useEffect(() => {
    (async () => {
      page.current = 1
      if (!query) {
        return
      }
      setResults([])
      const res = await search(query, page.current)
      setResults(res.grouped_hits)
      setNumFound(res.found)
    })()
  }, [query, search])

  if (!episodes.length || !query) {
    return null
  }

  return (
    <>
      <h2 id={transcriptId}>
        <span className="numResults">{numFound ?? 0} </span>
        Transcript{numFound !== 1 ? 's' : null}
      </h2>
      {numFound ? <ol className={s.results} ref={resultsEl}>
        {results.map(({ group_key, hits }) => {
          const epNumber = group_key[0]
          const selected = epNumber === currentEpisode
          const episode = findEpisodeByNumber(episodes, epNumber)
          return <li key={epNumber} className={selected ? 'selected' : ''}>
            <EpisodeInfo {...episode} className={s.episodeInfo} selected={selected} />
            <ol className={s.hits}>
              {hits
              .sort((a, b) => a.document.start - b.document.start)
              .map(({ document, highlight }) => 
                <li 
                  key={document.id}
                >
                  <Link 
                    href={getHitUrl(epNumber, document)}
                    className="selectable"
                    onClick={jumpToMediaPlayer}
                  >
                    <time className={s.timecode}>
                      {formatTimecode(document.start)}
                    </time>
                    <span dangerouslySetInnerHTML={{
                      __html: highlight.text.snippet
                    }}/>
                  </Link>
                </li>
              )}
            </ol>
          </li>
        })}
      </ol> : null}
      <LoadingSpinner 
        loading={results.length < (numFound ?? Infinity)}
        className={s.spinner}
      />
    </>
  )
}

TranscriptSearchResults.propTypes = {
  query: PropTypes.string.isRequired,
  episodes: PropTypes.array.isRequired,
  currentEpisode: PropTypes.number
}