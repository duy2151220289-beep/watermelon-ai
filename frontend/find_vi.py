import os, re
import sys

def main():
    p = re.compile(r'[\u0100-\u017F]')
    output_lines = []
    
    for r, _, fs in os.walk('src'):
        for f in fs:
            if f.endswith(('.js', '.jsx', '.html', '.css')):
                filepath = os.path.join(r, f)
                try:
                    with open(filepath, 'r', encoding='utf-8') as file:
                        for i, line in enumerate(file, 1):
                            if p.search(line):
                                output_lines.append(f"{filepath}:{i}: {line.strip()}")
                except Exception as e:
                    pass
                    
    with open('remaining_vi.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_lines))

if __name__ == '__main__':
    main()
