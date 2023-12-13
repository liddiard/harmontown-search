import Image from 'next/image'
import Link from 'next/link'

import s from './page.module.scss'
import xIcon from 'img/x.svg'
import EpisodeInfo from '@/components/EpisodeInfo'
import { findEpisodeByNumber, getQueryParamsWithoutTimecode } from '@/utils'
import { QueryParams } from '@/types'
import MediaPlayer from './MediaPlayer'
import episodes from '@/episode_list.tsv'


interface PageParams {
  params: {
    number: number
  }
}

export async function generateStaticParams() {
  return episodes.map(({ number }: PageParams['params']) =>
    ({ number: number.toString() }))
}

export function generateMetadata({ params: { number } }: PageParams) {
  const episode = findEpisodeByNumber(episodes, Number(number))
  if (!episode) {
    throw Error(`Missing episode for number: ${number}`)
  }
  const { title, description } = episode
  return {
    title,
    description
  }
}

interface EpisodePlayerProps extends PageParams {
  searchParams: QueryParams
}

export default async function EpisodePlayer({
  params,
  searchParams
}: EpisodePlayerProps) {
  const { number } = params
  const episode = findEpisodeByNumber(episodes, Number(number))

  if (!episode) {
    throw Error(`Episode ${number} not found in index.`)
  }

  return (
    <div className={s.mediaPlayerContainer} id="media-player">
      <Link 
        href={`/${getQueryParamsWithoutTimecode(searchParams)}`}
        className={s.closePlayer}
        data-tooltip-id="close-player"
        data-tooltip-content="Close player"
      >
        <Image src={xIcon} alt="Close player" />
      </Link>
      <EpisodeInfo {...episode} className={s.episodeInfo} />
      <MediaPlayer
        episode={episode}
      />
    </div>
  )
}