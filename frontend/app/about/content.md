# About

_Come on down to Harmontown; turn that frown upside down._

There’s something special about this podcast. Like many Harmontown fans, I keep coming back to it. The mix of comedy, philosophy, roleplaying, and improv among an ensemble of complementary friends with the occasional celebrity (or niche Hollywood person) just hasn’t gotten old.

Back when the podcast ended in 2019, I wanted to transcribe all the episodes and make them searchable for us fans to easily find and revisit favorite moments. Problem was, there’s a lot of Harmontown, and high-quality transcription services _were_ pricey.

That changed in 2022 when OpenAI, the company behind ChatGPT, [released Whisper](https://openai.com/research/whisper). It’s open-source software you can run on your own computer that, in their words, “approaches human level robustness and accuracy on English speech recognition.” It’s not perfect, but it’s pretty darn good.

With the cost barrier overcome and a desire to create a new side project that I was passionate about, I built this site in the last few months of 2022. I hope you enjoy it.

## How it works (the nerd stuff)

Episodes have been transcribed using [OpenAI’s Whisper](https://github.com/openai/whisper) `small.en` model between July–November 2023. Minor [find-and-replace corrections](https://github.com/liddiard/harmontown-search/blob/main/transcripts/transcription_corrections.tsv) are made to the transcripts for common errors, such as “Harmontown” being transcribed as “Herman Town.”

The transcripts are uploaded to [Amazon S3](https://aws.amazon.com/s3/) in a structured data format ([TSV](<https://www.loc.gov/preservation/digital/formats/fdd/fdd000533.shtml#:~:text=A%20tab%2Dseparated%20values%20(TSV,line%20of%20the%20text%20file.)>) and indexed for search using [Typesense](https://typesense.org/), which is running on a [Google Compute Engine](https://cloud.google.com/compute) server. Typesense provides performant dialog matches via API when you search across all episodes.

The frontend is [React](https://react.dev/), running on a [static-export Next.js site](https://nextjs.org/docs/app/building-your-application/deploying/static-exports). When you visit the site, a list of all episode titles and other metadata is downloaded and indexed in browser using [Fuse.js](https://www.fusejs.io/), which returns near-instant episode search results for queries that match episode titles, descriptions, and numbers. Fuse is also used for searching individual transcripts while playing an episode.

Audio episodes are streamed from [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) because podcast providers use dynamic ad insertion which unpredictably shifts the syncronization between the audio and the corresponding transcript. Video episodes are streamed from YouTube, where a fan has [generously uploaded them](https://www.youtube.com/playlist?list=PLhnyTCcNcaceutNO3CeRSWGuMyqqsN1mO).

The code for this website plus the transcription and indexing process is open source and [available on GitHub](http://github.com/liddiard/harmontown-search).

<h2 id="thanks">Special thanks</h2>

Thank you to [@JonesyCat](https://www.youtube.com/channel/UCikicDkkqldNFwVEpI3SRuQ) for uploading all of the Harmontown video episodes to YouTube so that they live on after the closure of harmontown.com. Thanks also to [Zach Manson](https://zachmanson.com/) for giving me the heads up and recommendation to embed the Harmontown videos from this channel.

## Server costs

Here’s everything I’m paying to run this:

- [GCP hosting](https://cloud.google.com/?hl=en) for [Typesense search](https://typesense.org/) API (fast searches across the 6M+ words spoken during Harmontown): **~$2/month**
- Static file hosting for website (the web UI you’re reading this on): **~$1/month**
- Static file hosting for audio podcasts: **~$2/month**
- Domain name: **$1/month**

Total cost: **~$72/year**

I’m paying this out of pocket. If you get value and enjoyment from this site, consider throwing me a [few bucks if you can spare it](https://ko-fi.com/liddiard). I’d love to keep this archive online for as long as possible. Thank you.
