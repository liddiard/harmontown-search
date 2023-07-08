#!/bin/bash

# Check if the "-e" flag was passed
if [[ ! $1 == "-e" ]]; then
  echo "Error: -e [episode_number_to_start_with] is required."
  exit 1
fi

# Get the value of the "-e" flag
start_episode=$2
final_episode=361

for ((ep=$start_episode; ep<=$final_episode; ep++)); do
  echo "🎤 Starting transcription of episode: $ep"
  whisper --model small.en --output_dir transcripts --output_format tsv episodes/"$ep".mp3
  echo "✅ Finished transcription of episode: $ep"
done

# Print the value of the "-e" flag
