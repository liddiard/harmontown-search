import Image from 'next/image'
import classNames from 'classnames'

import s from './EpisodeInfo.module.scss'
import { formatDateToParts, highlightMatches, mask } from '@/utils'
import playIcon from 'img/play.svg'
import { Episode } from '@/types'


interface EpisodeInfoProps extends Episode {
  className?: string,
  query?: string,
  selected?: boolean
}

export default function EpisodeInfo({
  className = '',
  title,
  description,
  number,
  record_date,
  release_date,
  query,
  selected
}: EpisodeInfoProps) {
  const date = record_date || release_date
  const formattedDate = formatDateToParts(date)

  return (
    <div className={classNames(s.episodeInfo, className)}>
      <div className={s.title}>
        {selected ?
          <Image src={playIcon} alt="Now playing" title="Now playing" className={s.playing} />
        : null}
        <h3 dangerouslySetInnerHTML={{
          __html: highlightMatches(title, query)
        }} />
        <div className={s.metadata}>
          <span className={s.episode}>
            Ep. <span className={s.number} dangerouslySetInnerHTML={{
              __html: highlightMatches(number.toString(), query) }}
            />
          </span>
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