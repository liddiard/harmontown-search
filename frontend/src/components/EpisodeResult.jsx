import './EpisodeResult.scss'
import EpisodeInfo from './EpisodeInfo'

export default function EpisodeResult({
  result,
  query,
  selected,
  setEpisode
}) {
  const { number } = result
  return (
    <li 
      className={`result ${selected ? 'selected' : ''}`}
      onClick={() => setEpisode(number)}
    >
      <EpisodeInfo {...result} query={query} />
    </li>
  )
}