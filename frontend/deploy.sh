#!/bin/bash

BASE_DIR=$(pwd)

echo "Temporarily unlinking 'episodes' directory symlink"
unlink "$BASE_DIR/public/episodes"
react-scripts build
aws s3 sync build/ s3://harmontownsearch.com/ --acl public-read
ln -s "$BASE_DIR/../episodes/" "$BASE_DIR/public"
echo "Relinked 'episodes' directory symlink"