// https://www.fusejs.io/api/options.html
export const fuseConfig = {
  episode: {
    keys: [
      'number',
      'title',
      'description'
    ],
    threshold: 0.2,
    includeScore: true,
    ignoreLocation: true,
    fieldNormWeight: 0.2,
    minMatchCharLength: 2
  },
  transcript: {}
}

export const searchSuggestions = [
  'monster man',
  'mc john',
  'cheapy peepy',
  'Robocop',
  'ED-209'
]