'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import classNames from 'classnames'


export default function Nav() {
  const pathname = usePathname()
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
    <nav>
      {navLinks.map(link => 
        <Link 
          key={link.url}
          href={link.url}
          className={classNames({
            active: pathname === link.url
          })}
        >
          {link.text}
        </Link>
      )}
    </nav>
  )
}