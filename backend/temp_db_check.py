import sqlite3
from pathlib import Path

db = Path("db.sqlite3")
print("db exists", db.exists())
if db.exists():
    con = sqlite3.connect(str(db))
    cur = con.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    rows = cur.fetchall()
    print("tables", rows)
    con.close()
