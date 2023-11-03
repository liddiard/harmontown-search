import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Tooltip } from 'react-tooltip'
import debounce from 'lodash.debounce'

import s from './index.module.scss'
import xIcon from '../../img/x.svg'
import shareIcon from '../../img/share.svg'
import poster from '../../img/harmontown-logo-bg-poster.png'
import EpisodeInfo from '../EpisodeInfo'
import ShareDialog from './ShareDialog'
import Transcript from './Transcript'
import { getMediaData, getQueryParamsWithoutTimecode, getTimecodeLocalStorageKey } from '../../utils'

export default function MediaPlayer({
  episode = {},
  startTimecode
}) {
  const { mediaType, url } = getMediaData(episode)

  const navigate = useNavigate()

  const [timecode, setTimecode] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)

  const mediaEl = useRef()

  useEffect(() => {
    setShareOpen(false)
  }, [episode])

  const closePlayer = () => {
    navigate(`/${getQueryParamsWithoutTimecode()}`)
  }

  // update timecode in local storage and passed to transcript for current line
  // highlight/scroll
  // https://lodash.com/docs/4.17.15#debounce
  const updateTimecode = debounce((ev) => {
    const { currentTime } = ev.target
    setTimecode(currentTime)
    window.localStorage.setItem(
      getTimecodeLocalStorageKey(episode.number),
      timecode
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
  })(mediaType, url), [startTimecode, mediaType, url])

  return (
    <div className={s.mediaPlayerContainer} id="media-player">
      <button 
        className={s.closePlayer}
        data-tooltip-id="close-player"
        data-tooltip-content="Close player"
        onClick={closePlayer}>
        <img src={xIcon} alt="Close player" />
      </button>
      <EpisodeInfo {...episode} className={s.episodeInfo} />
      <div className={`${s.mediaPlayer} ${mediaType}`}>
        {mediaElement}
        <Transcript
          epNumber={episode.number}
          timecode={timecode}
          seek={seek}
        />
      </div>
      <div className={s.mediaActions}>
        <button
          className={`${s.share} ${shareOpen ? s.open : ''}`}
          onClick={() => setShareOpen(!shareOpen)}
          >
          <img src={shareIcon} alt="" />
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