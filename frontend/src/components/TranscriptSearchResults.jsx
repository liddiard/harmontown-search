import { formatTimecode, highlightMatches } from '../utils'

export default function TranscriptSearchResults({ 
  searchResults = [],
  setSearchResults,
  submittedQuery,
  seek
}) {
  return (
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
}