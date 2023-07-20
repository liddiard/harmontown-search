import { Tooltip } from 'react-tooltip'
import './MediaPlayer.scss'
import xIcon from '../img/x.svg'
import shareIcon from '../img/share.svg'
import poster from '../img/harmontown-logo-bg-poster.png'
import EpisodeInfo from './EpisodeInfo'
import { useEffect, useState } from 'react'
import ShareDialog from './ShareDialog'
import Transcript from './Transcript'

export default function MediaPlayer({
  episode = {},
  setCurrentEpisode 
}) {
  const { video_link, audio_link } = episode
  const mediaType = video_link ? 'video' : 'audio'
  const url = video_link || audio_link

  const [timecode, setTimecode] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)

  useEffect(() => {
    setShareOpen(false)
  }, [episode])

  const closePlayer = () => {
    setCurrentEpisode(null)
  }

  const updateTimecode = (ev) =>
    setTimecode(ev.target.currentTime)

  const getMediaElement = (mediaType, url) => {
    switch (mediaType) {
      case 'audio':
        return <audio
          src={url}
          autoPlay
          controls
          onTimeUpdate={updateTimecode}
        />
      case 'video':
        return <video
          src={url}
          autoPlay
          controls
          poster={poster}
          onTimeUpdate={updateTimecode}
        />
      default:
        throw Error(`Unrecognized media type: ${mediaType}`)
    }
  }

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
        {getMediaElement(mediaType, url)}
        <Transcript number={episode.number} timecode={timecode} />
      </div>
      <div className="actions">
        <button
          className="share"
          onClick={() => setShareOpen(!shareOpen)}
          >
          <img src={shareIcon} alt="" />
          Share
        </button>
        {mediaType === 'audio' ?
          <span className="no-video">Note: This episode was not video recorded.</span>
          : null
        }
      </div>
      <ShareDialog
        open={shareOpen}
        setOpen={setShareOpen}
      />
      <Tooltip id="close-player" place="left" />
    </div>
  )
}