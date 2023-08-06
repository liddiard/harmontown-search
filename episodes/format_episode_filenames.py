'''Rename episodes like "1.mp3" to "001 2012-07-04 Achieve Weightlessness.mp3"
'''
import csv
import subprocess
import argparse


parser = argparse.ArgumentParser()
parser.add_argument('-d', '--dry-run', action=argparse.BooleanOptionalAction,
                    help='Print mv commands without actually running')
args = parser.parse_args()

def find_ep_by_number(number, ext):
    return subprocess.check_output(
        ['find', '.', '-name', f'{number}.{ext}']
    ).decode('utf-8').strip()

def rename_ep(ep, file_path, ext):
    date_stamp = ep['record_date'] or ep['release_date'] 
    filename = f"{ep['number'].zfill(3)} {date_stamp} {ep['title']}"
    if args.dry_run:
        print(f'mv {file_path} "{filename}.{ext}"')
    else:
        subprocess.call([
            'mv', file_path, f'{filename}.{ext}'
        ])    

def rename_eps(ep_file_path):
    with open(ep_file_path, 'r') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for ep in reader:
            episode_number = int(ep['number'])
            ext = 'mp4' if ep['video_link'] else 'mp3'
            file_path = find_ep_by_number(episode_number, ext)
            if not file_path:
                print(f'No file found for episode {episode_number}.{ext}')
                continue
            rename_ep(ep, file_path, ext)

rename_eps('episode_list.tsv')