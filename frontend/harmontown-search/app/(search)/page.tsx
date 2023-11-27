'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

import s from './page.module.scss'
import { findEpisodeByNumber, fetchEpisodeIndex, jumpToMediaPlayer, getTimecodeLocalStorageKey } from '../utils'
import EpisodeSearchBar from './SearchBar'
import MediaPlayer from './MediaPlayer'
import TranscriptSearchResults from './TranscriptSearchResults'
import EpisodeSearchResults from './EpisodeSearchResults'


export default function Search({
  children,
  params
} : {
  children: React.ReactNode,
  params: { number: 'string' }
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [episodes, setEpisodes] = useState([])

  const queryParams = {
    query: searchParams.get('q') || '',
    timecode: searchParams.get('t') || ''
  }

  useEffect(() => {
    (async () => {
      const episodes = await fetchEpisodeIndex()
      setEpisodes(episodes)
    })()
  }, [])

  const currentEpisodeNumber = Number(params.number)
  const startTimecode = useMemo(() => Number(
    queryParams.timecode ||
    (typeof window !== 'undefined' && window.localStorage.getItem(getTimecodeLocalStorageKey(currentEpisodeNumber)))
  ), [currentEpisodeNumber, queryParams.timecode])

  const currentEpisode = useMemo(() =>
    findEpisodeByNumber(episodes, currentEpisodeNumber),
    [episodes, currentEpisodeNumber])

  const handleSearch = (term) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    replace(`${pathname}?${params.toString()}`)
    // remove focus from the input to hide keyboard on mobile
    document.activeElement.blur()
  }

  return (
    <>
      {children}
      <EpisodeSearchBar
        initialQuery={queryParams.query}
        handleSearch={handleSearch}
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
