'''Upload all epsiode transcripts (generated using transcribe_episodes.sh) to
Typesense server.
'''
import os
import sys
import csv
import re
import argparse

import typesense


DEV = 'dev'
PROD = 'prod'
CONFIG = {
    DEV: {
        'host': 'localhost',
        'port': '8108',
        'protocol': 'http'
    },
    PROD: {
        'host': 'api.harmontown-search.harrisonliddiard.com',
        'port': '443',
        'protocol': 'https'
    }
}
COLLECTION_NAME = 'transcripts'

parser = argparse.ArgumentParser()
parser.add_argument('-k', '--api-key', type=str, required=True, 
                    help='Typesense API key')
parser.add_argument('-e', '--env', type=str, required=True,
                    choices=[DEV, PROD],
                    help='Typesense client environment')
parser.add_argument('-d', '--drop-existing',
                    action=argparse.BooleanOptionalAction,
                    help='Drop existing collection')
args = parser.parse_args()

if args.drop_existing:
    proceed = input("Warning: Running with -d will drop the existing" 
                    "'transcripts' index and result in downtime. Are you "
                    "sure you want to proceed? [y/N]: ")
    if proceed not in ['y', 'Y', 'yes', 'Yes', 'YES']:
        sys.exit()

# https://typesense.org/docs/0.24.1/api/collections.html#field-types
# https://typesense.org/docs/0.24.1/api/search.html#facet-results
transcripts_schema = {
    'name': COLLECTION_NAME,
    'fields': [
        {'name': 'episode', 'type': 'int32', 'facet': True},
        {'name': 'text', 'type': 'string'},
        {'name': 'start', 'type': 'int32', 'index': False, 'optional': True},
        {'name': 'end', 'type': 'int32', 'index': False, 'optional': True}
    ]
}

# Resources:
# - https://typesense.org/docs/guide/building-a-search-application.html
# - https://typesense.org/docs/0.24.1/api/collections.html
client = typesense.Client({
  'nodes': [CONFIG[DEV] if args.env == DEV else CONFIG[PROD]],
  'api_key': args.api_key,
  # From docs: IMPORTANT: Be sure to increase connection_timeout_seconds to
  # at least 5 minutes or more for imports, when instantiating the client
  'connection_timeout_seconds': 5 * 60
})

if args.drop_existing:
    try:
        client.collections[COLLECTION_NAME].delete()
        print(f"Deleted existing collection: {COLLECTION_NAME}")
    except typesense.exceptions.ObjectNotFound:
        print(f"Existing collection '{COLLECTION_NAME}' not found.")

try:
    client.collections.create(transcripts_schema)
    print(f"Created collection: {COLLECTION_NAME}")
except typesense.exceptions.ObjectAlreadyExists:
    print(f"Collection '{COLLECTION_NAME}' already exists.")

transcripts = os.listdir("corrected")

errors = False
for transcript_file in transcripts:
    episode = re.search(r"(\d+)\.tsv", transcript_file).group(1)
    transcript = []
    print(f"⬆️  Starting upload for episode: {episode}")
    with open(transcript_file, 'r') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for row in reader:
            transcript.append({
                'id': f"{episode}_{row['start']}",
                'text': row['text'],
                'episode': int(episode),
                'start': int(row['start']),
                'end': int(row['end'])
            })
    res = client.collections[COLLECTION_NAME].documents.import_(
        transcript,
        {'action': 'upsert'}
    )
    for upload in res:
        if upload['success'] is False:
            errors = True
            print(f'❗️ {upload}')
    print(f"✅ Finished upload for episode: {episode}")

if errors:
    print(f"🔴 Completed with errors – see above")
else:
    print(f"🟢 Completed without errors")