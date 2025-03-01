import { metadata } from './layout'
import { IFuseOptions } from 'fuse.js'

import { Episode, TranscriptLine } from './types'
import { TYPESENSE } from './keys'

// default page title
export const defaultTitle = 'Harmontown Podcast Search'
export const metadataBase = new URL('https://harmonsearch.com')

// https://www.fusejs.io/api/options.html
export const fuseConfig: {
  episode: IFuseOptions<Episode>
  transcript: IFuseOptions<TranscriptLine>
} = {
  episode: {
    keys: ['number', 'title', 'description'],
    threshold: 0.2,
    ignoreLocation: true,
    fieldNormWeight: 0.2,
    minMatchCharLength: 2,
    sortFn: (a, b) => Number(a.item.number) - Number(b.item.number),
  },
  transcript: {
    keys: ['text'],
    threshold: 0.2,
    ignoreLocation: true,
    minMatchCharLength: 2,
    sortFn: (a, b) => Number(a.item.start) - Number(b.item.start),
  },
}

export const TYPESENSE_CONFIG =
  process.env.NODE_ENV === 'development'
    ? {
        nodes: [
          {
            host: 'localhost',
            port: 8108,
            protocol: 'http',
          },
        ],
        // IMPORTANT: This is a scoped, PUBLIC API key, with read-only access to the
        // `transcripts` collection, created by `generate_scoped_search_key.sh`
        apiKey: TYPESENSE.DEV,
        connectionTimeoutSeconds: 10,
      }
    : {
        nodes: [
          {
            host: 'api.harmonsearch.com',
            port: 443,
            protocol: 'https',
          },
        ],
        // IMPORTANT: This is a scoped, PUBLIC API key, with read-only access to the
        // `transcripts` collection, created by `generate_scoped_search_key.sh`
        apiKey: TYPESENSE.PROD,
        connectionTimeoutSeconds: 10,
      }
