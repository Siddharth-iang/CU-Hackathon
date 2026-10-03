import json
import os
import sqlite3
from typing import Optional, List, Dict, Any
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

    def log_run(
        self,
        run_id: str,
        started_at: str,
        mode: str,
        item_id: str,
        kind: str,
        hijacked: bool,
        task_ok: bool,
        latency_ms: float,
        details: Dict[str, Any]
    ):
        """Record run summary into SQLite runs table."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                INSERT OR REPLACE INTO runs (
                    run_id, started_at, mode, item_id, kind, hijacked, task_ok, latency_ms, details
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                run_id,
                started_at,
                mode,
                item_id,
                kind,
                1 if hijacked else 0,
                1 if task_ok else 0,
                latency_ms,
                json.dumps(details)
            ))
            conn.commit()

    def get_recent_events(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Read recent events from JSONL log."""
        if not os.path.exists(self.jsonl_path):
            return []
        events = []
        with open(self.jsonl_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        events.append(json.loads(line))
                    except Exception:
                        pass
        return events[-limit:]
