import { useState } from "react"

export default function Transcript({
  transcript,
  timecode,
  setTimecode
}) {
  const [currentLine, setCurrentLine] = useState()
  const [currentQuery, setCurrentQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

  return (
    <article className="transcript">
      <input type="search" placeholder="Search this episode" />
      {/* attach click event listener at  */}
      <ol className="lines">

      </ol>
    </article>
  )
}