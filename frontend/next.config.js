/** @type {import('next').NextConfig} */

const nextConfig = {
  // // https://nextjs.org/docs/app/building-your-application/deploying/static-exports
  // output: 'export',
  // // https://stackoverflow.com/a/66573096/2487925
  // trailingSlash: true,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.module.rules.push({
      test: /\.tsv/,
      use: [
        {
          loader: 'csv-loader',
          // https://www.papaparse.com/docs#config
          options: {
            header: true,
            dynamicTyping: true,
            delimiter: '\t',
            skipEmptyLines: true
          }
        },
      ],
    })
    config.module.rules.push({
      test: /\.md/,
      use: 'raw-loader'
    })
    return config
  },
}

module.exports = nextConfig
