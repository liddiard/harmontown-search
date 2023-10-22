import { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import shuffle from 'lodash.shuffle'

import s from './SearchBar.module.scss'
import magnifyingGlass from '../img/magnifying-glass.svg'
import { searchSuggestions } from '../constants'

export default function SearchBar({
  initialQuery = '',
  handleSearch
}) {
  const defaultPlaceholder = 'Search'
  const [currentQuery, setCurrentQuery] = useState(initialQuery)
  const [placeholderIndex, setPlaceholderIndex] = useState(null)

  const placeholders = useRef(shuffle(searchSuggestions))
  const cycleInterval = useRef(null)

  const handleSubmit = (ev) => {
    ev?.preventDefault()
    handleSearch(currentQuery)
  }

  const handleFocus = () => {
    setPlaceholderIndex(Math.floor(Math.random() * searchSuggestions.length))
    cycleInterval.current = window.setInterval(() => {
      setPlaceholderIndex(prevIndex => 
        prevIndex + 1 === searchSuggestions.length ? 0 : prevIndex + 1)
    }, 4000)
  }

  const handleBlur = () => {
    window.clearInterval(cycleInterval.current)
    setPlaceholderIndex(null)
  }

  const renderPlaceholder = () => (
    <div className={s.placeholders}>
      <span 
        className={placeholderIndex === null ? s.fadeIn : ''}
      >
        {defaultPlaceholder}
      </span>
      {placeholders.current?.map((placeholder, index) => 
        <span 
          className={index === placeholderIndex ? s.fadeInOut : ''}
          key={placeholder}
        >
          {placeholder}
        </span>
      )}
    </div>
  )

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
          autoFocus
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={ev => setCurrentQuery(ev.target.value)}
        />
        <button className="search">
          <img src={magnifyingGlass} alt="Search" />
        </button>
      </div>
    </form>
  )
}

SearchBar.propTypes = {
  initialQuery: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired
}