import { useRef, useEffect } from 'react'
import s from './TranscriptSearchResults.module.scss'
import { formatTimecode, highlightMatches } from '../utils'

export default function TranscriptSearchResults({ 
  searchResults = [],
  setSearchResults,
  submittedQuery,
  seek
}) {
  const resultsEl = useRef(null)

  useEffect(() => {
    if (resultsEl.current) {
      resultsEl.current.scrollTop = 0
    }
  }, [searchResults])

  if (!searchResults.length)  {
    return
  }
  return (
    <ol className={s.transcriptSearchResults} ref={resultsEl}>
      {searchResults.map(({ item: { start, text } }) => 
        <li
          key={start}
          className="selectable"
          onClick={() => {
            seek(start, { play: true })
            setSearchResults([])
          }}
        >
          <time className={s.timecode}>{formatTimecode(start)}</time>
          <span dangerouslySetInnerHTML={{ __html: highlightMatches(text, submittedQuery) }} />
        </li>
      )}
    </ol>
  )
}