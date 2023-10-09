import { useState, useEffect } from 'react'
import Typesense from 'typesense'
import s from './TranscriptSearchResults.module.scss'
import { TYPESENSE_CONFIG } from '../constants'
import { findEpisodeByNumber, formatTimecode } from '../utils'
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
  const [page, setPage] = useState(1)

  useEffect(() => {
    (async () => {
      const res = await client.collections('transcripts').documents().search({
        q: query,
        query_by: 'text',
        group_by: 'episode',
        page
      })
      setResults(res)
    })()
  }, [query, page])

  if (!episodes.length || !results.found || !query) {
    return null
  }

  return (
    <>
      <h2>
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
                  onClick={() => setCurrentEpisode(group_key[0], document.start / 1000)}
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
      {results.found > RESULTS_PER_PAGE ? 
        <ol className={s.pagination}>
          {new Array(Math.ceil(results.found / RESULTS_PER_PAGE)).fill(null)
          .map((_, index) =>
            <li 
              className={`selectable ${page === index + 1 ? 'selected' : null}`}
              onClick={() => setPage(index + 1)}
              key={index}
            >
              {index + 1}
            </li>
          )}
        </ol> : null}
    </>
  )
}