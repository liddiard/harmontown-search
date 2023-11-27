'use client'

import { useEffect } from 'react'
import s from './error.module.scss'

export default function Error({
  error
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div id={s.errorPage}>
      <h1>Error</h1>
      <p><em>It's a critical fail!</em></p>
      <p>
        Sorry, an unexpected error has occurred. You can <a href="https://github.com/liddiard/harmontown-search/issues/new/choose" target="_blank" rel="noreferrer">report it on GitHub</a>. Please include the error message below and what action you took before the error happened.
      </p>
      <pre>
        {error.stack}
      </pre>
      <a href="/"><strong>Go to search</strong></a>
    </div>
  )
}