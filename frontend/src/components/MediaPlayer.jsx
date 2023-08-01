import { Tooltip } from 'react-tooltip'
import './MediaPlayer.scss'
import xIcon from '../img/x.svg'
import shareIcon from '../img/share.svg'
import poster from '../img/harmontown-logo-bg-poster.png'
import EpisodeInfo from './EpisodeInfo'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ShareDialog from './ShareDialog'
import Transcript from './Transcript'

export default function MediaPlayer({
  episode = {},
  setCurrentEpisode,
  startTimecode
}) {
  const { video_link, audio_link } = episode
  const mediaType = video_link ? 'video' : 'audio'
  const url = video_link || audio_link

  const [timecode, setTimecode] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)

  const mediaEl = useRef()

  useEffect(() => {
    setShareOpen(false)
  }, [episode])

  const closePlayer = () => {
    setCurrentEpisode(null)
  }

  const updateTimecode = (ev) =>
    setTimecode(ev.target.currentTime)

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
    <div id="media-player">
      <button 
        className="close-player"
        data-tooltip-id="close-player"
        data-tooltip-content="Close player"
        onClick={closePlayer}>
        <img src={xIcon} alt="Close player" />
      </button>
      <EpisodeInfo {...episode} />
      <div className={`media-player ${mediaType}`}>
        {mediaElement}
        <Transcript
          number={episode.number}
          timecode={timecode}
          seek={seek}
        />
      </div>
      <div className="media-actions">
        <button
          className="share"
          onClick={() => setShareOpen(!shareOpen)}
          >
          <img src={shareIcon} alt="" />
          Share
        </button>
        <span className="disclaimer">
          Transcript is machine generated and may contain errors.
        </span>
      </div>
      {shareOpen ?
        <ShareDialog timecode={timecode} setOpen={setShareOpen} />
        : null}
      <Tooltip id="close-player" place="left" />
    </div>
  )
}