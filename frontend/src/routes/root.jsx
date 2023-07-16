import './root.scss'
import { Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <>
      <header>
        <a href="/" id="logo">
          <label>Unofficial</label>
          <h1>Harmontown Search</h1>
        </a>
        <nav>
          <a href="/about">About</a>
        </nav>
      </header>
      <Outlet />
      <footer>
        <span className="disclaimer">
          This is a fan-made project. It is not affiliated with anyone from the podcast or with Harmontown Productions LLC.
        </span>
      </footer>
    </>
  );
}