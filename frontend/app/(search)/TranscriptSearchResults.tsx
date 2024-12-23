import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import Typesense from 'typesense'
import { SearchResponse } from 'typesense/lib/Typesense/Documents'
import classNames from 'classnames'
import debounce from 'lodash.debounce'
import { useErrorBoundary } from 'react-error-boundary'

import s from './TranscriptSearchResults.module.scss'
import { TYPESENSE_CONFIG } from '@/constants'
import { EpisodeList, TranscriptLine } from '@/types'
import { findEpisodeByNumber, formatTimecode } from '@/utils'
import EpisodeInfo from '@/components/EpisodeInfo'
import LoadingSpinner from '@/components/LoadingSpinner'

const client = new Typesense.Client(TYPESENSE_CONFIG)
const RESULTS_PER_PAGE = 10

interface IndexedTranscriptLine extends TranscriptLine {
  id: 'string'
}

interface TranscriptSearchResultsProps {
  query: string
  episodes: EpisodeList
  currentEpisode: number
}

export default function TranscriptSearchResults({
  query = '',
  episodes = [],
  currentEpisode,
}: TranscriptSearchResultsProps) {
  const { showBoundary } = useErrorBoundary()

  const [results, setResults] = useState<
    SearchResponse<IndexedTranscriptLine>['grouped_hits']
  >([])
  const [numFound, setNumFound] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const resultsEl = useRef<HTMLOListElement>(null)
  // current last page of search results
  const page = useRef(1)

  const transcriptId = 'transcript-search-results'

  const search = useCallback(
    async (query: string, page: number) => {
      setLoading(true)
      // @ts-ignore because we're using a scoped search key with embedded params,
      // but TypeScript doesn't recognize this and complains that params are
      // missing on the search function call
      const res = await client
        .collections('transcripts')
        .documents()
        .search({
          q: query,
          page,
          // N.B. There are other params used in this search that are not listed
          // here, which come from the scoped search API key the client is using.
          // See these additional params in `frontend/generate_scoped_search_key.sh`.
        })
        .catch(showBoundary)
      return res as SearchResponse<IndexedTranscriptLine>
    },
    [showBoundary]
  )

  const handleScroll = debounce(
    useCallback(async () => {
      const currentlyDisplayed = page.current * RESULTS_PER_PAGE
      if (!resultsEl.current || currentlyDisplayed >= numFound || loading) {
        return
      }
      const { innerHeight } = window
      const { y, height } = resultsEl.current.getBoundingClientRect()
      // y: top of search results list, relative to viewport
      // height: height of search results list
      // innerHeight: viewport height
      const distanceToBottomOfResults = y + height - innerHeight
      if (distanceToBottomOfResults < innerHeight / 2) {
        const res = await search(query, ++page.current)
        setResults((prevResults) => [...prevResults!, ...res.grouped_hits!])
      }
    }, [query, search, numFound, loading]),
    500,
    { leading: true, maxWait: 500 }
  )

  const getHitUrl = (epNumber: number, document: { start: number }) => {
    const params = new URLSearchParams(window.location.search)
    params.set('t', Math.floor(document.start / 1000).toString())
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
    setLoading(false)
  }, [results])

  useEffect(() => {
    ;(async () => {
      page.current = 1
      if (!query) {
        return
      }
      setResults([])
      const res = await search(query, page.current)
      setResults(res.grouped_hits!)
      setNumFound(res.found)
    })()
  }, [query, search])

  if (!episodes.length || !query) {
    return null
  }

  return (
    <>
      {results?.length || !loading ? (
        <h2 id={transcriptId}>
          <span className={s.numResults}>{numFound ?? 0} </span>
          Transcript{numFound !== 1 ? 's' : null}
        </h2>
      ) : null}
      {results?.length ? (
        <ol className={s.results} ref={resultsEl}>
          {results.map(({ group_key, hits }) => {
            const epNumber = Number(group_key[0])
            const selected = epNumber === currentEpisode
            const episode = findEpisodeByNumber(episodes, epNumber)
            if (!episode) {
              return
            }
            return (
              <li key={epNumber} className={classNames({ selected })}>
                <EpisodeInfo
                  {...episode}
                  className={s.episodeInfo}
                  selected={selected}
                />
                <ol className={s.hits}>
                  {hits
                    .sort((a, b) => a.document.start - b.document.start)
                    .map(({ document, highlight }) => (
                      <li key={document.id}>
                        <Link
                          href={getHitUrl(epNumber, document)}
                          className="selectable"
                        >
                          <time className={s.timecode}>
                            {formatTimecode(document.start)}
                          </time>
                          {highlight.text?.snippet ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlight.text.snippet,
                              }}
                            />
                          ) : null}
                        </Link>
                      </li>
                    ))}
                </ol>
              </li>
            )
          })}
        </ol>
      ) : null}
      <LoadingSpinner
        loading={loading || results!.length < numFound}
        className={s.spinner}
      />
    </>
  )
}
