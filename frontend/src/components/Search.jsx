import { useState, useEffect, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'

import s from './Search.module.scss'
import { findEpisodeByNumber, fetchEpisodeIndex, jumpToMediaPlayer } from '../utils'
import EpisodeSearchBar from './SearchBar'
import MediaPlayer from './MediaPlayer'
import { defaultTitle } from '../constants'
import TranscriptSearchResults from './TranscriptSearchResults'
import EpisodeSearchResults from './EpisodeSearchResults'

export default function Search() {
  const [searchParams, setSearchParams] = useOutletContext()

  const queryParams = {
    episode: Number(searchParams.get('ep')) || null,
    query: searchParams.get('q') || '',
    timecode: Number(searchParams.get('t')) || 0
  }

  const [episodes, setEpisodes] = useState([])
  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState(queryParams.episode)
  const [startTimecode, setStartTimecode] = useState(queryParams.timecode)
  const [submittedQuery, setSubmittedQuery] = useState(queryParams.query)

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
    searchParams.set('q', currentQuery)
    setSearchParams(searchParams)
  }

  const setCurrentEpisode = (ep, timecode = 0) => {
    setCurrentEpisodeNumber(ep)
    setStartTimecode(timecode)
    searchParams.delete('t')
    searchParams.set('ep', ep || '')
    setSearchParams(searchParams)
  }

  return (
    <>
      {currentEpisode ? 
        <MediaPlayer
          episode={currentEpisode}
          startTimecode={startTimecode}
          setCurrentEpisode={setCurrentEpisode}
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
          setCurrentEpisode={setCurrentEpisode}
        />
        <TranscriptSearchResults
          query={submittedQuery}
          currentEpisode={currentEpisodeNumber}
          episodes={episodes}
          setCurrentEpisode={setCurrentEpisode}
        />
      </div>
    </>
  )
}
