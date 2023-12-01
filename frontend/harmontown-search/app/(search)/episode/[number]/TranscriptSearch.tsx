import Image from 'next/image'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'react-tooltip'

import s from './TranscriptSearch.module.scss'
import leftChevron from 'img/left-chevron.svg'
import magnifyingGlass from 'img/magnifying-glass.svg'
import TranscriptSearchResults from './TranscriptSearchResults'
import classNames from 'classnames'


export default function TranscriptSearch({
  fuse,
  seek,
  setScrollingProgrammatically,
  mediaType
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
    if (results.length) {
      // remove focus from the input to hide keyboard on mobile
      document.activeElement.blur()
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
            <Image src={leftChevron} alt="Back to transcript" />
          </button>
        ) : null}
        <input
          type="search"
          name="episode-search"
          value={currentQuery}
          placeholder="Search this episode"
          aria-label="Search this episode"
          autoCapitalize="none"
          className={classNames(s[mediaType], {
            [s.showingResults]: searchResults.length
          })}
          onChange={(ev) => setCurrentQuery(ev.target.value)}
        />
        {noResults ? (
          <span className={s.noResults} role="alert">
            Not found
          </span>
        ) : null}
        <button className={`${s.search} search`}>
          <Image src={magnifyingGlass} alt="Search" />
        </button>
      </form>
      <TranscriptSearchResults 
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        submittedQuery={submittedQuery}
        seek={seek}
        setScrollingProgrammatically={setScrollingProgrammatically}
      />
      <Tooltip id="back-to-transcript" place="bottom" />
    </div>
  )
}

TranscriptSearch.propTypes = {
  fuse: PropTypes.shape({
    current: PropTypes.shape({
      search: PropTypes.func.isRequired
    }).isRequired
  }).isRequired,
  seek: PropTypes.func.isRequired,
  setScrollingProgrammatically: PropTypes.func.isRequired
}