import { useState, useEffect, useRef, useMemo } from 'react'
import Fuse from 'fuse.js'
import { findEpisodeByNumber, getEpisodeIndex } from '../utils'
import './Search.scss'
import EpisodeResult from './EpisodeResult'
import magnifyingGlass from '../img/magnifying-glass.svg'
import MediaPlayer from './MediaPlayer'


export default function Search() {
  const [episodes, setEpisodes] = useState([])
  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState()
  const [currentEpisodeStartTimecode, setCurrentEpisodeStartTimecode] = useState(0)
  const [currentQuery, setCurrentQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [episodeResults, setEpisodeResults] = useState([])

  const fuse = useRef(new Fuse())
  const currentEpisode = useMemo(() =>
    findEpisodeByNumber(episodes, currentEpisodeNumber),
    [episodes, currentEpisodeNumber]);

  useEffect(() => async () => {
    const { episodes, index } = await getEpisodeIndex()
    setEpisodes(episodes)
    fuse.current = index
  }, []);

  useEffect(() => {
    const { location, history } = window
    const originalUrl = location.href;               // Save down the URL without hash.
    location.href = '#media-player';                 // Go to the target element.
    history.replaceState(null, null, originalUrl);   // Remove the hash after jump
  }, [currentEpisode])

  const handleSearch = (ev) => {
    ev.preventDefault()
    setSubmittedQuery(currentQuery)
    setEpisodeResults(fuse.current.search(currentQuery))
  }

  return (
    <>
      {currentEpisode ? 
        <MediaPlayer episode={currentEpisode} />
      : null}
      <form onSubmit={handleSearch} className="search">
        <p>Search all <strong>361</strong> episodes, <strong>14,931</strong> minutes, and <strong>2,090,340</strong> words spoken in the Harmontown podcast:</p>
        <input 
          type="search"
          placeholder="Search"
          value={currentQuery}
          autoFocus
          onChange={ev => setCurrentQuery(ev.target.value)} 
        />
        <button>
          <img src={magnifyingGlass} alt="Search" />
        </button>
      </form>
      <div className="results">
        {episodeResults.length ? 
          <div className="episodes">
            <h2>Episodes</h2>
            <ol>
              {episodeResults.map(result => 
                <EpisodeResult
                  key={result.item.number}
                  query={submittedQuery}
                  setEpisode={setCurrentEpisodeNumber}
                  result={result.item} />
              )}
            </ol>
          </div>
        : null}
      </div>
    </>
  )
}