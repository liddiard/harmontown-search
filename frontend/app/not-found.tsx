import Link from 'next/link'

import s from './not-found.module.scss'


export default function NotFound() {
  return (
    <main className={s.notFound}> 
      <div className={s.number}>
        404
      </div>
      <h1>Not Found</h1>
      <p className={s.search}>
        Want to <Link href="/">search the episodes</Link>?
      </p>
      <p className={s.narration}>
        You find yourself... on a webpage. But it’s not the delightful destination you imagined. Examining your surroundings, you see only an inky black expanse punctuated by meager navigation to the north, and a faint disclaimer to the south. Forging onward, you stumble upon a paragraph of Spencer-like narration that is inexplicably meta. You feel as though it might be time to move on.
      </p>
    </main>
  )
}