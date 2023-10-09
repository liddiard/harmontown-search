import { useState, useEffect, useRef, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import Fuse from 'fuse.js'
import s from './EpisodeSearch.module.scss'
import { findEpisodeByNumber, fetchEpisodeIndex } from '../utils'
import EpisodeSearchBar from './EpisodeSearchBar'
import EpisodeResult from './EpisodeResult'
import MediaPlayer from './MediaPlayer'
import { defaultTitle } from '../constants'


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
  const [episodeResults, setEpisodeResults] = useState([])

  const fuse = useRef(new Fuse())
  const currentEpisode = useMemo(() =>
    findEpisodeByNumber(episodes, currentEpisodeNumber),
    [episodes, currentEpisodeNumber]);

  useEffect(() => {
    (async () => {
      const { episodes, index } = await fetchEpisodeIndex()
      setEpisodes(episodes)
      fuse.current = index

      const searchParams = new URLSearchParams(window.location.search)
      const query = searchParams.get('q')
      if (query) {
        setEpisodeResults(fuse.current.search(query))
      }
    })()
  }, []);

  useEffect(() => {
    if (currentEpisode) {
      const { location, history } = window
      const originalUrl = location.href;               // Save down the URL without hash
      location.href = '#media-player';                 // Go to the target element
      history.replaceState(null, null, originalUrl);   // Remove the hash after jump
      document.title = `${currentEpisode.title} | ${defaultTitle}`
    } else {
      document.title = defaultTitle
    }
  }, [currentEpisode])

  const handleSearch = (currentQuery) => {
    setSubmittedQuery(currentQuery)
    setEpisodeResults(fuse.current.search(currentQuery))
    searchParams.set('q', currentQuery)
    setSearchParams(searchParams)
  }

  const setCurrentEpisode = (ep) => {
    setCurrentEpisodeNumber(ep)
    setStartTimecode(0)
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
        {episodeResults.length ? 
          <div className="episodes">
            <h2>
              <span className={s.numResults}>{episodeResults.length} </span>
              Episode{episodeResults.length > 1 ? 's' : null}
            </h2>
            <ol>
              {episodeResults.map(result => 
                <EpisodeResult
                  key={result.item.number}
                  query={submittedQuery}
                  selected={result.item.number === currentEpisodeNumber}
                  setEpisode={setCurrentEpisode}
                  result={result.item} />
              )}
            </ol>
          </div>
        : null}
      </div>
    </>
  )
}