import { useEffect, useState, useRef } from 'react'
import Fuse from 'fuse.js'
import './Transcript.scss'
import { fetchTranscript } from '../utils'

const inRange = (value, start, end) =>
  value >= start && value < end

const binarySearch = (transcript, timecode, lo = 0, hi = transcript.length - 1) => {
  if (lo > hi) {
    return
  }
  const mid = Math.floor((lo+hi) / 2)
  // console.log(timecode, lo, hi, transcript[mid].start, transcript[mid+1].start)
  if (
    !transcript[mid+1] ||
    inRange(timecode, transcript[mid].start, transcript[mid+1].start)
  ) {
    return mid
  }
  if (timecode < transcript[mid].start) {
    return binarySearch(
      transcript,
      timecode,
      lo,
      mid - 1
    )
  }
  return binarySearch(
    transcript,
    timecode,
    mid + 1,
    hi
  )
}

const getCurrentLine = (
  transcript,
  timecode,
  currentLineNum
) => {
  const currentLine = transcript[currentLineNum]
  const nextLine = transcript[currentLineNum+1]
  const twoLinesAhead = transcript[currentLineNum+2]
  if (timecode > transcript[transcript.length - 1].start) {
    return transcript.length - 1
  }
  if (inRange(timecode, currentLine.start, nextLine?.start)) {
    return currentLineNum
  }
  if (inRange(timecode, nextLine?.start, twoLinesAhead?.start)) {
    return currentLineNum + 1
  }
  return binarySearch(transcript, timecode)
}

export default function Transcript({
  number,
  timecode,
  setTimecode
}) {
  const [transcript, setTranscript] = useState([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentQuery, setCurrentQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

  const fuse = useRef(new Fuse())
  const currentLineEl = useRef(null)

  useEffect(() => {
    (async () => {
      const { transcript, index } = await fetchTranscript(number)
      setTranscript(transcript)
      fuse.current = index
    })()
  }, [number])

  useEffect(() => {
    if (!transcript.length || !timecode) {
      return
    }
    setCurrentLine(
      getCurrentLine(transcript, timecode * 1000, currentLine)
    )
  }, [transcript, timecode, currentLine])

  useEffect(() => {
    currentLineEl.current?.scrollIntoView({ block: 'center', behavior: 'smooth'})
  }, [currentLine])

  return (
    <article className="transcript">
      <input type="search" placeholder="Search this episode" />
      {/* attach click event listener at  */}
      <ol className="lines">
        {transcript.map(({ start, end, text }) => {
          const isCurrent = transcript[currentLine]?.start === start
          return (
            <li
              key={start}
              className={isCurrent ? `current` : ''}
              ref={isCurrent ? currentLineEl : null}
            >
              {text}
            </li>
          )
        }
        )}
      </ol>
    </article>
  )
}