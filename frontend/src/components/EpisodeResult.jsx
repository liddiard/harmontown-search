import './EpisodeResult.module.scss'
import EpisodeInfo from './EpisodeInfo'
import { handleKeyboardSelect } from '../utils'

export default function EpisodeResult({
  result,
  query,
  selected,
  setEpisode
}) {
  const { number } = result

  return (
    <li 
      className={`selectable result ${selected ? 'selected' : ''}`}
      onClick={() => setEpisode(number)}
      onKeyDown={(ev) => 
        handleKeyboardSelect(ev, () => setEpisode(number))}
      role="link"
      tabIndex={0}
    >
      <EpisodeInfo {...result} query={query} selected={selected} />
    </li>
  )
}