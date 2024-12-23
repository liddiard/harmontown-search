import Image from 'next/image'
import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import classNames from 'classnames'

import s from './Transcript.module.scss'
import chevronDown from 'img/chevron-down.svg'
import chevronUp from 'img/chevron-up.svg'
import { handleKeyboardSelect, inRange } from '@/utils'
import { getCurrentLine } from './transcriptUtils'
import TranscriptSearch from './TranscriptSearch'
import { MediaType, Transcript as TranscriptType } from '@/types'
import { SeekFunc } from './MediaPlayer'

export type HandleLineClickFunc = (
  start: number,
  isCurrent: boolean,
  seekOptions?: { play?: boolean }
) => void

export type SetScrollingProgrammaticallyFunc = (timeout?: number) => void

interface TranscriptProps {
  epNumber: number
  timecode: number
  seek: SeekFunc
  offset: number
  mediaType: MediaType
}

export default function Transcript({
  epNumber,
  timecode,
  seek,
  offset,
  mediaType,
}: TranscriptProps) {
  // transcript: array of lines
  const [transcript, setTranscript] = useState<TranscriptType>([])
  // current line of transcript matching the media timecode
  const [currentLine, setCurrentLine] = useState(0)
  // user is scrolling transcript independent of auto scroll to current line
  const [userScroll, setUserScroll] = useState(false)

  // wheter or not the current transcript scroll was initiated by code
  // (as opposed to user)
  const scrollingProgrammatically = useRef(false)
  // setTimeout value when scrolling is initiated
  const programmaticScollingTimeout = useRef<number | null>(null)
  const currentLineEl = useRef<HTMLLIElement>(null)
  const transcriptEl = useRef<HTMLDivElement>(null)
  const progressEl = useRef<HTMLProgressElement>(null)

  // get the vertical height to scroll to within the transcript for the
  // current line, along with other metadata
  const getScrollTarget = () => {
    if (!currentLineEl.current || !transcriptEl.current) {
      return {}
    }
    // we need to manually calculate scroll position instead of using
    // scrollIntoView because scrollIntoView will scroll the document body
    // in addition to scrolling the transcript
    const currentLineTop = currentLineEl.current.offsetTop
    const currentLineHeight = currentLineEl.current.clientHeight
    const transcriptHeight = transcriptEl.current.clientHeight
    const currentScrollTop = transcriptEl.current.scrollTop
    // vertically center the current line in the transcript window
    const scrollTo =
      currentLineTop - transcriptHeight / 2 + currentLineHeight / 2
    return {
      scrollTo,
      currentScrollTop,
      transcriptHeight,
    }
  }

  // temporarily set a ref (for `timeout` ms) to indiciate that a scroll
  // function is code-initiated rather than directly user initiated.
  // Intended to be called directly befrore any scrolling code
  // Browser smooth scroll implemnetations vary, but 1000ms seems to be a
  // sufficiently long duration for this purpose.
  const setScrollingProgrammatically: SetScrollingProgrammaticallyFunc =
    useCallback((timeout = 1000) => {
      scrollingProgrammatically.current = true
      if (programmaticScollingTimeout.current) {
        window.clearInterval(programmaticScollingTimeout.current)
      }
      programmaticScollingTimeout.current = window.setTimeout(
        () => (scrollingProgrammatically.current = false),
        timeout
      )
    }, [])

  // fetch the episode transcript whenever the episode number changes
  useEffect(() => {
    ;(async () => {
      if (!epNumber) {
        return
      }
      setTranscript((await import(`@/transcripts/${epNumber}.tsv`)).default)
      setCurrentLine(0)
      if (transcriptEl.current) {
        transcriptEl.current.scrollTop = 0
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
      getCurrentLine(transcript, (timecode + offset) * 1000, currentLine) ?? 0
    )
  }, [transcript, timecode, currentLine, offset])

  // scroll the transcript element to display the current line in the middle
  // of its boundingClientRect
  useEffect(() => {
    // return if any required element are not currently rendered in DOM, or if
    // the user's mouse is currently inside the transcript
    if (!transcriptEl.current || !currentLineEl.current || userScroll) {
      return
    }
    const { scrollTo, currentScrollTop, transcriptHeight } = getScrollTarget()
    if (scrollTo === undefined) {
      return
    }
    // smooth scroll if the new position is nearby the current scroll position
    const smoothScroll = inRange(
      scrollTo,
      currentScrollTop - transcriptHeight,
      currentScrollTop + transcriptHeight
    )
    transcriptEl.current?.scroll({
      top: scrollTo,
      behavior: smoothScroll ? 'smooth' : 'instant',
    })
    setScrollingProgrammatically()
  }, [currentLine, userScroll, setScrollingProgrammatically])

  const handleScroll = () => {
    const { scrollTop, scrollHeight } = transcriptEl.current!
    progressEl.current!.value = scrollTop / scrollHeight
    if (!scrollingProgrammatically.current) {
      // if we're not current scrolling the transcript programmatically, then
      // this scroll event was initiated by the user
      setUserScroll(true)
    }
  }

  const handleDocumentFocus = () => {
    setUserScroll(false)
  }

  useEffect(() => {
    const el = transcriptEl.current
    document.addEventListener('visibilitychange', handleDocumentFocus)
    el!.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('visibilitychange', handleDocumentFocus)
      el!.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLineClick: HandleLineClickFunc = useCallback(
    (start, isCurrent, seekOptions = {}) => {
      if (isCurrent) {
        return
      }
      setScrollingProgrammatically()
      seek(start, seekOptions)
      setUserScroll(false)
    },
    [seek, setScrollingProgrammatically]
  )

  const handleLineKeydown = useCallback(
    (ev: React.KeyboardEvent, start: number, isCurrent: boolean) => {
      handleKeyboardSelect(ev, () => handleLineClick(start, isCurrent))
    },
    [handleLineClick]
  )

  // when the user is scrolling, show a button with chevron pointing in the
  // direction of the current line
  const getUserScrollIcon = () => {
    const { scrollTo, currentScrollTop } = getScrollTarget()
    return scrollTo && currentScrollTop && scrollTo < currentScrollTop
      ? chevronUp
      : chevronDown
  }

  const transcriptComponent = useMemo(
    () =>
      ((transcript, currentLine) => (
        <ol className={s.lines}>
          {transcript.map(({ start, text }) => {
            const isCurrent = transcript[currentLine]?.start === start
            return (
              <li
                key={`${epNumber}_${start}`}
                className={classNames('selectable', { selected: isCurrent })}
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
      ))(transcript, currentLine),
    [epNumber, transcript, currentLine, handleLineClick, handleLineKeydown]
  )

  return (
    <div className={s.transcript} ref={transcriptEl}>
      <TranscriptSearch
        transcript={transcript}
        handleLineClick={handleLineClick}
        setScrollingProgrammatically={setScrollingProgrammatically}
        setUserScroll={setUserScroll}
        mediaType={mediaType}
      />
      {transcriptComponent}
      {userScroll ? (
        <button
          className={s.jump}
          aria-label="Go to current transcript line"
          data-tooltip-id="transcript-jump"
          data-tooltip-content="Go to current line"
          onClick={() => {
            setScrollingProgrammatically()
            setUserScroll(false)
          }}
        >
          <Image src={getUserScrollIcon()} alt="" />
        </button>
      ) : null}
      <Tooltip id="transcript-jump" place="left" />
      <progress ref={progressEl} max={1} defaultValue={0} />
    </div>
  )
}
