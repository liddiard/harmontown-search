#!/bin/bash

BASE_DIR=$(pwd)
PARENT_DIR="$(dirname "$BASE_DIR")"

echo "⚠️  Temporarily unlinking 'episodes' directory symlink"
unlink "$BASE_DIR/public/episodes"
next build
aws s3 sync out/ s3://harmonsearch.com/ --acl public-read
ln -s "../../episodes/" "$BASE_DIR/public"
echo "🟢 Relinked 'episodes' directory symlink"