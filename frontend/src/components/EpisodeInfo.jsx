import PropTypes from 'prop-types'

import { formatDate, highlightMatches, mask } from '../utils'
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
  const formattedDate = formatDate(date, { parts: true })

  return (
    <div className={`${s.episodeInfo} ${className}`}>
      <div className={s.title}>
        {selected ?
          <img src={playIcon} alt="Now playing" title="Now playing" className={s.playing} />
        : null}
        <h3 dangerouslySetInnerHTML={{
          __html: highlightMatches(title, query)
        }} />
        <div className={s.metadata}>
          <span className={s.episode}>Ep. <span className={s.number}>{number}</span></span>
          <time dateTime={date}>
            {formattedDate.slice(0, -1).map(p => p.value).join('')}
            <span className={s.year}>
              {formattedDate[formattedDate.length-1].value}
            </span>
          </time>
        </div>
      </div>
      <p dangerouslySetInnerHTML={{
        __html: highlightMatches(description, query)
      }} />
    </div>
  )
}

EpisodeInfo.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  release_date: PropTypes.string.isRequired,
  record_date: PropTypes.string,
  query: PropTypes.string,
  selected: PropTypes.bool
}