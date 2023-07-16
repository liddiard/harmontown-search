import { useState, useEffect, useRef } from 'react'
import Papa from 'papaparse'
import Fuse from 'fuse.js'
import EpisodeResult from '../components/EpisodeResult'

export default function Root() {
  const [episodes, setEpisodes] = useState([])
  const [currentQuery, setCurrentQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [episodeResults, setEpisodeResults] = useState([])

  const fuse = useRef(new Fuse())

  useEffect(() => {
    Papa.parse('/episode_list.tsv', {
      download: true,
      header: true,
      dynamicTyping: true,
      delimiter: '\t',
      complete: function(results) {
        setEpisodes(results.data)
        fuse.current = new Fuse(results.data, {
          // https://www.fusejs.io/api/options.html
          keys: [
            'number',
            'title',
            'description'
          ],
          threshold: 0.2,
          includeScore: true,
          ignoreLocation: true,
          fieldNormWeight: 0.2,
          minMatchCharLength: 2
        })
      }
    });
  }, []);

  const handleSearch = (ev) => {
    ev.preventDefault()
    setSubmittedQuery(currentQuery)
    setEpisodeResults(fuse.current.search(currentQuery))
  }

  return (
    <>
      <h1>Harmontown</h1>
      <form onSubmit={handleSearch}>
        <input 
          type="search"
          placeholder="Search"
          value={currentQuery}
          onChange={ev => setCurrentQuery(ev.target.value)} 
        />
      </form>
      <div className="results">
        <h2>Episodes</h2>
        <ol>
          {episodeResults.map(result => 
            <EpisodeResult
              key={result.item.number}
              query={submittedQuery}
              result={result.item} />
          )}
        </ol>
      </div>
    </>
  );
}