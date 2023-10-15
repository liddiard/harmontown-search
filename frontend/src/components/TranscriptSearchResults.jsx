import { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import Typesense from 'typesense'

import s from './TranscriptSearchResults.module.scss'
import { TYPESENSE_CONFIG } from '../constants'
import { findEpisodeByNumber, formatTimecode, handleKeyboardSelect, jumpToMediaPlayer } from '../utils'
import EpisodeInfo from './EpisodeInfo'

const client = new Typesense.Client(TYPESENSE_CONFIG)

export default function TranscriptSearchResults({
  query = '',
  episodes = [],
  currentEpisode,
  setCurrentEpisode
}) {
  const [results, setResults] = useState([])
  const [totalResults, setTotalResults] = useState(0)

  const resultsEl = useRef(null)
  const loading = useRef(false)
  const page = useRef(1)
  const moreResultsToLoad = useRef(false)

  const transcriptId = 'transcript-search-results'

  const loadMoreResults = useCallback(async () => {
    const res = await search(query, page.current + 1)
    page.current++
    setResults(prevResults => [...prevResults, ...res.grouped_hits])
  }, [query])

  useEffect(() => {
    // infinte scroll
    const scrollListener = window.addEventListener('scroll', async () => {
      if (
        !resultsEl.current ||
        !moreResultsToLoad.current ||
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
        loading.current = true
        await loadMoreResults()
      }
    })
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [moreResultsToLoad, loadMoreResults])

  useEffect(() => {
    // wait for the results to be added to the DOM for infinite scroll before
    // considering loading complete
    loading.current = false
    if (results.length) {
      moreResultsToLoad.current = results.length < totalResults
    }
  }, [results, totalResults])

  useEffect(() => {
    (async () => {
      if (!query) {
        return
      }
      const res = await search(query)
      setResults(res.grouped_hits)
      setTotalResults(res.found)
    })()
    page.current = 1
  }, [query])

  const search = async (query, page = 1) => 
    await client.collections('transcripts').documents().search({
      q: query,
      query_by: 'text',
      group_by: 'episode',
      page
    })

  const handleLineSelect = (episode, timecode) => {
    setCurrentEpisode(episode, timecode / 1000)
    jumpToMediaPlayer()
  }

  if (!episodes.length || !totalResults || !query) {
    return null
  }

  return (
    <>
      <h2 id={transcriptId}>
        <span className="numResults">{totalResults} </span>
        Transcript{totalResults > 1 ? 's' : null}
      </h2>
      <ol className={s.results} ref={resultsEl}>
        {results.map(({ group_key, hits }) => {
          const epNumber = group_key[0]
          const selected = epNumber === currentEpisode
          const episode = findEpisodeByNumber(episodes, epNumber)
          return <li key={group_key[0]} className={selected ? 'selected' : ''}>
            <EpisodeInfo {...episode} className={s.episodeInfo} selected={selected} />
            <ol className={s.hits}>
              {hits
              .sort((a, b) => a.document.start - b.document.start)
              .map(({ document, highlight }) => 
                <li 
                  key={document.id}
                  className="selectable"
                  tabIndex={0}
                  role="link"
                  onKeyDown={(ev) =>
                    handleKeyboardSelect(ev, () => handleLineSelect(epNumber, document.start))}
                  onClick={() => handleLineSelect(epNumber, document.start)}
                >
                  <time className={s.timecode}>
                    {formatTimecode(document.start)}
                  </time>
                  <span dangerouslySetInnerHTML={{
                    __html: highlight.text.snippet
                  }}/>
                </li>
              )}
            </ol>
          </li>
        })}
      </ol>
    </>
  )
}

TranscriptSearchResults.propTypes = {
  query: PropTypes.string.isRequired,
  episodes: PropTypes.array.isRequired,
  currentEpisode: PropTypes.number,
  setCurrentEpisode: PropTypes.func.isRequired
}