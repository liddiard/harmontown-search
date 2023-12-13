'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import debounce from 'lodash.debounce'

import s from './MediaPlayer.module.scss'
import { Episode, MediaType } from '@/types'
import { getMediaData, getTimecodeLocalStorageKey } from '@/utils'
import ShareDialog from './ShareDialog'
import Transcript from './Transcript'
import shareIcon from 'img/share.svg'
import poster from 'img/harmontown-logo-bg-poster.png'


export type SeekFunc = (ms: number, options: { play?: boolean }) => void

interface MediaPlayerProps {
  episode: Episode
}

export default function MediaPlayer({
  episode
}: MediaPlayerProps) {
  const searchParams = useSearchParams()
  const start = Number(searchParams.get('t'))

  const [timecode, setTimecode] = useState(0)
  const [startTimecode, setStartTimecode] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)
  
  const mediaEl = useRef<HTMLVideoElement>(null)
  
  const { mediaType, url } = getMediaData(episode)

  useEffect(() => {
    setStartTimecode(
      start ||
      (typeof window !== 'undefined' &&
      Number(window.localStorage.getItem(getTimecodeLocalStorageKey(episode.number)))) ||
      0
    )
  }, [episode.number, start])

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

  const seek: SeekFunc = useCallback((ms, options = {}) => {
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
    const props = {
      src: timecodeUrl,
      autoPlay: true,
      controls: true,
      onTimeUpdate: updateTimecode,
      ref: mediaEl
    }
    switch (mediaType) {
      case MediaType.Audio:
        return <audio {...props} />
      case MediaType.Video:
        return <video poster={poster.src} {...props} />
      default:
        throw Error(`Unrecognized media type: ${mediaType}`)
    }
  })(mediaType, url), [startTimecode, mediaType, url, updateTimecode])
  
  return (
    <>
      <div className={s.mediaPlayer}>
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
    </>
  )
}