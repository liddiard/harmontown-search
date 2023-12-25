'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

import s from './Donate.module.scss'
import xIcon from 'img/x-gray.svg'


interface DonateProps {
  children: React.ReactNode,
  profileName: string
}

// Ko-fi donation popup
// Made this because Ko-fi's suggested way of loading a script tag then
// referencing a global variable it creates does not work well in Next.js.
// It boiled down to a lot of race condition issues between loading te script
// and executing the code that depends on it.
export default function Donate({
  children,
  profileName
}: DonateProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button 
        className={s.donate}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      {open ? 
        <div className={s.popup}>
          <button
            className={s.close}
            onClick={() => setOpen(false)}
            title="Close"
          >
            <Image src={xIcon} alt="Close donate popup" />
          </button>
          <iframe src={`https://ko-fi.com/${profileName}?hidefeed=true&widget=true&embed=true`} />
          <div className={s.link}>
            <a href={`https://ko-fi.com/${profileName}`} target="_blank" rel="noreferrer">
              ko-fi.com/{profileName}
            </a>
          </div>
        </div>
      : null}
    </>
  )
}