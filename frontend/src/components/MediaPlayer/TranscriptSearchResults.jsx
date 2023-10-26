import { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import s from './TranscriptSearchResults.module.scss'
import { formatTimecode, highlightMatches } from '../../utils'

export default function TranscriptSearchResults({ 
  searchResults = [],
  setSearchResults,
  submittedQuery,
  seek,
  setScrollingProgrammatically
}) {
  const resultsEl = useRef(null)

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
            setSearchResults([])
            setScrollingProgrammatically()
            seek(start, { play: true })
          }}
        >
          <time className={s.timecode}>{formatTimecode(start)}</time>
          <span dangerouslySetInnerHTML={{ __html: highlightMatches(text, submittedQuery) }} />
        </li>
      )}
    </ol>
  )
}

TranscriptSearchResults.propTypes = {
  searchResults: PropTypes.array.isRequired,
  setSearchResults: PropTypes.func.isRequired,
  submittedQuery: PropTypes.string.isRequired,
  seek: PropTypes.func.isRequired,
  setScrollingProgrammatically: PropTypes.func.isRequired
}