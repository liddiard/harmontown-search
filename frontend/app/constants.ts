import { IFuseOptions } from 'fuse.js'

import { Episode, TranscriptLine } from './types'


// default page title
export const defaultTitle = 'Harmontown Podcast Search'

// https://www.fusejs.io/api/options.html
export const fuseConfig: {
  episode: IFuseOptions<Episode>,
  transcript: IFuseOptions<TranscriptLine>
} = {
  episode: {
    keys: [
      'number',
      'title',
      'description'
    ],
    threshold: 0.2,
    ignoreLocation: true,
    fieldNormWeight: 0.2,
    minMatchCharLength: 2,
    sortFn: (a, b) => Number(a.item.number) - Number(b.item.number)
  },
  transcript: {
    keys: [
      'text'
    ],
    threshold: 0.2,
    ignoreLocation: true,
    minMatchCharLength: 2,
    sortFn: (a, b) => Number(a.item.start) - Number(b.item.start)
  }
}

export const TYPESENSE_CONFIG = process.env.NODE_ENV === 'development' ? {
  nodes: [{
    host: 'localhost',
    port: 8108,
    protocol: 'http'
  }],
  // IMPORTANT: This is a scoped, PUBLIC API key, with read-only access to the
  // `transcripts` collection, created by `generate_scoped_search_key.sh`
  apiKey: 'ay96SlROL1g4MDA5NGF1NlJqOEphTUJzNEh3czJNcnZ2dk42RnlZcmx2Zz1FRjA5eyJxdWVyeV9ieSI6InRleHQiLCJncm91cF9ieSI6ImVwaXNvZGUiLCJncm91cF9saW1pdCI6MTAsInNvcnRfYnkiOiJlcGlzb2RlOmFzYyIsInVzZV9jYWNoZSI6dHJ1ZSwiY2FjaGVfdHRsIjozNjAwfQ==',
  connectionTimeoutSeconds: 10
} : {
  nodes: [{
    host: 'harmontown-search-api.harrisonliddiard.com',
    port: 443,
    protocol: 'https'
  }],
  // IMPORTANT: This is a scoped, PUBLIC API key, with read-only access to the
  // `transcripts` collection, created by `generate_scoped_search_key.sh`
  apiKey: 'MzhzTnE0bEJLbE1oc2FvV3J5ZnliOEs2WUJNb3hOcjhrbW9ma0NheG5TZz1sM2lFeyJxdWVyeV9ieSI6InRleHQiLCJncm91cF9ieSI6ImVwaXNvZGUiLCJncm91cF9saW1pdCI6MTAsInNvcnRfYnkiOiJlcGlzb2RlOmFzYyIsInVzZV9jYWNoZSI6dHJ1ZSwiY2FjaGVfdHRsIjozNjAwfQ==',
  connectionTimeoutSeconds: 10
}