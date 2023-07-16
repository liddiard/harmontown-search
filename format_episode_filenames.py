'''Rename episodes like "episodes/1.mp3" to
"episodes/001 2012-07-04 Achieve Weightlessness"
'''
import csv
import subprocess


EPISODES_DIR = 'episodes'

def find_ep_by_number(number, ext):
    return subprocess.check_output(
        ['find', EPISODES_DIR, '-name', f'{number}.{ext}']
    ).decode('utf-8').strip()

def rename_ep(ep, file_path, ext):
    date_stamp = ep['record_date'] or ep['release_date'] 
    filename = f"{ep['number'].zfill(3)} {date_stamp} {ep['title']}"
    print(f"mv {file_path} {EPISODES_DIR}/{filename}.{ext}")
    # subprocess.call([
    #     'mv', file_path, f'{EPISODES_DIR}/{filename}.{ext}'
    # ])    

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