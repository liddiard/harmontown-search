import csv
import subprocess


EPISODES_DIR = 'episodes'

def find_ep_by_date(record_date):
    return subprocess.check_output(
        ['find', EPISODES_DIR, '-name', f'*{record_date}*.mp4']
    ).decode('utf-8').strip()

def rename_ep(record_date, number):
    file_path = find_ep_by_date(record_date)
    if not file_path:
        print(f'No episode {number} found with record date {record_date}')
        return
    # print(f"mv '{file_path}' {EPISODES_DIR}/{number}.mp4")
    return subprocess.call([
        'mv', file_path, f'{EPISODES_DIR}/{number}.mp4'
    ])
    

def rename_eps(ep_file_path):
    with open(ep_file_path, 'r') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for ep in reader:
            record_date = ep['record_date']
            if record_date:
                rename_ep(ep['record_date'], ep['number'])
                find_ep_by_date(record_date)

rename_eps('episode_list.tsv')