import './root.scss'
import { Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <>
      <header>
        <a href="/" id="logo">
          <label>Unofficial</label>
          <h1>Harmontown<span className="search-heading"> Podcast Search</span></h1>
        </a>
        <nav>
          <a href="/about">About</a>
        </nav>
      </header>
      <Outlet />
      <footer>
        <span className="disclaimer">
          This is a fan-made site. It is not affiliated with Harmontown Productions LLC nor with anyone from the podcast.
        </span>
      </footer>
    </>
  );
}