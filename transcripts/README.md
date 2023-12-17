# Transcription tools

**Prerequisite** to using the scripts in this directory is donwloading the episodes by following the instructions in `episodes/README.md`.

## Transcribe episodes

After downloading episodes, you can transcripts by running `./transcribe_episodes.sh`.

Example usage:
```bash
./transcribe_episodes.sh -e 1 # start transcribing episode 1
```

## Fix transcription issues

`transcription_corrections.tsv` holds a list of regex patterns to `find` on every line of every transcript and replace with the target `replace` string.

Fix transcription defined in this file by running `python3 correct_transcripts.py`.

## Upload transcript search index

**Prerequisite:** This project uses [Typesense](https://typesense.org/) as its search indexing provider. [Follow the instrunctions](https://typesense.org/docs/guide/install-typesense.html) to install and start Typesense on your development machine or server. Make sure you [configure an API key and data directory](https://typesense.org/docs/0.25.1/api/server-configuration.html#using-command-line-arguments).

Upload transcripts for Typesense to index by running `python3 index_transcripts.py`.

Example usage:
```bash
python3 index_transcripts.py -k '<Typesense API key>' -e dev # upload transcriptions to the local development Typesense server
```

## Note

For initial transcription, Whisper [v20230314](https://github.com/openai/whisper/releases/tag/v20230314) was used through transcription of episode 281. Following episodes were transcribed using [v20230918](https://github.com/openai/whisper/releases/tag/v20230918).
