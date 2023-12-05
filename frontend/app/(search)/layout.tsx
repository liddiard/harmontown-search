'use client'

import { useSearchParams, useParams } from 'next/navigation'

import s from './page.module.scss'
import EpisodeSearchBar from './SearchBar'
import TranscriptSearchResults from './TranscriptSearchResults'
import EpisodeSearchResults from './EpisodeSearchResults'
import episodes from '@/episode_list.tsv'


export default function Search({
  children
} : {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()

  const queryParams = {
    query: searchParams.get('q') || '',
    timecode: searchParams.get('t') || '',
  }

  const currentEpisode = Number(useParams().number)

  return (
    <>
      {children}
      <EpisodeSearchBar
        initialQuery={queryParams.query}
        searchParams={searchParams}
      />
      <div className={s.results}>
        <EpisodeSearchResults
          episodes={episodes}
          query={queryParams.query}
          currentEpisode={currentEpisode}
        />
        <TranscriptSearchResults
          query={queryParams.query}
          currentEpisode={currentEpisode}
          episodes={episodes}
        />
      </div>
    </>
  )
}
