'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

import s from './Donate.module.scss'
import xIcon from 'img/x-gray.svg'

// Ko-fi donation popup
// Made this because Ko-fi's suggested way of loading a script tag then
// referencing a global variable it creates does not work well in Next.js.
// It boiled down to a lot of race condition issues between loading te script
// and executing the code that depends on it.
export default function Donate() {
  const [open, setOpen] = useState(false)

  const setOpenFromHash = () =>
    setOpen(window.location.hash === '#donate')

  const handleClose = () => {
    setOpen(false)
    history.pushState(null, '', '#');
  }


  useEffect(() => {
    setOpenFromHash()
    const onHashChanged = () => {
      setOpenFromHash()
    }
    window.addEventListener('hashchange', onHashChanged)
    return () => {
      window.removeEventListener('hashchange', onHashChanged)
    }
  }, [])

  if (!open) {
    return null
  }

  return (
    <div className={s.wrapper}>
      <button
        className={s.close}
        onClick={handleClose}
        title="Close"
      >
        <Image src={xIcon} alt="Close donate popup" />
      </button>
      <iframe src="https://ko-fi.com/liddiard/?hidefeed=true&widget=true&embed=true" />
      <div className={s.link}>
        <a href="https://ko-fi.com/liddiard/" target="_blank" rel="noreferrer">
          ko-fi.com/liddiard
        </a>
      </div>
    </div>
  )
}