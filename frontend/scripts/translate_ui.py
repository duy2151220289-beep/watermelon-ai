import os
import json
import re

# Paths
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC_DIR = os.path.join(PROJECT_ROOT, 'src')
MAP_PATH = os.path.join(SRC_DIR, 'translation_map.json')

# Load translation map
with open(MAP_PATH, 'r', encoding='utf-8') as f:
    translation_map = json.load(f)

# Compile regex patterns for each key (escape special chars)
patterns = {re.escape(k): v for k, v in translation_map.items()}
combined_regex = re.compile('|'.join(patterns.keys()))

# File extensions to process
EXTENSIONS = {'.js', '.jsx', '.ts', '.tsx', '.html', '.css'}

def replace_text(content: str) -> str:
    def repl(match):
        key = match.group(0)
        return patterns[re.escape(key)]
    return combined_regex.sub(repl, content)

changed_files = []
for root, _, files in os.walk(SRC_DIR):
    for fname in files:
        _, ext = os.path.splitext(fname)
        if ext.lower() in EXTENSIONS:
            fpath = os.path.join(root, fname)
            with open(fpath, 'r', encoding='utf-8') as f:
                original = f.read()
            new_content = replace_text(original)
            if new_content != original:
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                changed_files.append(os.path.relpath(fpath, PROJECT_ROOT))

print('Translation complete. Modified files:')
for cf in changed_files:
    print(' -', cf)
