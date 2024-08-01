from pytube import Playlist
import json
import sys
import time
import os

PROGRESS_FILE = 'progress.txt'

def write_progress(progress):
    with open(PROGRESS_FILE, 'w') as f:
        f.write(json.dumps(progress))

def scrape_youtube_playlist(playlist_url):
    try:
        playlist = Playlist(playlist_url)
        total_videos = len(playlist.videos)
        videos = []
        progress = {
            "completed": 0,
            "total": total_videos
        }

        write_progress(progress)
        
        for video in playlist.videos:
            video_data = {
                "title": video.title,
                "postDate": video.publish_date.isoformat(),
                "description": video.description,
                "videoLink": video.watch_url,
                "iframe": video.embed_url,
                "thumbnailImageLink": video.thumbnail_url,
                "length": video.length
            }
            videos.append(video_data)

            progress["completed"] += 1
            write_progress(progress)
            time.sleep(1)  # Simulate time delay
        
        course_data = {
            "title": playlist.title,
            "channelName": playlist.owner,
            "authorName": playlist.owner,
            "numberOfVideos": len(videos),
            "totalDuration": sum(video['length'] for video in videos),
            "source": "YouTube",
            "videos": videos
        }

        return json.dumps(course_data)

    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    url = sys.argv[1]
    if 'playlist' in url:
        print(scrape_youtube_playlist(url))
    else:
        print(json.dumps({"error": "Unsupported URL"}))
