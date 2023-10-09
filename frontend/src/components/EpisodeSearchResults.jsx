import EpisodeResult from './EpisodeResult'
import s from './EpisodeSearchResults.module.scss'

export default function EpisodeSearchResults({
  results,
  query,
  currentEpisodeNumber,
  setCurrentEpisode
}) {
  if (!results.length) {
    return null
  }
  return (
    <>
      <h2>
        <span className="numResults">{results.length} </span>
        Episode description{results.length > 1 ? 's' : null}
      </h2>
      <ol className={s.results}>
        {results.map(result => 
          <EpisodeResult
            key={result.item.number}
            query={query}
            selected={result.item.number === currentEpisodeNumber}
            setEpisode={setCurrentEpisode}
            result={result.item} />
        )}
      </ol>
    </>
  )
}