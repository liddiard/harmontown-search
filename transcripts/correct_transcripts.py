'''Find and replace known incorrect transcriptions (defined in
transcription_corrections.tsv), and remove empty lines. Save corrected
transcripts to new files.
'''
import os
import csv
import re


SOURCE_DIR = 'original'
TARGET_DIR = 'corrected'

transcripts = os.listdir(SOURCE_DIR)
corrections = []

# correct a transcript given by the input file handle and write it to the
# output file handle
def correct_transcript(infile, outfile):
    transcript = csv.DictReader(infile, delimiter='\t')
    # writer will default to DOS-style line terminators (CRLF) unless
    # `lineterminator` is specified as LF only (Unix-style)
    writer = csv.writer(outfile, delimiter='\t', lineterminator='\n')
    # write header row (same as source)
    writer.writerow(['start', 'end', 'text'])
    for line in transcript:
        correct_line(line, writer)

# given a line of a transcript and a CSV writer, apply find/replace
# corrections to the line's `text` column and write it to the target file
def correct_line(line, writer):
    text = line['text']
    # sometimes Whisper will produce empty lines – remove them
    if not text:
        return
    for correction in corrections:
        text = re.sub(
            correction['find'],
            correction['replace'],
            text
        )
    writer.writerow([line['start'], line['end'], text])

# populate the array of "corrections" to apply
with open("transcription_corrections.tsv", 'r') as f:
    reader = csv.DictReader(f, delimiter='\t')
    for row in reader:
        corrections.append(row)

# process transcripts
for transcript_file in transcripts:
    print(f"Processing: {transcript_file}")
    with (open(f"{SOURCE_DIR}/{transcript_file}", 'r') as infile,
          open(f"{TARGET_DIR}/{transcript_file}", 'w') as outfile):
        correct_transcript(infile, outfile)

print(f"🟢 Completed without errors")