'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from 'react'
import ReactPlayer, { YouTubePlayerProps } from 'react-player/youtube'
import BaseReactPlayer from 'react-player/base'
import { Tooltip } from 'react-tooltip'
import debounce from 'lodash.debounce'
import classNames from 'classnames'

import s from './MediaPlayer.module.scss'
import { Episode, MediaType } from '@/types'
import {
  formatTimecode,
  getMediaData,
  getTimecodeLocalStorageKey,
} from '@/utils'
import ShareDialog from './ShareDialog'
import Transcript from './Transcript'
import shareIcon from 'img/share.svg'
import refreshIcon from 'img/refresh.svg'
import Toast from '@/components/Toast'

export type SeekFunc = (ms: number, options: { play?: boolean }) => void

interface MediaPlayerProps {
  episode: Episode
}

function MediaPlayer({ episode }: MediaPlayerProps) {
  const searchParams = useSearchParams()
  const start = Number(searchParams.get('t'))

  const [isClient, setIsClient] = useState(false)
  const [timecode, setTimecode] = useState(0)
  const [startTimecode, setStartTimecode] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(true)

  const audioEl = useRef<HTMLAudioElement>(null)
  const videoEl = useRef<BaseReactPlayer<YouTubePlayerProps>>(null)
  const resumePlaybackTimecode = useRef<number | null>(null)

  const { mediaType, url } = getMediaData(episode)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    resumePlaybackTimecode.current =
      typeof window === 'undefined'
        ? null
        : Number(
            window.localStorage.getItem(
              getTimecodeLocalStorageKey(episode.number)
            )
          )
    setStartTimecode(start || resumePlaybackTimecode.current || 0)
  }, [episode.number, start])

  // update timecode in local storage and passed to transcript for current line
  // highlight/scroll
  // https://lodash.com/docs/4.17.15#debounce
  const updateTimecode = debounce(
    (timecode) => {
      setTimecode(timecode)
      window.localStorage.setItem(
        getTimecodeLocalStorageKey(episode.number),
        timecode
      )
    },
    500,
    { leading: true, maxWait: 500 }
  )

  const seekAudio: SeekFunc = useCallback(
    (ms, options = {}) => {
      if (!audioEl.current) {
        return
      }
      audioEl.current.currentTime = ms / 1000
      if (options.play) {
        audioEl.current.play()
      }
    },
    [audioEl]
  )

  const seekVideo: SeekFunc = useCallback(
    (ms, options = {}) => {
      if (!videoEl.current) {
        return
      }
      videoEl.current.seekTo(ms / 1000)
      if (options.play) {
        // toggle video playback from off to on to force play
        setVideoPlaying(false)
        window.setTimeout(() => setVideoPlaying(true))
      }
    },
    [videoEl]
  )

  const mediaElement = useMemo(
    () =>
      ((mediaType, url) => {
        switch (mediaType) {
          case MediaType.Audio:
            return (
              <audio
                src={`${url}#t=${startTimecode}`}
                autoPlay
                controls
                onTimeUpdate={(e) =>
                  updateTimecode((e.target as HTMLAudioElement).currentTime)
                }
                ref={audioEl}
              />
            )
          case MediaType.Video:
            return (
              <ReactPlayer
                url={`${url}?t=${startTimecode}`}
                width="100%"
                height="100%"
                className={s.youtubeEmbed}
                progressInterval={100}
                playing={videoPlaying}
                controls
                playsinline
                onProgress={({ playedSeconds }) =>
                  updateTimecode(Math.floor(playedSeconds))
                }
                ref={videoEl}
              />
            )
          default:
            throw Error(`Unrecognized media type: ${mediaType}`)
        }
      })(mediaType, url),
    [startTimecode, mediaType, url, updateTimecode]
  )

  return (
    <>
      <div className={s.mediaPlayer}>
        {/*  Render media on client side only to avoid hydration mismatch errors */}
        {isClient && mediaElement}
        <Transcript
          epNumber={episode.number}
          timecode={timecode}
          seek={mediaType === MediaType.Audio ? seekAudio : seekVideo}
          // YouTube videos are slightly behind the original source timecode by
          // just under a second, presumably due to reencoding
          offset={mediaType === MediaType.Video ? 0.75 : 0}
          mediaType={mediaType}
        />
      </div>
      <div className={s.mediaActions}>
        <button
          className={classNames(s.share, { [s.open]: shareOpen })}
          onClick={() => setShareOpen(!shareOpen)}
        >
          <Image src={shareIcon} alt="" />
          Share
        </button>
        <span className={s.disclaimer}>
          Transcripts are auto generated and may contain errors.
        </span>
      </div>
      {shareOpen ? (
        <ShareDialog timecode={timecode} setOpen={setShareOpen} />
      ) : null}
      <Tooltip id="close-player" place="left" />
      {!start && resumePlaybackTimecode.current ? (
        <Toast duration={10000} className={s.resumeToast}>
          <span>
            Resuming playback from{' '}
            <time>{formatTimecode(resumePlaybackTimecode.current * 1000)}</time>
          </span>
          <button
            onClick={() => {
              resumePlaybackTimecode.current = null
              setStartTimecode(0)
            }}
          >
            <Image src={refreshIcon} alt="" />
            Restart
          </button>
        </Toast>
      ) : null}
    </>
  )
}

// https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
export default function MediaPlayerWrapper(props: MediaPlayerProps) {
  return (
    <Suspense>
      <MediaPlayer {...props} />
    </Suspense>
  )
}
