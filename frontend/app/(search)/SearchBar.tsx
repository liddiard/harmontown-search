import Image from 'next/image'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import shuffle from 'lodash.shuffle'
import classNames from 'classnames'

import s from './SearchBar.module.scss'
import magnifyingGlass from 'img/magnifying-glass.svg'
import searchSuggestions from './searchSuggestions.json'
import { jumpToHash } from '@/utils'
import Link from 'next/link'


interface SearchBarProps {
  initialQuery: string,
  searchParams: URLSearchParams,
  currentEpisode: number
}

export default function SearchBar({
  initialQuery = '',
  searchParams,
  currentEpisode
} : SearchBarProps) {
  const defaultPlaceholder = 'Search'
  const searchBarId = 'search-bar'
  const autoFocus = !currentEpisode

  const [currentQuery, setCurrentQuery] = useState(initialQuery)
  // if the input is empty, show the first placeholder suggestion on first render
  // `null` corresponds to showing the `defaultPlaceholder`
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(currentQuery || !autoFocus ? null : 0)
  const cycleInterval = useRef<number>()
  const placeholders = useRef<string[]>([])
  const pathname = usePathname()
  const router = useRouter()

  const handleSubmit = (ev: React.FormEvent) => {
    ev?.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (currentQuery) {
      params.set('q', currentQuery)
    } else {
      params.delete('q')
    }
    router.push(
      `${pathname}?${params.toString()}`,
      { scroll: false }
    )
    if (document.activeElement instanceof HTMLElement) {
      // remove focus from the input to hide keyboard on mobile
      document.activeElement.blur()
    }
    jumpToHash(searchBarId)
  }

  const cyclePlaceholder = () => {
    setPlaceholderIndex(prevIndex =>
      prevIndex === null ||
      prevIndex + 1 === searchSuggestions.length ?
        0 :
        prevIndex! + 1
    )
    setPlaceholderIndex(Math.floor(Math.random() * searchSuggestions.length))
  }

  const endPlaceholderCycle = () => {
    setPlaceholderIndex(null)
  }

  // only start the placeholder cycle if the input is empty
  const handleFocus = useCallback((ev?: React.FocusEvent<HTMLInputElement>) => {
    if (ev) {
      ev.target.select()
    }
    if (currentQuery) {
      return
    }
    cyclePlaceholder()
  }, [currentQuery])

  // start the placeholder cycle if the input was cleared, or stop it if it
  // went from empty to containing text
  const handleChange = (ev: { target: HTMLInputElement }) => {
    const { value } = ev.target
    if (currentQuery && !value) {
      cyclePlaceholder()
    } else if (!currentQuery && value) {
      endPlaceholderCycle()
    } 
    setCurrentQuery(value)
  }

  const renderPlaceholder = () => (
    <div className={s.placeholders}>
      <span 
        className={classNames({ [s.fadeIn]: placeholderIndex === null })}
      >
        {defaultPlaceholder}
      </span>
      {placeholders.current.map((placeholder, index) => 
        <span 
          className={classNames({ [s.fadeInOut]: index === placeholderIndex })}
          key={placeholder}
          onAnimationEnd={cyclePlaceholder}
        >
          {placeholder}
        </span>
      )}
    </div>
  )

  useEffect(() => {
    // only do randomization on client side to prevent hydration mismatch errors
    placeholders.current = shuffle(searchSuggestions)
    // input is autofocused on page load, but focus event isn't fired
    // call it manually here
    if (autoFocus) {
      handleFocus()
    }
  }, [handleFocus, autoFocus])

  return (
    <form onSubmit={handleSubmit} className={s.search} id={searchBarId}>
      <p>Search all <strong>361</strong> episodes, <strong>14,931</strong> minutes, and <strong>6,611,981</strong> words spoken in <Link href="https://en.wikipedia.org/wiki/Harmontown">Harmontown</Link>:</p>
      <div className={s.inputWrapper}>
        {currentQuery ? null : renderPlaceholder()}
        <input 
          type="search"
          name="main-search"
          aria-label="Search all episodes"
          value={currentQuery}
          autoCapitalize="none"
          autoFocus={autoFocus}
          onFocus={handleFocus}
          onBlur={endPlaceholderCycle}
          onChange={handleChange}
        />
        <button className="search">
          <Image src={magnifyingGlass} alt="Search" />
        </button>
      </div>
    </form>
  )
}