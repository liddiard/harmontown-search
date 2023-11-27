import Link from 'next/link'
import { useState, useEffect } from 'react'
import s from './page.module.scss'
import { fetchEpisodeIndex, formatDate } from 'utils'

export default function EpisodeList() {
  const [episodes, setEpisodes] = useState([])

  useEffect(() => {
    (async () => {
      const episodes = await fetchEpisodeIndex()
      setEpisodes(episodes)
    })()
  }, [])

  return (
    <article className={s.episodeList}>
      <h1>Episode List</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map(ep => 
            <tr key={ep.number} id={`ep${ep.number}`}>
              <td className={s.number}>
                {ep.number}
              </td>
              <td className={s.title} data-number={ep.number}>
                <Link href={`/episode/${ep.number}`}>
                  {ep.title}
                </Link>
              </td>
              <td className={s.date}>
                {formatDate(ep.record_date || ep.release_date)}
              </td>
              <td className={s.description}>
                {ep.description}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </article>
  )
}