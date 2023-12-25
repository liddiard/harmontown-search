import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Inter, Bebas_Neue } from 'next/font/google'
import classNames from 'classnames'

import 'layout.scss'
import Nav from '@/components/nav'
import heartIcon from 'img/heart.svg'
import Donate from './components/Donate'


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
          <p className="donation">
            {/* Using an <a> element on the Donate button because the Kofi donate component relies
                on the window.hashChange event, and this event is not fired for Next.js Link
                component. The alternative would be to maintain donation popup open/close state
                in this component, but that would entail making the entire app a client component. */}
            <Image src={heartIcon} alt="love" /> Harmontown Search? <a href="#donate" className="donate">Donate</a> a few bucks to help fund the <Link href="#">web hosting costs</Link>!
          </p>
          <p className="disclaimer">
            This is a fan-made site. It is not affiliated with Harmontown Productions LLC nor with anyone involved in the podcast.
          </p>
          <Donate profileName="liddiard" />
        </footer>
      </body>
    </html>
  )
}
