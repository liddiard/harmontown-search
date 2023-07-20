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
    minMatchCharLength: 2
  }
}

export const searchSuggestions = [
  'monster man',
  'mc john',
  'cheapy peepy',
  'Robocop',
  'ED-209'
]