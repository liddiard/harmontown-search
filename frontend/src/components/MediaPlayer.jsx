import './MediaPlayer.scss'
import EpisodeInfo from './EpisodeInfo'

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

export default function MediaPlayer({ episode }) {
  const { video_link, audio_link } = episode

  const mediaType = video_link ? 'video' : 'audio'
  const url = video_link || audio_link

  return (
    <div id="media-player">
      <EpisodeInfo {...episode} />
      {getMediaElement(mediaType, url)}
    </div>
  )
}