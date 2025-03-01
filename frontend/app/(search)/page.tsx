import Link from 'next/link'
import s from './page.module.scss'

export default function Page() {
  return (
    <div className={s.banner}>
      <strong>
        Update: <time dateTime="2024-12-25">Dec 25, 2024</time> 🎄
      </strong>{' '}
      After a few months of missing videos due to the closure of harmontown.com,
      video episode playback is back with YouTube hosting –{' '}
      <Link href="/about/#thanks">thanks to these people</Link>!
    </div>
  )
}
