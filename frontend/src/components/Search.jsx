import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'

import s from './Search.module.scss'
import { findEpisodeByNumber, fetchEpisodeIndex, jumpToMediaPlayer, getTimecodeLocalStorageKey } from '../utils'
import EpisodeSearchBar from './SearchBar'
import MediaPlayer from './MediaPlayer'
import { defaultTitle } from '../constants'
import TranscriptSearchResults from './TranscriptSearchResults'
import EpisodeSearchResults from './EpisodeSearchResults'

export default function Search() {
  const [searchParams, setSearchParams] = useOutletContext()

  const queryParams = {
    query: searchParams.get('q') || '',
    timecode: searchParams.get('t') || ''
  }

  const [episodes, setEpisodes] = useState([])
  const [submittedQuery, setSubmittedQuery] = useState(queryParams.query)

  const currentEpisodeNumber = Number(useParams().epNumber)
  const startTimecode = useMemo(() => Number(
    queryParams.timecode ||
    window.localStorage.getItem(getTimecodeLocalStorageKey(currentEpisodeNumber))
  ), [currentEpisodeNumber, queryParams.timecode])

  const currentEpisode = useMemo(() =>
    findEpisodeByNumber(episodes, currentEpisodeNumber),
    [episodes, currentEpisodeNumber])

  useEffect(() => {
    (async () => {
      const episodes = await fetchEpisodeIndex()
      setEpisodes(episodes)
    })()
  }, [])

  useEffect(() => {
    if (currentEpisode) {
      jumpToMediaPlayer()
      document.title = `${currentEpisode.title} | ${defaultTitle}`
    } else {
      document.title = defaultTitle
    }
  }, [currentEpisode])

  const handleSearch = (currentQuery) => {
    setSubmittedQuery(currentQuery)
    // remove focus from the input to hide keyboard on mobile
    document.activeElement.blur()
    searchParams.set('q', currentQuery)
    setSearchParams(searchParams)
  }

  return (
    <>
      {currentEpisode ? 
        <MediaPlayer
          episode={currentEpisode}
          startTimecode={startTimecode}
        />
      : null}
      <EpisodeSearchBar
        initialQuery={queryParams.query}
        handleSearch={handleSearch}
      />
      <div className={s.results}>
        <EpisodeSearchResults
          episodes={episodes}
          query={submittedQuery}
          currentEpisode={currentEpisodeNumber}
        />
        <TranscriptSearchResults
          query={submittedQuery}
          currentEpisode={currentEpisodeNumber}
          episodes={episodes}
        />
      </div>
    </>
  )
}
