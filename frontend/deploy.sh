#!/bin/bash

BASE_DIR=$(pwd)
PARENT_DIR="$(dirname "$BASE_DIR")"

echo "⚠️  Temporarily unlinking 'episodes' directory symlink"
unlink "$BASE_DIR/public/episodes"

echo "ℹ️  Starting Next.js build"
npm run build
echo "✅ Completed Next.js build"

echo "ℹ️  Starting AWS S3 sync"
aws s3 sync out/ s3://harmonsearch.com/ --acl public-read
echo "✅ Completed AWS S3 sync"

echo "ℹ️  Starting Cloudflare R2 episode sync"
aws s3 sync "../episodes/" s3://harmontown-search --endpoint-url https://d432bc56e0e5d0cbd06f01f01e42883d.r2.cloudflarestorage.com --exclude "*" --include "*.mp3" --profile=cloudflare-r2
echo "✅ Completed Cloudflare R2 episode sync"

ln -s ../../episodes/ "$BASE_DIR/public"
echo "✅ Relinked 'episodes' directory symlink"