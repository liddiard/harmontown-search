#!/bin/bash
# Batch transcribe episodes using OpenAI's Whisper
# https://github.com/openai/whisper

if [[ ! $1 == "-e" ]]; then
  echo "Error: -e [episode_number_to_start_with] is required."
  exit 1
fi

# Get the value of the "-e" flag
start_episode=$2
final_episode=361

for ((ep=$start_episode; ep<=$final_episode; ep++)); do
  echo "🎤 Starting transcription of episode: $ep"
  source=$(find ../episodes -name "$ep.mp3" -o -name "$ep.mp4")
  whisper --model small.en --output_dir . --output_format tsv "$source"
  echo "✅ Finished transcription of episode: $ep"
done