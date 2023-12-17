import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Tooltip } from 'react-tooltip'
import Fuse, { FuseResult } from 'fuse.js'
import classNames from 'classnames'

import s from './TranscriptSearch.module.scss'
import leftChevron from 'img/left-chevron.svg'
import magnifyingGlass from 'img/magnifying-glass.svg'
import TranscriptSearchResults from './TranscriptSearchResults'
import { MediaType, Transcript, TranscriptLine } from '@/types'
import { HandleLineClickFunc, SetScrollingProgrammaticallyFunc } from './Transcript'
import { fuseConfig } from '@/constants'


interface TranscriptSearchProps {
  transcript: Transcript
  mediaType: MediaType,
  handleLineClick: HandleLineClickFunc
  setScrollingProgrammatically: SetScrollingProgrammaticallyFunc,
  setUserScroll: (scrolling: boolean) => void
}

export default function TranscriptSearch({
  transcript,
  mediaType,
  handleLineClick,
  setScrollingProgrammatically,
  setUserScroll
}: TranscriptSearchProps) {
  // current text in the episode search input
  const [currentQuery, setCurrentQuery] = useState('')
  // submitted text in the episode search input
  const [submittedQuery, setSubmittedQuery] = useState('')
  // results from the `submittedQuery`
  const [searchResults, setSearchResults] = useState<FuseResult<TranscriptLine>[]>([])
  // whether or not to display a "no search results" message
  const [noResults, setNoResults] = useState(false)

  const fuse = useRef<Fuse<TranscriptLine>>(new Fuse([]))

  // when the user changes the text in the episode search input, remove the
  // "no search results" message
  useEffect(() => {
    setNoResults(false)
  }, [currentQuery])

  useEffect(() => {
    fuse.current = new Fuse(transcript, fuseConfig.transcript)
  }, [transcript])

  const handleSearch = (ev: React.FormEvent) => {
    ev.preventDefault()
    setSubmittedQuery(currentQuery)
    if (!fuse.current) {
      return
    }
    const results = fuse.current.search(currentQuery)
    setSearchResults(results)
    if (currentQuery) {
      setNoResults(!results.length)
    }
    if (results.length && document.activeElement instanceof HTMLElement) {
      // remove focus from the input to hide keyboard on mobile
      document.activeElement.blur()
    }
  }

  return (
    <div className={classNames(s.transcriptSearch, { [s.showingResults]: searchResults.length })}>
      <form onSubmit={handleSearch}>
        {searchResults.length ? (
          <button
            type="button"
            className={s.backToTranscript}
            data-tooltip-id="back-to-transcript"
            data-tooltip-content="Back to transcript"
            onClick={() => {
              setSearchResults([])
              setUserScroll(false)
            }}
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
          className={classNames({
            [s.showingResults]: searchResults.length,
            [s.video]: mediaType === MediaType.Video,
            [s.audio]: mediaType === MediaType.Audio
          })}
          onChange={(ev) => setCurrentQuery(ev.target.value)}
          onFocus={(ev) => ev.target.select()}
        />
        {noResults ? (
          <span className={s.noResults} role="alert">
            Not found
          </span>
        ) : null}
        <button className={classNames(s.search, 'search')}>
          <Image src={magnifyingGlass} alt="Search" />
        </button>
      </form>
      <TranscriptSearchResults 
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        submittedQuery={submittedQuery}
        handleLineClick={handleLineClick}
        setScrollingProgrammatically={setScrollingProgrammatically}
      />
      <Tooltip id="back-to-transcript" place="bottom" />
    </div>
  )
}