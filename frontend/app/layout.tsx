import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Inter, Bebas_Neue } from 'next/font/google'
import classNames from 'classnames'

import 'layout.scss'
import Nav from '@/components/nav'
import heartIcon from 'img/heart.svg'
import { Donate } from 'react-kofi-overlay'


const inter = Inter({
  subsets: ['latin'],
  fallback: ['system-ui']
})
const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  fallback: ['system-ui']
})

export const metadata: Metadata = {
  title: 'Harmontown Podcast Search',
  description: 'Search all episodes of Harmontown: the podcast featuring Dan Harmon, Jeff B. Davis, and Spencer Crittenden.',
  metadataBase: new URL('https://harmonsearch.com')
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const donate = (
    <Donate
      username="liddiard"
      classNames={{
        donateBtn: 'donateBtn',
        profileLink: 'profileLink'
      }}
    >
      Donate
    </Donate>
  )

  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <Link href="/" id="logo">
            <div className="unofficial">Unofficial</div>
            <h1 className={bebas.className}>
              Harmontown<span className={classNames(inter.className, 'searchHeading')}> Search</span>
            </h1>
          </Link>
          <Nav />
        </header>
        {children}
        <footer>
          <div className="disclaimer">
            Disclaimer: This is a fan-made site. It is not affiliated with Harmontown Productions LLC or with anyone from the podcast.
          </div>
        </footer>
      </body>
    </html>
  )
}
