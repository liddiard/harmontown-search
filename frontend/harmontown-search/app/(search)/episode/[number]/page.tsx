'use client'

import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'react-tooltip'
import debounce from 'lodash.debounce'

import s from './page.module.scss'
import xIcon from 'img/x.svg'
import shareIcon from 'img/share.svg'
import poster from 'img/harmontown-logo-bg-poster.png'
import EpisodeInfo from 'EpisodeInfo'
import ShareDialog from './ShareDialog'
import Transcript from './Transcript'
import { findEpisodeByNumber, getMediaData, getQueryParamsWithoutTimecode, getTimecodeLocalStorageKey } from 'utils'
import { fetchEpisodeIndex } from '@/episodeIndex'


export async function generateStaticParams() {
  const episodes = await fetchEpisodeIndex()
  return episodes.map(({ number }) => ({ number }))
}

export default function MediaPlayer({
  number,
  startTimecode
}) {
  
  const [timecode, setTimecode] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)
  const [episode, setEpisode] = useState(null)
  
  const mediaEl = useRef()

  const { mediaType, url } = getMediaData(episode)

  useEffect(() => {
    (async () => {
      setShareOpen(false)
      const episodes = await fetchEpisodeIndex()
      setEpisode(findEpisodeByNumber(episodes, number))
    })()
  }, [number])

  const closePlayer = () => console.error('Not Implemented: replace with link')

  // update timecode in local storage and passed to transcript for current line
  // highlight/scroll
  // https://lodash.com/docs/4.17.15#debounce
  const updateTimecode = debounce((ev) => {
    const { currentTime } = ev.target
    setTimecode(currentTime)
    window.localStorage.setItem(
      getTimecodeLocalStorageKey(episode.number),
      currentTime
    )
  }, 500, { leading: true, maxWait: 500 })

  const seek = useCallback((ms, options = {}) => {
    if (!mediaEl.current) {
      return
    }
    mediaEl.current.currentTime = ms / 1000
    if (options.play) {
      mediaEl.current.play()
    }
  }, [mediaEl])

  const mediaElement = useMemo(() => ((mediaType, url) => {
    const timecodeUrl = `${url}#t=${startTimecode}`
    switch (mediaType) {
      case 'audio':
        return <audio
          src={timecodeUrl}
          autoPlay
          controls
          onTimeUpdate={updateTimecode}
          ref={mediaEl}
        />
      case 'video':
        return <video
          src={timecodeUrl}
          autoPlay
          controls
          poster={poster}
          onTimeUpdate={updateTimecode}
          ref={mediaEl}
        />
      default:
        throw Error(`Unrecognized media type: ${mediaType}`)
    }
  })(mediaType, url), [startTimecode, mediaType, url, updateTimecode])

  return (
    <div className={s.mediaPlayerContainer} id="media-player">
      <Head>{episode.title}</Head>
      <button 
        className={s.closePlayer}
        data-tooltip-id="close-player"
        data-tooltip-content="Close player"
        onClick={closePlayer}>
        <Image src={xIcon} alt="Close player" />
      </button>
      <EpisodeInfo {...episode} className={s.episodeInfo} />
      <div className={`${s.mediaPlayer} ${mediaType}`}>
        {mediaElement}
        <Transcript
          epNumber={episode.number}
          timecode={timecode}
          seek={seek}
          mediaType={mediaType}
        />
      </div>
      <div className={s.mediaActions}>
        <button
          className={`${s.share} ${shareOpen ? s.open : ''}`}
          onClick={() => setShareOpen(!shareOpen)}
          >
          <Image src={shareIcon} alt="" />
          Share
        </button>
        <span className={s.disclaimer}>
          Transcripts are auto generated and may contain errors.
        </span>
      </div>
      {shareOpen ?
        <ShareDialog timecode={timecode} setOpen={setShareOpen} />
        : null}
      <Tooltip id="close-player" place="left" />
    </div>
  )
}

MediaPlayer.propTypes = {
  episode: PropTypes.shape({
    number: PropTypes.number.isRequired
  }),
  startTimecode: PropTypes.number
}