import { useState, useRef, useEffect } from 'react'
import Typesense from 'typesense'
import s from './TranscriptSearchResults.module.scss'
import { TYPESENSE_CONFIG } from '../constants'
import { findEpisodeByNumber, formatTimecode, handleKeyboardSelect, jumpToHash, jumpToMediaPlayer } from '../utils'
import EpisodeInfo from './EpisodeInfo'

const client = new Typesense.Client(TYPESENSE_CONFIG)
const RESULTS_PER_PAGE = 10

export default function TranscriptSearchResults({
  query,
  episodes,
  currentEpisodeNumber,
  setCurrentEpisode
}) {
  const [results, setResults] = useState({})
  const page = useRef(1)

  const transcriptId = 'transcript-search-results'
  const numResultsDisplayed = RESULTS_PER_PAGE * page.current

  useEffect(() => {
    page.current = 1
  }, [query])

  useEffect(() => {
    (async () => {
      if (!query) {
        return
      }
      const res = await search(query)
      setResults(res)
    })()
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

  const loadMoreResults = async () => {
    page.current++
    const res = await search(query, page.current)
    setResults({
      ...results,
      grouped_hits: results.grouped_hits.concat(res.grouped_hits)
    })
  }

  if (!episodes.length || !results.found || !query) {
    return null
  }

  return (
    <>
      <h2 id={transcriptId}>
        <span className="numResults">{results.found} </span>
        Transcript{results.found > 1 ? 's' : null}
      </h2>
      <ol className={s.results}>
        {results.grouped_hits.map(({ group_key, hits }) => {
          const epNumber = group_key[0]
          const selected = epNumber === currentEpisodeNumber
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
        {results.found > numResultsDisplayed ? 
          <li>
            <button 
              className={s.moreResults}
              onClick={loadMoreResults}
            >
              {results.found - numResultsDisplayed} More results
            </button>
          </li> : null}
      </ol>
    </>
  )
}