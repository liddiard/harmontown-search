import Image from 'next/image'
import Link from 'next/link'

import s from './page.module.scss'
import xIcon from 'img/x.svg'
import EpisodeInfo from '@/components/EpisodeInfo'
import { findEpisodeByNumber, getQueryParamsWithoutTimecode } from '@/utils'
import { QueryParams } from '@/types'
import MediaPlayer from './MediaPlayer'
import episodes from '@/episode_list.tsv'
import { metadataBase } from '@/constants'
import { unstable_rethrow } from 'next/navigation'

type PageParams = Promise<{ number: number }>

export async function generateStaticParams() {
  return episodes.map(({ number }: { number: number }) => ({
    number: number.toString(),
  }))
}

export async function generateMetadata({ params }: { params: PageParams }) {
  const { number } = await params
  const episode = findEpisodeByNumber(episodes, Number(number))
  if (!episode) {
    throw Error(`Missing episode for number: ${number}`)
  }
  const { title, description } = episode
  return {
    title,
    description,
    openGraph: {
      title: `Episode ${number}: ${title}`,
    },
    metadataBase,
  }
}

interface EpisodePlayerProps {
  searchParams: Promise<QueryParams>
  params: Promise<{ number: string }>
}

export default async function EpisodePlayer({
  params,
  searchParams,
}: EpisodePlayerProps) {
  let number, queryParams
  // https://stackoverflow.com/a/78010468
  try {
    number = (await params).number
    queryParams = await searchParams
  } catch (error) {
    unstable_rethrow(error)
  }
  const episode = findEpisodeByNumber(episodes, Number(number))

  if (!episode) {
    throw Error(`Episode ${number} not found in index.`)
  }

  return (
    <div className={s.mediaPlayerContainer} id="media-player">
      {queryParams && (
        <Link
          href={`/${getQueryParamsWithoutTimecode(queryParams)}`}
          scroll={false}
          className={s.closePlayer}
          data-tooltip-id="close-player"
          data-tooltip-content="Close player"
        >
          <Image src={xIcon} alt="Close player" />
        </Link>
      )}
      <EpisodeInfo {...episode} className={s.episodeInfo} />
      <MediaPlayer episode={episode} />
    </div>
  )
}
