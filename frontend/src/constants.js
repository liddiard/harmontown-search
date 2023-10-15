export const defaultTitle = 'Harmontown Podcast Search'

// https://www.papaparse.com/docs#config
export const papaConfig = {
  download: true,
  header: true,
  dynamicTyping: true,
  delimiter: '\t',
  skipEmptyLines: true
}

// https://www.fusejs.io/api/options.html
export const fuseConfig = {
  episode: {
    keys: [
      'number',
      'title',
      'description'
    ],
    threshold: 0.2,
    ignoreLocation: true,
    fieldNormWeight: 0.2,
    minMatchCharLength: 2
  },
  transcript: {
    keys: [
      'text'
    ],
    threshold: 0.2,
    ignoreLocation: true,
    minMatchCharLength: 2,
    sortFn: (a, b) => a.item.start - b.item.start
  }
}

export const TYPESENSE_CONFIG = process.env.NODE_ENV === 'development' ? {
  nodes: [{
    host: 'localhost',
    port: '8108',
    protocol: 'http'
  }],
  // IMPORTANT: This is a PUBLIC API key, with read-only access to the
  // `transcripts` collection.
  apiKey: 'J0NFQhLXtu5elmr7ulOrL4m9ZGOEVvSz',
  connectionTimeoutSeconds: 2
} : {

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
  '9-11',
  'they’re coming for you barbara',
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
  'sports corner',
  'chicken noodle man',
  'moon colony',
  'I like that hat mate',
  'duncan trussel',
  'norman lear',
  'it’s in the way that you use it',
  'come on down to harmontown',
  'boned out',
  'meltdown comics',
  'demorge brown',
  'chevy chase'
]