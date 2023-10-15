import { highlightMatches, mask } from '../utils';
import playIcon from '../img/play.svg'
import s from './EpisodeInfo.module.scss'

export default function EpisodeInfo({
  className = '',
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
    <div className={`${s.episodeInfo} ${className}`}>
      <div className={s.title}>
        {selected ?
          <img src={playIcon} alt="Now playing" title="Now playing" className={s.playing} />
        : null}
        <h3 dangerouslySetInnerHTML={{
          __html: highlightMatches(mask(title), query)
        }} />
        <span className={s.episode}>Ep. <span className={s.number}>{number}</span></span>
        <time dateTime={date}>
          {formattedDate.slice(0, -1).map(p => p.value).join('')}
          <span className={s.year}>
            {formattedDate[formattedDate.length-1].value}
          </span>
        </time>
      </div>
      <p dangerouslySetInnerHTML={{
        __html: highlightMatches(description, query)
      }} />
    </div>
  )
}