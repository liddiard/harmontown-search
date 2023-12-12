/** @type {import('next').NextConfig} */

const nextConfig = {
  // https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
  output: 'export',
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.module.rules.push({
      test: /\.tsv/,
      use: [
        defaultLoaders.babel,
        {
          loader: 'csv-loader',
          options: {
            header: true,
            dynamicTyping: true,
            delimiter: '\t',
            skipEmptyLines: true
          }
        },
      ],
    })
    return config
  },
}

module.exports = nextConfig
