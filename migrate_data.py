import json
import os
import re

def sanitize_filename(name):
    # Remove invalid characters for filenames
    s = re.sub(r'[\\/*?:"<>|]', "", name)
    # Replace spaces with underscores
    s = s.replace(" ", "_")
    return s

def migrate_friends():
    src_path = 'src/data/friends.json'
    if not os.path.exists(src_path):
        print(f"{src_path} not found")
        return

    with open(src_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    dest_dir = 'src/data/friends'
    os.makedirs(dest_dir, exist_ok=True)
    
    for i, friend in enumerate(data.get('friends', [])):
        # Create a filename: Name.json
        filename = f"{sanitize_filename(friend['name'])}.json"
        file_path = os.path.join(dest_dir, filename)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(friend, f, ensure_ascii=False, indent=2)
    
    print(f"Migrated {len(data.get('friends', []))} friends to {dest_dir}")

def migrate_sponsors():
    src_path = 'src/data/sponsors.json'
    if not os.path.exists(src_path):
        print(f"{src_path} not found")
        return

    with open(src_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    dest_dir = 'src/data/sponsors'
    os.makedirs(dest_dir, exist_ok=True)
    
    for i, sponsor in enumerate(data.get('sponsors', [])):
        filename = f"{sanitize_filename(sponsor['name'])}.json"
        file_path = os.path.join(dest_dir, filename)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(sponsor, f, ensure_ascii=False, indent=2)
            
    print(f"Migrated {len(data.get('sponsors', []))} sponsors to {dest_dir}")

if __name__ == "__main__":
    migrate_friends()
    migrate_sponsors()
