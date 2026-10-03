import json
import os
import sqlite3
from typing import Optional
from shield.models import AuditEvent

class AuditLogger:
    """Audit logger writing structured JSONL and SQLite events."""
    def __init__(self, jsonl_path: str = "storage/audit.jsonl", db_path: str = "storage/runs.db"):
        self.jsonl_path = jsonl_path
        self.db_path = db_path
        os.makedirs(os.path.dirname(self.jsonl_path), exist_ok=True)
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS runs (
                    run_id TEXT PRIMARY KEY,
                    started_at TEXT,
                    mode TEXT,
                    item_id TEXT,
                    kind TEXT,
                    hijacked INTEGER,
                    task_ok INTEGER,
                    latency_ms REAL,
                    details TEXT
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS eval_summary (
                    eval_id TEXT PRIMARY KEY,
                    created_at TEXT,
                    split TEXT,
                    metric TEXT,
                    value REAL
                )
            """)
            conn.commit()

    def log_event(self, event: AuditEvent):
        """Append an AuditEvent to the JSONL log file."""
        data = event.model_dump()
        # Truncate evidence if too long
        if data.get("evidence") and len(data["evidence"]) > 200:
            data["evidence"] = data["evidence"][:197] + "..."
            
        with open(self.jsonl_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(data) + "\n")
