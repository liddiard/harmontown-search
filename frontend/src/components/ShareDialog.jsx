import { useState } from 'react'
import './ShareDialog.scss'
import xIcon from '../img/x.svg'
import linkIcon from '../img/link.svg'
import checkmarkIcon from '../img/checkmark.svg'

export default function ShareDialog({
  open,
  setOpen
}) {
  const [startCurrent, setStartCurrent] = useState(true)
  const [includeResults, setIncludeResults] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const copyLink = () => {
    setLinkCopied(true)
  }

  return (
    <dialog className="share" open={open}>
      <label>
        <input
          type="checkbox"
          checked={startCurrent}
          onChange={() => setStartCurrent(!startCurrent)}
        />
        Start at current time
      </label>
      <label>
        <input
          type="checkbox" 
          checked={includeResults}
          onChange={() => setIncludeResults(!includeResults)}
        />
        Include search results
      </label>
      <div className="actions">
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