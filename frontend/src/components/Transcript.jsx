import { useEffect, useState, useRef } from 'react'
import Fuse from 'fuse.js'
import './Transcript.scss'
import leftChevron from '../img/left-chevron.svg'
import magnifyingGlass from '../img/magnifying-glass.svg'
import { fetchTranscript, formatTimecode, highlightMatches, inRange } from '../utils'
import { Tooltip } from 'react-tooltip'

// Given a `transcript` and a `timecode`, binary search for the line in
// transcript that matches the timecode. If timecode is between two lines or
// past the end of the transcript, returns the nearest previous line.
const searchForLine = (transcript, timecode, lo = 0, hi = transcript.length - 1) => {
  if (lo > hi) {
    // not found
    return
  }
  const mid = Math.floor((lo+hi) / 2)
  if (
    !transcript[mid+1] ||
    inRange(timecode, transcript[mid].start, transcript[mid+1].start)
  ) {
    // Match: there is no next line (we're at the end of the transcript), or
    // timecode is in current midpoint's range
    return mid
  }
  if (timecode < transcript[mid].start) {
    // timecode is before current midpoint recurse on first half
    return searchForLine(
      transcript,
      timecode,
      lo,
      mid - 1
    )
  } else {
    // timecode is after current midpoint recurse on second half
    return searchForLine(
      transcript,
      timecode,
      mid + 1,
      hi
    )
  }
}

const getCurrentLine = (
  transcript,
  timecode,
  currentLineNum
) => {
  const currentLine = transcript[currentLineNum]
  const nextLine = transcript[currentLineNum+1]
  const twoLinesAhead = transcript[currentLineNum+2]
  const lastLine = transcript[transcript.length - 1]

  if (timecode > lastLine.start) {
    // timecode is within or beyond the last line
    return transcript.length - 1
  }
  if (inRange(timecode, currentLine.start, nextLine?.start)) {
    // timecode is within the current line
    return currentLineNum
  }
  if (inRange(timecode, nextLine?.start, twoLinesAhead?.start)) {
    // timecode is within the next line
    return currentLineNum + 1
  }
  // timecode is somewhere else (possibly due to user seek) binary search for
  // the current line
  return searchForLine(transcript, timecode)
}

export default function Transcript({
  number,
  timecode,
  seek
}) {
  const [transcript, setTranscript] = useState([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentQuery, setCurrentQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  // whether or not to display a "no search results" message
  const [noResults, setNoResults] = useState(false)

  const fuse = useRef(new Fuse())
  const currentLineEl = useRef(null)
  const transcriptEl = useRef(null)

  useEffect(() => {
    (async () => {
      const { transcript, index } = await fetchTranscript(number)
      setTranscript(transcript)
      fuse.current = index
    })()
  }, [number])

  useEffect(() => {
    if (!transcript.length || !timecode || searchResults.length) {
      return
    }
    setCurrentLine(
      getCurrentLine(transcript, timecode * 1000, currentLine)
    )
  }, [transcript, timecode, currentLine, searchResults])

  useEffect(() => {
    setNoResults(false)
  }, [currentQuery])

  useEffect(() => {
    if (!transcriptEl.current || !currentLineEl.current) {
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

  const handleLineClick = (start, isCurrent) => {
    if (isCurrent) {
      return
    }
    seek(start)
  }

  const handleLineKeydown = (ev, start, isCurrent) => {
    // enter or space keys
    if (ev.keyCode === 13 || ev.keyCode === 32) {
      ev.preventDefault()
      handleLineClick(start, isCurrent)
    }
  }

  const handleSearch = (ev) => {
    ev.preventDefault()
    setSubmittedQuery(currentQuery)
    const results = fuse.current.search(currentQuery)
    setSearchResults(results)
    setNoResults(!results.length)
    if (results.length && transcriptEl.current) {
      transcriptEl.current.scrollTop = 0
    }
  }

  const renderTranscript = () => (
    <ol className="lines">
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
  )

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
        {searchResults.length ? renderSearchResults() : renderTranscript()}
      </article>
      <Tooltip id="back-to-transcript" place="left" />
    </>
  )
}