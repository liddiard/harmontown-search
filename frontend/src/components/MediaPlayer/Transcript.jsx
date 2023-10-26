import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'

import s from './Transcript.module.scss'
import chevronDown from '../../img/chevron-down.svg'
import chevronUp from '../../img/chevron-up.svg'
import { fetchTranscript, handleKeyboardSelect, inRange } from '../../utils'
import { getCurrentLine } from './transcriptUtils'
import TranscriptSearch from './TranscriptSearch'

export default function Transcript({
  epNumber,
  timecode,
  seek
}) {
  // transcript: array of lines
  const [transcript, setTranscript] = useState([])
  // current line of transcript matching the media timecode
  const [currentLine, setCurrentLine] = useState(0)
  const [userScroll, setUserScroll] = useState(false)

  // wheter or not the current transcript scroll was initiated by code
  // (as opposed to user)
  const scrollingProgrammatically = useRef(false)
  // setTimeout value when scrolling is initiated
  const programmaticScollingTimeout = useRef(null)
  const fuse = useRef(new Fuse())
  const currentLineEl = useRef(null)
  const transcriptEl = useRef(null)
  const progressEl = useRef(null)

  // get the vertical height to scroll to within the transcript for the
  // current line, along with other metadata
  const getScrollTarget = () => {
    // we need to manually calculate scroll position instead of using
    // scrollIntoView because scrollIntoView will scroll the document body
    // in addition to scrolling the transcript
    const currentLineTop = currentLineEl.current.offsetTop
    const currentLineHeight = currentLineEl.current.clientHeight
    const transcriptHeight = transcriptEl.current.clientHeight
    const currentScrollTop = transcriptEl.current.scrollTop
    // vertically center the current line in the transcript window
    const scrollTo = currentLineTop - (transcriptHeight/2) + (currentLineHeight/2)
    return {
      scrollTo,
      currentScrollTop,
      transcriptHeight
    }
  }

  // temporarily set a ref (for `timeout` ms) to indiciate that a scroll
  // function is code-initiated rather than directly user initiated.
  // Intended to be called directly befrore any scrolling code
  // Browser smooth scroll implemnetations vary, but 1000ms seems to be a
  // sufficiently long duration for this purpose.
  const setScrollingProgrammatically = useCallback((timeout = 1000) => {
    scrollingProgrammatically.current = true
    if (programmaticScollingTimeout.current) {
      window.clearInterval(programmaticScollingTimeout.current)
    }
    programmaticScollingTimeout.current = window.setTimeout(() =>
      scrollingProgrammatically.current = false,
    timeout)
  }, [])

  // fetch the episode transcript whenever the episode number changes
  useEffect(() => {
    (async () => {
      if (!epNumber) {
        return
      }
      const { transcript, index } = await fetchTranscript(epNumber)
      setCurrentLine(0)
      setTranscript(transcript)
      fuse.current = index
      if (transcriptEl.current) {
        transcriptEl.scrollTop = 0
      }
    })()
  }, [epNumber])

  useEffect(() => {
    setUserScroll(false)
  }, [transcript])

  // set the current line of the transcript based on the media timecode
  useEffect(() => {
    // do nothing if there's no transcript or timecode
    if (!transcript.length || !timecode) {
      return
    }
    setCurrentLine(
      getCurrentLine(transcript, timecode * 1000, currentLine)
    )
  }, [transcript, timecode, currentLine])

  // scroll the transcript element to display the current line in the middle
  // of its boundingClientRect
  useEffect(() => {
    // return if any required element are not currently rendered in DOM, or if
    // the user's mouse is currently inside the transcript
    if (!transcriptEl.current || !currentLineEl.current || userScroll) {
      return
    }
    const {
      scrollTo,
      currentScrollTop,
      transcriptHeight
    } = getScrollTarget()
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
    setScrollingProgrammatically()
  }, [currentLine, userScroll, setScrollingProgrammatically])

  useEffect(() => {
    const el = transcriptEl.current
    const scrollListener = el.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight } = transcriptEl.current
      progressEl.current.value = scrollTop / scrollHeight
      if (!scrollingProgrammatically.current) {
        // if we're not current scrolling the transcript programmatically, then
        // this scroll event was initiated by the user
        setUserScroll(true)
      }
    })
    return () => {
      el.removeEventListener('scroll', scrollListener)
    }
  })

  const handleLineClick = useCallback((start, isCurrent) => {
    if (isCurrent) {
      return
    }
    setScrollingProgrammatically()
    seek(start)
  }, [seek, setScrollingProgrammatically])

  const handleLineKeydown = useCallback((ev, start, isCurrent) => {
    handleKeyboardSelect(ev, () => handleLineClick(start, isCurrent))
  }, [handleLineClick])

  // when the user is scrolling, show a button with chevron pointing in the
  // direction of the current line
  const getUserScrollIcon = () => {
    const {
      scrollTo,
      currentScrollTop
    } = getScrollTarget()
    return scrollTo > currentScrollTop ?
      chevronDown : 
      chevronUp
  }

  const transcriptComponent = useMemo(() => ((transcript, currentLine) => (
    <ol className={s.lines}>
      {transcript.map(({ start, text }) => {
        const isCurrent = transcript[currentLine]?.start === start
        return (
          <li
            key={`${epNumber}_${start}`}
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
  ))(transcript, currentLine), [
    epNumber,
    transcript,
    currentLine,
    handleLineClick,
    handleLineKeydown
  ])

  return (
    <div className={s.transcript} ref={transcriptEl}>
      <TranscriptSearch
        transcript={transcript}
        fuse={fuse}
        seek={handleLineClick}
        setScrollingProgrammatically={setScrollingProgrammatically}
      />
      {transcriptComponent}
      {userScroll ? (
        <button
          className={s.jump}
          aria-label="Jump to current transcript line"
          onClick={() => {
            setScrollingProgrammatically()
            setUserScroll(false)
          }}
        >
          <img src={getUserScrollIcon()} alt="" />
        </button>
      ) : null}
      <progress max={1} ref={progressEl} />
    </div>
  )
}

Transcript.propTypes = {
  epNumber: PropTypes.number,
  timecode: PropTypes.number.isRequired,
  seek: PropTypes.func.isRequired
}