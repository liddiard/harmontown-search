import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

import s from './ShareDialog.module.scss'
import xIcon from 'img/x.svg'
import linkIcon from 'img/link.svg'
import checkmarkIcon from 'img/checkmark.svg'
import { formatTimecode } from 'utils'


interface ShareDialogProps {
  setOpen: (open: boolean) => void,
  timecode: number
}

export default function ShareDialog({
  setOpen,
  timecode
}: ShareDialogProps) {
  const [startCurrent, setStartCurrent] = useState(true)
  const [includeResults, setIncludeResults] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const dialogEl = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogEl.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })
  }, [])

  const copyLink = async () => {
    const url = new URL(window.location.href)
    if (startCurrent) {
      url.searchParams.set('t', Math.floor(timecode).toString())
    }
    if (!includeResults) {
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
            checked={startCurrent}
            onChange={() => setStartCurrent(!startCurrent)}
            autoFocus
          />
          Start at <time className="timecode">{formatTimecode(timecode * 1000)}</time>
        </label>
        <label>
          <input
            type="checkbox" 
            checked={includeResults}
            onChange={() => setIncludeResults(!includeResults)}
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