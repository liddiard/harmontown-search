import { highlightMatches } from '../utils'
import playIcon from '../img/play.svg'
import './EpisodeInfo.scss'

export default function EpisodeInfo({
  title,
  description,
  number,
  record_date,
  release_date,
  query,
  selected
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
        {selected ?
          <img src={playIcon} alt="Now playing" title="Now playing" className="playing" />
        : null}
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