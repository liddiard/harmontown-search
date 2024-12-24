# Transcription tools

## Prerequisites

To make use of the scripts in this directory, you first need to download the podcast episodes by following the instructions in the [Episode tools readme](/episodes/README.md). Additionally, you should have:

- Python 3.9+ installed
- Packages listed in `requirements.txt` installed

## Transcribe episodes

After downloading episodes, you can create episode transcriptions by running `./transcribe_episodes.sh`.

**Prerequisite:** OpenAI's Whisper command line interface [must be installed](https://github.com/openai/whisper?tab=readme-ov-file#setup).

Example usage:

```bash
./transcribe_episodes.sh -e 1 # start transcribing from episode 1
```

## Fix transcription issues

`transcription_corrections.tsv` holds a list of regex patterns to `find` on every line of every transcript and replace with the target `replace` string.

Fix transcriptions per this file's find/replace criteria by running `python3 correct_transcripts.py`.

## Upload transcript search index

**Prerequisite:** This project uses [Typesense](https://typesense.org/) as its search indexing provider. To start the Typesense server, follow the instructions in the [server readme](/server/README.md).

Upload transcripts for Typesense to index by running `python3 index_transcripts.py`.

Example usage:

```bash
python3 index_transcripts.py -k '<Typesense API key>' -e dev # upload transcriptions to the local development Typesense server
```

## Note

For initial transcription, Whisper [v20230314](https://github.com/openai/whisper/releases/tag/v20230314) was used through transcription of episode 281. Following episodes were transcribed using [v20230918](https://github.com/openai/whisper/releases/tag/v20230918).
