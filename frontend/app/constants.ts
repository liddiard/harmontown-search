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
  // IMPORTANT: This is a PUBLIC API key, with read-only access to the
  // `transcripts` collection.
  apiKey: 'J0NFQhLXtu5elmr7ulOrL4m9ZGOEVvSz',
  connectionTimeoutSeconds: 10
} : {
  nodes: [{
    host: 'api.harmontown-search.harrisonliddiard.com',
    port: 443,
    protocol: 'https'
  }],
  // IMPORTANT: This is a PUBLIC API key, with read-only access to the
  // `transcripts` collection.
  apiKey: 'FbaXA81snpUIbyyTvvfgIuahg5trbk7b',
  connectionTimeoutSeconds: 10
}

export const searchSuggestions = [
  'pringles dick',
  'typewriter was invented here',
  'monster man',
  'mc john',
  'emily gordon',
  'chinese murder van',
  'in god’s crosshairs',
  'giraffes',
  'earthshine',
  '9/11',
  'they’re coming to get you barbara',
  'cheapy peepy',
  'mannequin leg',
  'adam goldberg',
  'airlines',
  'uber',
  'mr yahoo',
  'joseph campbell',
  'crossing the threshold',
  'meeting with the goddess',
  'iHarmon',
  'sports corner',
  'cactus bunch',
  'scud',
  'cutting carrots',
  'Gary Busey',
  'relax, it’s holiday inn',
  'high road',
  'yardage',
  'vegas',
  'neil diamond',
  'Sharpie',
  'ED-209',
  'Robocop',
  'Ketel One',
  'therapy',
  'chicken noodle man',
  'moon colony',
  'I like that hat mate',
  'duncan trussell',
  'norman lear',
  'it’s in the way that you use it',
  'come on down to harmontown',
  'boned out',
  'meltdown comics',
  'demorge brown',
  'chevy chase',
  'beef fungus bill',
  'time travel',
  'Brisbane',
  'ray of frost',
  'critical hit',
  'critical fail',
  'mitch hurwitz',
  'john lithgow',
  'superstein',
  'drawing room',
  'robin williams',
  'dr ken',
  'sam elliott',
  'agony spell',
  'achieve weightlessness',
  'play magic with your wife',
  'deadpool',
  'four agreements'
]