import { useEffect, useState, useRef } from 'react'
import Fuse from 'fuse.js'
import './Transcript.scss'
import { fetchTranscript } from '../utils'

const inRange = (value, start, end) =>
  value >= start && value < end

const binarySearch = (transcript, timecode, lo = 0, hi = transcript.length) => {
  const mid = Math.floor((lo+hi) / 2)
  console.log(lo, mid, hi)
  if (inRange(timecode, transcript[mid].start, transcript[mid+1].start)) {
    return transcript[mid]
  }
  if (timecode > transcript[mid].start) {
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
  debugger;
  const currentLine = transcript[currentLineNum]
  const nextLine = transcript[currentLineNum+1]
  const twoLinesAhead = transcript[currentLineNum+2]
  if (inRange(timecode, currentLine.start, nextLine.start)) {
    return currentLineNum
  }
  if (inRange(timecode, nextLine.start, twoLinesAhead.start)) {
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

  return (
    <article className="transcript">
      <input type="search" placeholder="Search this episode" />
      {/* attach click event listener at  */}
      <ol className="lines">
        {transcript.map(({ start, end, text }) =>
          <li
            key={start}
            className={transcript[currentLine].start === start ? `current` : ''}
          >
            {text}
          </li>
        )}
      </ol>
    </article>
  )
}