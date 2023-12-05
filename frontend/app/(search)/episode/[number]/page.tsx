import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import PropTypes from 'prop-types'

import s from './page.module.scss'
import xIcon from 'img/x.svg'
import EpisodeInfo from 'EpisodeInfo'
import { fetchEpisodeIndex, findEpisodeByNumber, getMediaData, getQueryParamsWithoutTimecode, getTimecodeLocalStorageKey } from 'utils'
import { Episode, QueryParams } from '@/constants'
import MediaPlayer from './MediaPlayer'
import episodes from '@/episode_list.tsv'


export async function generateStaticParams() {
  return episodes.map(({ number } : { number: number }) =>
    ({ number: number.toString() }))
}

interface EpisodePlayerProps {
  params: { number: number },
  startTimecode: number,
  searchParams: QueryParams
}

export default async function EpisodePlayer({
  params,
  startTimecode,
  searchParams
}: EpisodePlayerProps) {
  const { number } = params
  const episode = findEpisodeByNumber(episodes, Number(number))

  if (!episode) {
    throw Error(`Episode ${number} not found in index.`)
  }

  return (
    <div className={s.mediaPlayerContainer} id="media-player">
      <Head>{episode.title}</Head>
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

EpisodePlayer.propTypes = {
  episode: PropTypes.shape({
    number: PropTypes.number.isRequired
  }),
  startTimecode: PropTypes.number
}