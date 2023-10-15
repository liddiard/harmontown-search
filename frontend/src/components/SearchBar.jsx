import { useState } from 'react'
import PropTypes from 'prop-types'

import s from './SearchBar.module.scss'
import magnifyingGlass from '../img/magnifying-glass.svg'
import { searchSuggestions } from '../constants'

export default function SearchBar({
  initialQuery = '',
  handleSearch
}) {
  const defaultPlaceholder = 'Search'
  const [currentQuery, setCurrentQuery] = useState(initialQuery)
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder)

  const handleFocus = () => {
    const placeholderText = searchSuggestions[Math.floor(Math.random() * searchSuggestions.length)]
    setPlaceholder(placeholderText)
  }

  const handleBlur = () => {
    setPlaceholder(defaultPlaceholder)
  }

  const handleSubmit = (ev) => {
    ev?.preventDefault()
    handleSearch(currentQuery)
  }

  return (
    <form onSubmit={handleSubmit} className={s.search} id="foo">
      <p>Search all <strong>361</strong> episodes, <strong>14,931</strong> minutes, and <strong>6,611,981</strong> words spoken in Harmontown:</p>
      <div className={s.inputWrapper}>
        <input 
          type="search"
          placeholder={placeholder}
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