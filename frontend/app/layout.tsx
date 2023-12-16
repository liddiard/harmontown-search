import type { Metadata } from 'next'
import Image from 'next/image'
import { Inter, Bebas_Neue } from 'next/font/google'
import classNames from 'classnames'

import 'layout.scss'
import Nav from '@/components/nav'
import heartIcon from 'img/heart.svg'


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
  description: 'Search the transcripts from every episode of Harmontown, a podcast featuring Dan Harmon, Jeff B. Davis, and Spencer Crittenden.',
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
          <a href="/" id="logo">
            <div className="unofficial">Unofficial</div>
            <h1 className={bebas.className}>
              Harmontown<span className={classNames(inter.className, 'searchHeading')}> Search</span>
            </h1>
          </a>
          <Nav />
        </header>
        {children}
        <footer>
          <p className="donate">
            <Image src={heartIcon} alt="love" /> Harmontown Search? <a href="https://www.buymeacoffee.com/liddiard" target="_blank" rel="noreferrer">Donate</a> toward the <a href="#">web hosting</a> to keep it running!
          </p>
          <p className="disclaimer">
            This is a fan-made site. It is not affiliated with Harmontown Productions LLC nor with anyone involved in the podcast.
          </p>
        </footer>
      </body>
    </html>
  )
}
