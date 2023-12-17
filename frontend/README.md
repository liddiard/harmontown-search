This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!