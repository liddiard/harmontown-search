# 🎤 Harmontown podcast search

Suite of scripts to download, transcribe, and search-index episodes of Harmontown, along with a [frontend web application]() to search and play the episodes.

Harmontown was a 2012–2019 podcast hosted by Dan Harmon, creator of _Community_ and _Rick and Morty_. Through its 360-episode run as a live show in Los Angeles, which frequently featured celebrity guests, the podcast gained a loyal fanbase and was profiled in a documentary of the same name.

See the [About page]() for more on the motivation behind building this.

## Structure

### `episodes/`

Tools for downloading and renaming audio and video files from the podcast. Required for transcription and local media hosting on the frontend web application.

### `trascripts/`

Tools for transcribing downloaded episodes and uploading transcripts to a Typesense server for search indexing.

### `frontend/`

A Next.js + TypeScript web application for searching and listening to and watching the episodes. Intended for [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) and hosting on a service like [Amazon S3](https://aws.amazon.com/s3/).