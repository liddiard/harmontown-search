import { useState, useEffect } from 'react'
import { Tooltip } from 'react-tooltip'
import s from './TranscriptSearch.module.scss'
import leftChevron from '../img/left-chevron.svg'
import magnifyingGlass from '../img/magnifying-glass.svg'
import TranscriptSearchResults from './TranscriptSearchResults'


export default function TranscriptSearch({
  transcript,
  fuse,
  seek
}) {
  // current text in the episode search input
  const [currentQuery, setCurrentQuery] = useState('')
  // submitted text in the episode search input
  const [submittedQuery, setSubmittedQuery] = useState('')
  // results from the `submittedQuery`
  const [searchResults, setSearchResults] = useState([])
  // whether or not to display a "no search results" message
  const [noResults, setNoResults] = useState(false)

  // when the user changes the text in the episode search input, remove the
  // "no search results" message
  useEffect(() => {
    setNoResults(false)
  }, [currentQuery])

  const handleSearch = (ev) => {
    ev.preventDefault()
    setSubmittedQuery(currentQuery)
    const results = fuse.current.search(currentQuery)
    setSearchResults(results)
    if (currentQuery) {
      setNoResults(!results.length)
    }
  }

  return (
    <div className={`${s.transcriptSearch} ${searchResults.length ? s.showingResults : ''}`}>
      <form onSubmit={handleSearch}>
        {searchResults.length ? (
          <button
            type="button"
            className={s.backToTranscript}
            data-tooltip-id="back-to-transcript"
            data-tooltip-content="Back to transcript"
            onClick={() => setSearchResults([])}
          >
            <img src={leftChevron} alt="Back to transcript" />
          </button>
        ) : null}
        <input
          type="search"
          value={currentQuery}
          placeholder="Search this episode"
          className={searchResults.length ? s.showingResults : ''}
          onChange={(ev) => setCurrentQuery(ev.target.value)}
        />
        {noResults ? (
          <span className={s.noResults} role="alert">
            Not found
          </span>
        ) : null}
        <button className="search">
          <img src={magnifyingGlass} alt="Search" />
        </button>
      </form>
      <TranscriptSearchResults 
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        submittedQuery={submittedQuery}
        seek={seek}
      />
      <Tooltip id="back-to-transcript" place="bottom" />
    </div>
  )
}
