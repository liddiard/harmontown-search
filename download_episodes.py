'''Download episodes of Harmontown in mp4 video if available, otherwise in mp3
'''
import csv
import requests
import argparse


parser = argparse.ArgumentParser()
parser.add_argument('-e', '--episode', type=int, required=True, 
                    help='Episode number to start with')
args = parser.parse_args()


def download_file(url, filename):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()

        with open(filename, 'wb') as fd:
            for chunk in response.iter_content(chunk_size=8192):
                fd.write(chunk)
    except requests.exceptions.RequestException as e:
        print(f"Failed to download {url}. Reason: {e}")
        return False
    return True

def download_eps(episode_list):
    with open(episode_list, 'r') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for ep in reader:
            episode_number = int(ep['number'])
            # skip downloading episodes that are before the "start episode"
            # argument passed to the script
            if episode_number < args.episode:
                print(f'Skipping download for episode: {episode_number}')
                continue

            video_link = ep['video_link']
            if video_link:
                url = video_link
                ext = 'mp4'
            else:
                url = ep['audio_link']
                ext = 'mp3'
            filename = f"episodes/{episode_number}.{ext}"

            print(f"⬇️  Downloading {url} to {filename}")
            success = download_file(url, filename)
            if success:
                print(f"✅ Downloaded episode: {episode_number}")
            else:
                print(f"⛔️ Failed to download episode: {episode_number}")

download_eps('episode_list.tsv')