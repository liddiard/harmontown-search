import { useState, useEffect, useRef, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import Fuse from 'fuse.js'
import s from './Search.module.scss'
import { findEpisodeByNumber, fetchEpisodeIndex } from '../utils'
import EpisodeResult from './EpisodeResult'
import magnifyingGlass from '../img/magnifying-glass.svg'
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
  const [currentQuery, setCurrentQuery] = useState(queryParams.query)
  const [submittedQuery, setSubmittedQuery] = useState(queryParams.query)
  const [episodeResults, setEpisodeResults] = useState([])
  const [searchPlaceholder, setSearchPlaceholder] = useState('')

  const fuse = useRef(new Fuse())
  const currentEpisode = useMemo(() =>
    findEpisodeByNumber(episodes, currentEpisodeNumber),
    [episodes, currentEpisodeNumber]);

  const placeholderInterval = useRef()

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

  const handleSearch = (ev) => {
    ev?.preventDefault()
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
      <form onSubmit={handleSearch} className={s.search}>
        <p>Search all <strong>361</strong> episodes, <strong>14,931</strong> minutes, and <strong>2,090,340</strong> words spoken in Harmontown:</p>
        <div className={s.inputWrapper}>
          <input 
            type="search"
            placeholder="Search"
            aria-label="Search all episodes"
            value={currentQuery}
            autoFocus
            onChange={ev => setCurrentQuery(ev.target.value)} 
          />
          <button className="search">
            <img src={magnifyingGlass} alt="Search" />
          </button>
        </div>
      </form>
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