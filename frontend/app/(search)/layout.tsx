'use client'
export const dynamic = 'force-static'

import { useSearchParams, useParams } from 'next/navigation'

import s from './layout.module.scss'
import EpisodeSearchBar from './SearchBar'
import TranscriptSearchResults from './TranscriptSearchResults'
import EpisodeSearchResults from './EpisodeSearchResults'
import episodes from '@/episode_list.tsv'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense } from 'react'

interface SearchProps {
  children: React.ReactNode
}

function Search({ children }: SearchProps) {
  const searchParams = useSearchParams()

  const queryParams = {
    query: searchParams.get('q') || '',
    timecode: searchParams.get('t') || '',
  }

  const currentEpisode = Number(useParams().number)

  const renderTranscriptSearchError = ({ error }: { error: unknown }) => (
    <div className={s.error}>
      <h2>Error loading transcript search results. Refresh to try again.</h2>
      <pre>{error instanceof Error ? error.stack : String(error)}</pre>
    </div>
  )

  return (
    <>
      {children}
      <EpisodeSearchBar
        initialQuery={queryParams.query}
        searchParams={searchParams}
        currentEpisode={currentEpisode}
      />
      <div className={s.results}>
        <EpisodeSearchResults
          episodes={episodes}
          query={queryParams.query}
          currentEpisode={currentEpisode}
        />
        <ErrorBoundary fallbackRender={renderTranscriptSearchError}>
          <TranscriptSearchResults
            query={queryParams.query}
            currentEpisode={currentEpisode}
            episodes={episodes}
          />
        </ErrorBoundary>
      </div>
    </>
  )
}

// https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
export default function SearchWrapper(props: SearchProps) {
  return (
    <Suspense>
      <Search {...props} />
    </Suspense>
  )
}
