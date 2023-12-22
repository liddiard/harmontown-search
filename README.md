# 🎤 Harmontown podcast search

Suite of scripts to download, transcribe, and search-index episodes of Harmontown, along with a [web application](https://harmonsearch.com) to search and play the episodes.

Background: [_Harmontown_](https://en.wikipedia.org/wiki/Harmontown) was a 2012–2019 podcast hosted by Dan Harmon, creator of _Community_ and _Rick and Morty_. Through its 360-episode run as a live show in Los Angeles, often featuring celebrity guests, the podcast gained a loyal fanbase and was profiled in an eponymous [documentary](https://www.imdb.com/title/tt3518988/).

See the [About page](https://harmonsearch.com/about/) for more on the motivation behind building this.

## Structure

See READMEs in each directory listed below for more details.

### [`episodes/`](/episodes)

Tools for downloading and renaming audio and video files from the podcast. Required for local transcription and media hosting in development on the frontend web application.

### [`transcripts/`](/transcripts)

Tools for transcribing downloaded episodes and uploading transcripts to a [Typesense](https://typesense.org/) server for indexing and search.

### [`frontend/`](/frontend)

A Next.js + TypeScript web application for searching and listening to and watching the episodes. Intended for [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) and hosting on a cloud object storage service like [Amazon S3](https://aws.amazon.com/s3/).