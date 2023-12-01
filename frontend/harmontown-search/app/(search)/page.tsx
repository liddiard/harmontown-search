import { useState, useMemo, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import s from './page.module.scss'
import { findEpisodeByNumber, jumpToMediaPlayer, getTimecodeLocalStorageKey } from '../utils'
import { fetchEpisodeIndex } from '@/episodeIndex'
import EpisodeSearchBar from './SearchBar'
import MediaPlayer from './MediaPlayer'
import TranscriptSearchResults from './TranscriptSearchResults'
import EpisodeSearchResults from './EpisodeSearchResults'


export default async function Search({
  children,
  params,
  searchParams
} : {
  children: React.ReactNode,
  params: { number: 'string' },
  searchParams?: {
    q?: string,
    t?: string,
  },
}) {
  const episodes = await fetchEpisodeIndex()

  const queryParams = {
    query: searchParams.q || '',
    timecode: searchParams.t || ''
  }

  const currentEpisodeNumber = Number(params.number)
  // const startTimecode = useMemo(() => Number(
  //   queryParams.timecode ||
  //   (typeof window !== 'undefined' && window.localStorage.getItem(getTimecodeLocalStorageKey(currentEpisodeNumber)))
  // ), [currentEpisodeNumber, queryParams.timecode])

  // const currentEpisode = useMemo(() =>
  //   findEpisodeByNumber(episodes, currentEpisodeNumber),
  //   [episodes, currentEpisodeNumber])

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
          currentEpisode={currentEpisodeNumber}
        />
        <TranscriptSearchResults
          query={queryParams.query}
          currentEpisode={currentEpisodeNumber}
          episodes={episodes}
        />
      </div>
    </>
  )
}
