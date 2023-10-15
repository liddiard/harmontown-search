import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import Fuse from 'fuse.js'
import s from './Transcript.module.scss'
import { fetchTranscript, handleKeyboardSelect, inRange } from '../utils'
import { getCurrentLine } from './transcriptUtils'
import EpisodeTranscriptSearch from './EpisodeTranscriptSearch'


export default function Transcript({
  number,
  timecode,
  seek
}) {
  // transcript: array of lines
  const [transcript, setTranscript] = useState([])
  // current line of transcript matching the media timecode
  const [currentLine, setCurrentLine] = useState(0)

  // whether or not the mouse cursor is currently inside the transcript element
  const cursorInTranscript = useRef(false)
  const fuse = useRef(new Fuse())
  const currentLineEl = useRef(null)
  const transcriptEl = useRef(null)
  const progressEl = useRef(null)

  // fetch the episode transcript whenever the episode number changes
  useEffect(() => {
    (async () => {
      const { transcript, index } = await fetchTranscript(number)
      setCurrentLine(0)
      setTranscript(transcript)
      fuse.current = index
      if (transcriptEl.current) {
        transcriptEl.scrollTop = 0
      }
    })()
  }, [number])

  // set the current line of the transcript based on the media timecode
  useEffect(() => {
    // do nothing if there's no transcript or timecode, or if UI is displaying
    // search results
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

  useEffect(() => {
    const scrollListener = transcriptEl.current.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight } = transcriptEl.current
      progressEl.current.value = scrollTop / scrollHeight
    })
    return transcriptEl.current.removeEventListener('scroll', scrollListener)
  })

  const handleLineClick = useCallback((start, isCurrent) => {
    if (isCurrent) {
      return
    }
    seek(start)
  }, [seek])

  const handleLineKeydown = useCallback((ev, start, isCurrent) => {
    handleKeyboardSelect(ev, () => handleLineClick(start, isCurrent))
  }, [handleLineClick])

  const transcriptComponent = useMemo(() => ((transcript, currentLine) => (
    <ol
      className={s.lines}
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

  return (
    <div className={s.transcript} ref={transcriptEl}>
      <EpisodeTranscriptSearch
        transcript={transcript}
        fuse={fuse}
        seek={seek}
      />
      {transcriptComponent}
      <progress max={1} ref={progressEl} />
    </div>
  )
}