This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It uses [TypeScript](https://www.typescriptlang.org/), the Next.js [App Router](https://nextjs.org/docs/app), and is intended for [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports).

## Prerequisites

For local development, this project requires:

- Episodes downloaded locally (see [Episodes readme](/episodes))
- Transcripts: You can use the existing ones in the repo or [create your own](/transcripts)
- Node.js 18+ and npm 9+ installed
- Dependencies installed with `npm install` (or equivalent on other package managers)
- [Typesense](https://typesense.org/):
  - A server setup and running with a transcripts search index ("collection") (see [Transcripts readme](/transcripts))
  - A scoped API key so the frontend can query the Typesense server:
    - Create a key with read-only access to the "transcripts" collection ([docs](https://typesense.org/docs/0.25.1/api/api-keys.html#create-an-api-key)).
    - From this directory, run `API_KEY=<read-only key> ./generate_scoped_search_key.sh`, replacing `<read-only key>` with the key created in the previous step.
    - In [`app/keys.ts`](/frontend/app/types.ts), replace the `TYPESENSE.DEV` value with the "scoped" key generated in the previous step.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the homepage.

## Build

To generate static files for hosting, run:

```bash
npm run build
```

## Deploy to Amazon S3

**Prerequisites:** 

- [AWS command line tools installed](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- S3 bucket created
- `deploy.sh` script modified to use your bucket name
- [AWS CLI configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) with read/write credentials for your bucket

```bash
npm run deploy
```

## Next.js resources

To learn more about Next.js, take a look at the following:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.