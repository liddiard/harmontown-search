import { useRef, useEffect } from 'react'
import { FuseResult } from 'fuse.js'

import s from './TranscriptSearchResults.module.scss'
import { formatTimecode, highlightMatches } from 'utils'
import { TranscriptLine } from '@/constants'
import { HandleLineClickFunc, SetScrollingProgrammaticallyFunc } from './Transcript'

interface TranscriptSearchResultsProps {
  searchResults: FuseResult<TranscriptLine>[],
  setSearchResults: (results: FuseResult<TranscriptLine>[]) => void,
  submittedQuery: string,
  handleLineClick: HandleLineClickFunc,
  setScrollingProgrammatically: SetScrollingProgrammaticallyFunc
}

export default function TranscriptSearchResults({ 
  searchResults = [],
  setSearchResults,
  submittedQuery,
  handleLineClick,
  setScrollingProgrammatically
}: TranscriptSearchResultsProps) {
  const resultsEl = useRef<HTMLOListElement>(null)

  useEffect(() => {
    if (resultsEl.current) {
      setScrollingProgrammatically()
      resultsEl.current.scrollTop = 0
    }
  }, [searchResults, setScrollingProgrammatically])

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
            handleLineClick(start, false, { play: true })
            window.setTimeout(() => setSearchResults([]))
          }}
        >
          <time className={s.timecode}>{formatTimecode(start)}</time>
          <span dangerouslySetInnerHTML={{ __html: highlightMatches(text, submittedQuery) }} />
        </li>
      )}
    </ol>
  )
}