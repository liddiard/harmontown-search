# Episode tools

## Download episodes

Populate this folder with all audio (mp3) and video (mp4) episodes using the `download_episodes.py` script.

Example usage: 
```bash
python3 download_episodes.py -e 1 # start with episode 1
```

## Format episode filenames

For archival purposes, you can make the episode filenames more descriptive by running `format_episode_filenames.py` script. It will rename episodes from their number-only format (e.g. `1.mp3`) to a format that includes, number, date, and title (e.g. `001 2012-07-04 Achieve Weightlessness.mp3`).

Example usage:
```bash
python3 format_episode_filenames.py -d # dry run – print how episodes will be renamed without actually renaming them
```

Note: The web application (`frontend/`) only understands episode filenames in the `1.mp3` format, so **don't run this script** if you're trying to do local development on the frontend.