import { Link } from 'react-router-dom'
import s from './404.module.scss'

export default function NotFound() {
  return (
    <main className={s.notFound}> 
      <div className={s.number}>
        404
      </div>
      <h1>Not Found</h1>
      <p>Want to <Link to="/">search the episodes</Link>?</p>
      <p className={s.narration}>You find yourself... on a webpage. But it’s not the delightful destination you imagined. Examining your surroundings, you see only an inky black expanse punctuated by a meager set of navigation to the north, and a faint disclaimer to the south. Forging onward, you stumble upon a paragraph of Spencer-like narration that is inexplicably meta. You feel as though it might be time to move on.</p>
    </main>
  )
}