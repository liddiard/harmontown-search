import { NavLink, Outlet, useSearchParams } from 'react-router-dom'
import s from './root.module.scss'

export default function Root() {
  const [searchParams, setSearchParams] = useSearchParams()

  const navLinks = [
    {
      url: '/episode-list',
      text: 'Episode List'
    },
    {
      url: '/about',
      text: 'About'
    },
  ]

  return (
    <>
      <header>
        <a href="/" id={s.logo}>
          <div className={s.unofficial}>Unofficial</div>
          <h1>Harmontown<span className={s.searchHeading}> Search</span></h1>
        </a>
        <nav>
          {navLinks.map(link => 
            <NavLink 
              key={link.url}
              to={link.url}
              className={({ isActive }) =>
                isActive ? s.active : ''
              }>
              {link.text}
            </NavLink>
          )}
        </nav>
      </header>
      <Outlet context={[searchParams, setSearchParams]} />
      <footer>
        <span className={s.disclaimer}>
          This is a fan-made site. It is not affiliated with Harmontown Productions LLC nor with anyone from the podcast.
        </span>
      </footer>
    </>
  )
}