import Image from 'next/image'
import { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import shuffle from 'lodash.shuffle'
import classNames from 'classnames'

import s from './SearchBar.module.scss'
import magnifyingGlass from 'img/magnifying-glass.svg'
import searchSuggestions from './searchSuggestions.json'


// change the search input placeholder text every x milliseconds
// this value must match the `fadeInOut` CSS class animation duration in the
// associated stylesheet
const PLACEHOLDER_CYCLE_MS = 4000

interface SearchBarProps {
  initialQuery: string,
  searchParams: URLSearchParams
}

export default function SearchBar({
  initialQuery = '',
  searchParams
} : SearchBarProps) {
  const defaultPlaceholder = 'Search'
  const [currentQuery, setCurrentQuery] = useState(initialQuery)
  // if the input is empty, show the first placeholder suggestion on first render
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(currentQuery ? null : 0)
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
    router.push(`${pathname}?${params.toString()}`)
    if (document.activeElement instanceof HTMLElement) {
      // remove focus from the input to hide keyboard on mobile
      document.activeElement.blur()
    }
  }

  // setInterval to change the placeholder every `PLACEHOLDER_CYCLE_MS`
  const startPlaceholderCycle = useCallback(() => {
    window.clearInterval(cycleInterval.current)
    setPlaceholderIndex(Math.floor(Math.random() * searchSuggestions.length))
    cycleInterval.current = window.setInterval(() => {
      setPlaceholderIndex(prevIndex => 
        prevIndex! + 1 === searchSuggestions.length ? 0 : prevIndex! + 1)
    }, PLACEHOLDER_CYCLE_MS)
  }, [])

  // clearInterval to stop changing the placeholder
  const endPlaceholderCycle = () => {
    window.clearInterval(cycleInterval.current)
    setPlaceholderIndex(null)
  }

  // only start the placeholder cycle if the input is empty
  const handleFocus = useCallback(() => {
    if (currentQuery) {
      return
    }
    startPlaceholderCycle()
  }, [currentQuery, startPlaceholderCycle])

  // start the placeholder cycle if the input was cleared, or stop it if it
  // went from empty to containing text
  const handleChange = (ev: { target: HTMLInputElement }) => {
    const { value } = ev.target
    if (currentQuery && !value) {
      startPlaceholderCycle()
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
    handleFocus()
  }, [handleFocus])

  return (
    <form onSubmit={handleSubmit} className={s.search}>
      <p>Search all <strong>361</strong> episodes, <strong>14,931</strong> minutes, and <strong>6,611,981</strong> words spoken in Harmontown:</p>
      <div className={s.inputWrapper}>
        {currentQuery ? null : renderPlaceholder()}
        <input 
          type="search"
          name="main-search"
          aria-label="Search all episodes"
          value={currentQuery}
          autoCapitalize="none"
          autoFocus
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