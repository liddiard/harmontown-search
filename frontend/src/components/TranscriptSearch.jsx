import { useState, useEffect, useRef } from 'react'
import leftChevron from "../img/left-chevron.svg"
import magnifyingGlass from "../img/magnifying-glass.svg"


export default function TranscriptSearch({
  submittedQuery,
  setSubmittedQuery,
  searchResults,
  setSearchResults,
  fuse
}) {
  // current text in the episode search input
  const [currentQuery, setCurrentQuery] = useState('')
  // whether or not to display a "no search results" message
  const [noResults, setNoResults] = useState(false)

  const handleSearch = (ev) => {
    ev.preventDefault()
    setSubmittedQuery(currentQuery)
    const results = fuse.current.search(currentQuery)
    setSearchResults(results)
    if (currentQuery) {
      setNoResults(!results.length)
    }
    if (results.length && transcriptEl.current) {
      transcriptEl.current.scrollTop = 0
    }
  }

  return (
    <form className="episodesearch" onSubmit={handleSearch}>
      {searchResults.length ? (
        <button
          type="button"
          className="back-to-transcript"
          datatooltipid="back-to-transcript"
          datatooltipcontent="Back to transcript"
          onClick={() => setSearchResults([])}
        >
          <img src={leftChevron} alt="Back to transcript" />
        </button>
      ) : null}
      <input
        type="search"
        value={currentQuery}
        placeholder="Search this episode"
        className={searchResults.length ? "showing-results" : ""}
        onChange={(ev) => setCurrentQuery(ev.target.value)}
      />
      {noResults ? (
        <span className="no-results" role="alert">
          Not found
        </span>
      ) : null}
      <button className="search">
        <img src={magnifyingGlass} alt="Search" />
      </button>
    </form>
  )
}
