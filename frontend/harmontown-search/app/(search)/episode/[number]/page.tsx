import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'


import s from './page.module.scss'
import xIcon from 'img/x.svg'
import EpisodeInfo from 'EpisodeInfo'
import { findEpisodeByNumber, getMediaData, getQueryParamsWithoutTimecode, getTimecodeLocalStorageKey } from 'utils'
import { fetchEpisodeIndex } from '@/episodeIndex'
import { Episode } from '@/constants'
import MediaPlayer from './MediaPlayer'


export async function generateStaticParams() {
  const episodes = await fetchEpisodeIndex()
  return episodes.map(({ number }) => ({ number: number.toString() }))
}

export default async function EpisodePlayer({
  params,
  startTimecode,
}) {

  const { number } = params
  const episodes = await fetchEpisodeIndex()
  const episode = findEpisodeByNumber(episodes, Number(number))

  if (!episode) {
    throw Error(`Episode ${number} not found in index.`)
  }

  const closePlayer = () => console.error('Not Implemented: replace with link')

  return (
    <div className={s.mediaPlayerContainer} id="media-player">
      <Head>{episode.title}</Head>
      <button 
        className={s.closePlayer}
        data-tooltip-id="close-player"
        data-tooltip-content="Close player"
      >
        <Image src={xIcon} alt="Close player" />
      </button>
      <EpisodeInfo {...episode} className={s.episodeInfo} />
      <MediaPlayer
        episode={episode}
        startTimecode={startTimecode}
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