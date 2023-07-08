import argparse
import csv
import json
import requests
from requests.auth import HTTPBasicAuth

# Replace these with your AWS OpenSearch configuration
opensearch_url = 'https://search-harmontown-search-d6bady5oo7usrqpl5b4kirsuha.us-west-1.es.amazonaws.com'
index_name = 'transcripts'

parser = argparse.ArgumentParser()
parser.add_argument('-u', '--username', type=str, required=True, 
                    help='AWS username')
parser.add_argument('-p', '--password', type=str, required=True, 
                    help='AWS password')
parser.add_argument('-e', '--episode', type=int, required=True, 
                    help='Episode number')
parser.add_argument(
  'transcript_file',
  help='Episode transcript file in .tsv format output by Whisper'
)
args = parser.parse_args()

if args.transcript_file is None:
    raise TypeError('Missing required argument [transcript_file]')

episode = args.episode
transcript = []
with open(args.transcript_file, 'r') as f:
    reader = csv.DictReader(f, delimiter='\t')
    for row in reader:
        transcript.append({
            'episode': episode,
            'start': int(row['start']) // 1000,
            'end': int(row['end']) // 1000,
            'text': row['text']
        })

bulk_data = ''
for line in transcript:
    # Create the index metadata for this document
    index_metadata = {
        'index': {
            '_index': index_name,
            '_id': f"{episode}_{line['start']}"  # Optionally, provide a unique id for each document
        }
    }
    bulk_data += json.dumps(index_metadata) + '\n' + json.dumps(line) + '\n'

headers = {
    'Content-Type': 'application/x-ndjson',  # Bulk API requires newline-delimited JSON
    'Accept': 'application/json'
}

response = requests.post(f'{opensearch_url}/_bulk',
                         auth=HTTPBasicAuth(args.username, args.password),
                         headers=headers,
                         data=bulk_data)

# # Print the response from AWS OpenSearch
print(response.json())
