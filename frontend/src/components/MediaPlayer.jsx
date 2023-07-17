import { Tooltip } from 'react-tooltip'
import './MediaPlayer.scss'
import xIcon from '../img/x.svg'
import shareIcon from '../img/share.svg'
import EpisodeInfo from './EpisodeInfo'
import { useState } from 'react'
import ShareDialog from './ShareDialog'

const getMediaElement = (mediaType, url) => {
  switch (mediaType) {
    case 'audio':
      return <>
        <audio src={url} autoPlay controls />
        <p className="no-video">This episode was not video recorded.</p>
      </>
    case 'video':
      return <video src={url} autoPlay controls />
    default:
      throw Error(`Unrecognized media type: ${mediaType}`)
  }
}

export default function MediaPlayer({
  episode,
  setCurrentEpisode 
}) {
  const { video_link, audio_link } = episode
  const mediaType = video_link ? 'video' : 'audio'
  const url = video_link || audio_link

  const [shareOpen, setShareOpen] = useState(false)

  const closePlayer = () => {
    setCurrentEpisode(null)
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
      {getMediaElement(mediaType, url)}
      <button
        className="share"
        onClick={() => setShareOpen(!shareOpen)}
      >
        <img src={shareIcon} alt="" />
        Share
      </button>
      <ShareDialog
        open={shareOpen}
        setOpen={setShareOpen}
      />
      <Tooltip id="close-player" place="left" />
    </div>
  )
}