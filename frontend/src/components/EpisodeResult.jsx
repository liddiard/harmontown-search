import './EpisodeResult.scss'
import EpisodeInfo from './EpisodeInfo'
import playIcon from '../img/play.svg'

export default function EpisodeResult({
  result,
  query,
  selected,
  setEpisode
}) {
  const { number } = result

  const handleKeydown = (ev) => {
    // enter or space keys
    if (ev.keyCode === 13 || ev.keyCode === 32) {
      ev.preventDefault()
      setEpisode(number)
    }
  }

  return (
    <li 
      className={`result ${selected ? 'selected' : ''}`}
      onClick={() => setEpisode(number)}
      role="link"
      tabIndex={0}
      onKeyDown={handleKeydown}
    >
      {selected ?
        <img src={playIcon} alt="Now playing" title="Now playing" className="playing" />
      : null}
      <EpisodeInfo {...result} query={query} />
    </li>
  )
}