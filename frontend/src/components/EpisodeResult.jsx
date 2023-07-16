import './EpisodeResult.scss'
import EpisodeInfo from './EpisodeInfo'

export default function EpisodeResult({
  result,
  query,
  setEpisode
}) {
  const { number } = result
  return (
    <li 
      className="result" 
      onClick={() => setEpisode(number)}
    >
      <EpisodeInfo {...result} query={query} />
    </li>
  )
}