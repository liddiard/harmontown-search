import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import Fuse from 'fuse.js'
import './Transcript.scss'
import leftChevron from '../img/left-chevron.svg'
import magnifyingGlass from '../img/magnifying-glass.svg'
import { fetchTranscript, formatTimecode, highlightMatches, inRange } from '../utils'
import { getCurrentLine } from './transcriptUtils'
import { Tooltip } from 'react-tooltip'


export default function Transcript({
  number,
  timecode,
  seek
}) {
  // transcript: array of lines
  const [transcript, setTranscript] = useState([])
  // current line of transcript matching the media timecode
  const [currentLine, setCurrentLine] = useState(0)
  // current text in the episode search input
  const [currentQuery, setCurrentQuery] = useState('')
  // submitted text in the episode search input
  const [submittedQuery, setSubmittedQuery] = useState('')
  // results from the `submittedQuery`
  const [searchResults, setSearchResults] = useState([])
  // whether or not to display a "no search results" message
  const [noResults, setNoResults] = useState(false)

  // whether or not the mouse cursor is currently inside the transcript element
  const cursorInTranscript = useRef(false)
  const fuse = useRef(new Fuse())
  const currentLineEl = useRef(null)
  const transcriptEl = useRef(null)

  // fetch the episode transcript whenever the episode number changes
  useEffect(() => {
    (async () => {
      const { transcript, index } = await fetchTranscript(number)
      setTranscript(transcript)
      fuse.current = index
    })()
  }, [number])

  // set the current line of the transcript based on the media timecode
  useEffect(() => {
    // do nothing if there's no transcript or timecode, or if UI is displaying
    // search results
    if (!transcript.length || !timecode || searchResults.length) {
      return
    }
    setCurrentLine(
      getCurrentLine(transcript, timecode * 1000, currentLine)
    )
  }, [transcript, timecode, currentLine, searchResults])

  // when the user changes the text in the episode search input, remove the
  // "no search results" message
  useEffect(() => {
    setNoResults(false)
  }, [currentQuery])

  // scroll the transcript element to display the current line in the middle
  // of its boundingClientRect
  useEffect(() => {
    // return if any required element are not currently rendered in DOM, or if
    // the user's mouse is currently inside the transcript
    if (!transcriptEl.current || !currentLineEl.current || cursorInTranscript.current) {
      return
    }
    // we need to manually calculate scroll position instead of using
    // scrollIntoView because scrollIntoView will scroll the document body
    // in addition to scrolling the transcript
    const currentLineTop = currentLineEl.current.offsetTop
    const currentLineHeight = currentLineEl.current.clientHeight
    const transcriptHeight = transcriptEl.current.clientHeight
    const currentScrollTop = transcriptEl.current.scrollTop
    // vertically center the current line in the transcript window
    const scrollTo = currentLineTop - (transcriptHeight/2) + (currentLineHeight/2)
    // smooth scroll if the new position is nearby the current scroll position
    const smoothScroll = inRange(
      scrollTo,
      currentScrollTop - transcriptHeight,
      currentScrollTop + transcriptHeight
    )
    transcriptEl.current?.scroll({ 
      top: scrollTo,
      behavior: smoothScroll ? 'smooth' : 'instant'
    })
  }, [currentLine])

  const handleLineClick = useCallback((start, isCurrent) => {
    if (isCurrent) {
      return
    }
    seek(start)
  }, [seek])

  const handleLineKeydown = useCallback((ev, start, isCurrent) => {
    // enter or space keys
    if (ev.keyCode === 13 || ev.keyCode === 32) {
      ev.preventDefault()
      handleLineClick(start, isCurrent)
    }
  }, [handleLineClick])

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

  const transcriptComponent = useMemo(() => ((transcript, currentLine) => (
    <ol
      className="lines"
      onMouseEnter={() => cursorInTranscript.current = true}
      onMouseLeave={() => cursorInTranscript.current = false}
    >
      {transcript.map(({ start, text }) => {
        const isCurrent = transcript[currentLine]?.start === start
        return (
          <li
            key={start}
            className={`selectable ${isCurrent ? `selected` : ''}`}
            tabIndex={0}
            role="link"
            ref={isCurrent ? currentLineEl : null}
            onClick={() => handleLineClick(start, isCurrent)}
            onKeyDown={(ev) => handleLineKeydown(ev, start, isCurrent)}
          >
            {text}
          </li>
        )
      })}
    </ol>
  ))(transcript, currentLine), [transcript, currentLine, handleLineClick, handleLineKeydown])

  const renderSearchResults = () => (
    <ol className="search-results">
      {searchResults.map(({ item: { start, text } }) => 
        <li
          key={start}
          className="selectable"
          onClick={() => {
            seek(start, { play: true })
            setSearchResults([])
          }}
        >
          <time className="timecode">{formatTimecode(start)}</time>
          <span dangerouslySetInnerHTML={{ __html: highlightMatches(text, submittedQuery) }} />
        </li>
      )}
    </ol>
  )

  return (
    <>
      <article className="transcript" ref={transcriptEl}>
        <form className="episode-search" onSubmit={handleSearch}>
          {searchResults.length ? 
            <button 
              type="button"
              className="back-to-transcript"
              data-tooltip-id="back-to-transcript"
              data-tooltip-content="Back to transcript"
              onClick={() => setSearchResults([])}>
              <img src={leftChevron} alt="Back to transcript" />
            </button>
          : null}
          <input
            type="search"
            value={currentQuery}
            placeholder="Search this episode"
            className={searchResults.length ? 'showing-results' : ''}
            onChange={(ev) => setCurrentQuery(ev.target.value)}
          />
          {noResults ?
            <span className="no-results" role="alert">Not found</span>
          : null}
          <button className="search">
            <img src={magnifyingGlass} alt="Search" />
          </button>
        </form>
        {searchResults.length ? renderSearchResults() : transcriptComponent}
      </article>
      <Tooltip id="back-to-transcript" place="left" />
    </>
  )
}