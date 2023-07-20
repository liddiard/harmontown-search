import './EpisodeResult.scss'
import EpisodeInfo from './EpisodeInfo'

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
      className={`selectable result ${selected ? 'selected' : ''}`}
      onClick={() => setEpisode(number)}
      role="link"
      tabIndex={0}
      onKeyDown={handleKeydown}
    >
      <EpisodeInfo {...result} query={query} selected={selected} />
    </li>
  )
}