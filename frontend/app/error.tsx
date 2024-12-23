'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import s from './error.module.scss'

interface ErrorProps {
  error: Error
}

export default function Error({ error }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div id={s.errorPage}>
      <h1>Error</h1>
      <p>
        <em>It’s a critical fail!</em>
      </p>
      <p>
        Sorry, an unexpected error has occurred. You can{' '}
        <a
          href="https://github.com/liddiard/harmontown-search/issues/new/choose"
          target="_blank"
          rel="noreferrer"
        >
          report it on GitHub
        </a>
        . Please include the error message below and what action you took before
        the error happened.
      </p>
      <pre>{error.stack}</pre>
      <Link href="/">
        <strong>Go to search</strong>
      </Link>
    </div>
  )
}
