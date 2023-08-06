import './root.scss'
import { Outlet, useSearchParams } from 'react-router-dom'

export default function Root() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <header>
        <a href="/" id="logo">
          <label>Unofficial</label>
          <h1>Harmontown<span className="search-heading"> Podcast Search</span></h1>
        </a>
        <nav>
          <a href="/about">About</a>
        </nav>
      </header>
      <Outlet context={[searchParams, setSearchParams]} />
      <footer>
        <span className="disclaimer">
          This is a fan-made site. It is not affiliated with Harmontown Productions LLC nor with anyone from the podcast.
        </span>
      </footer>
    </>
  );
}