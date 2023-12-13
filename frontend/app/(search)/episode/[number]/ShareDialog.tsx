import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

import s from './ShareDialog.module.scss'
import xIcon from 'img/x.svg'
import linkIcon from 'img/link.svg'
import checkmarkIcon from 'img/checkmark.svg'
import { formatTimecode } from '@/utils'


enum ShareOption { StartCurrent, IncludeResults }

interface ShareDialogProps {
  setOpen: (open: boolean) => void,
  timecode: number
}

export default function ShareDialog({
  setOpen,
  timecode
}: ShareDialogProps) {
  const { StartCurrent, IncludeResults } = ShareOption

  const [options, setOptions] = useState({
    [StartCurrent]: true,
    [IncludeResults]: false
  })
  const [linkCopied, setLinkCopied] = useState(false)

  const dialogEl = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogEl.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })
  }, [])

  const toggleOption = (option: ShareOption) => {
    setOptions({
      ...options,
      [option]: !options[option]
    })
    setLinkCopied(false)
  }

  const copyLink = async () => {
    const url = new URL(window.location.href)
    if (options[StartCurrent]) {
      url.searchParams.set('t', Math.floor(timecode).toString())
    }
    if (!options[IncludeResults]) {
      url.searchParams.delete('q')
    }
    const cb = navigator.clipboard
    await cb.writeText(url.toString())
    setLinkCopied(true)
  }

  const handleKeydown = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <>
      <dialog
        className={s.shareDialog}
        ref={dialogEl}
        open
        onKeyDown={handleKeydown}
      >
        <label>
          <input
            type="checkbox"
            checked={options[StartCurrent]}
            onChange={() => toggleOption(StartCurrent)}
            autoFocus
          />
          Start at <time className="timecode">{formatTimecode(timecode * 1000)}</time>
        </label>
        <label>
          <input
            type="checkbox" 
            checked={options[IncludeResults]}
            onChange={() => toggleOption(IncludeResults)}
          />
          Include search results
        </label>
        <div className={s.shareActions}>
          <button
              className={`${s.copyLink} ${linkCopied ? s.copied : ''}`}
              onClick={copyLink}
            >
            <Image src={linkCopied ? checkmarkIcon : linkIcon} alt="" />
            {linkCopied ? 'Copied' : 'Copy link'}
          </button>
          <button
            className={s.close}
            onClick={() => {
              setOpen(false)
              setLinkCopied(false)
            }}
          >
            <Image src={xIcon} alt="" />
            Close
          </button>
        </div>
      </dialog>
      <div 
        className={s.bgMask}
        onClick={() => setOpen(false)}
      />
    </>
  )
}