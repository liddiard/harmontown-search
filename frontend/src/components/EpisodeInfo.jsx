import { highlightMatches } from '../utils'
import './EpisodeInfo.scss'

export default function EpisodeInfo({
  title,
  description,
  number,
  record_date,
  release_date,
  query
}) {
  const date = record_date || release_date
  const formattedDate = Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric' 
  }).formatToParts(new Date(date))

  return (
    <div className="episode-info">
      <div className="title">
        <h3 dangerouslySetInnerHTML={{
          __html: highlightMatches(title, query)
        }} />
        <span className="episode">Ep. <span className="number">{number}</span></span>
        <time dateTime={date}>
          {formattedDate.slice(0, -1).map(p => p.value).join('')}
          <span className="year">
            {formattedDate[formattedDate.length-1].value}
          </span>
        </time>
      </div>
      <p dangerouslySetInnerHTML={{
        __html: highlightMatches(description, query).replace(/\\n/g, ' ')
      }} />
    </div>
  )
}