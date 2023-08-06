import { useState } from 'react'
import './ShareDialog.scss'
import xIcon from '../img/x.svg'
import linkIcon from '../img/link.svg'
import checkmarkIcon from '../img/checkmark.svg'
import { formatTimecode } from '../utils'

export default function ShareDialog({
  setOpen,
  timecode
}) {
  const [startCurrent, setStartCurrent] = useState(true)
  const [includeResults, setIncludeResults] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const copyLink = async () => {
    const url = new URL(window.location)
    if (startCurrent) {
      url.searchParams.set('t', Math.floor(timecode))
    }
    if (!includeResults) {
      url.searchParams.delete('q')
    }
    const cb = navigator.clipboard
    await cb.writeText(url.toString())
    setLinkCopied(true)
  }

  return (
    <dialog className="share" open>
      <label>
        <input
          type="checkbox"
          checked={startCurrent}
          onChange={() => setStartCurrent(!startCurrent)}
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
      <div className="share-actions">
        <button
            className={`copy-link ${linkCopied ? 'copied' : ''}`}
            onClick={copyLink}
          >
          <img src={linkCopied ? checkmarkIcon : linkIcon} alt="" />
          {linkCopied ? 'Copied' : 'Copy link'}
        </button>
        <button
          className="close"
          onClick={() => {
            setOpen(false)
            setLinkCopied(false)
          }}
        >
          <img src={xIcon} alt="" />
          Close
        </button>
      </div>
    </dialog>
  )
}