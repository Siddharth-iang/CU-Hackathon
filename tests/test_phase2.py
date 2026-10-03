import os
import sqlite3
import pytest
from shield.rag import make_collection, build_index, retrieve, load_quotes_from_disk
from shield.audit import AuditLogger
from shield.models import AuditEvent

def test_quotation_corpus_exists():
    quotes = load_quotes_from_disk("data/quotes")
    assert len(quotes) >= 10, f"Expected at least 10 vendor quotes, found {len(quotes)}"
    assert "quote_vendor_B.md" in quotes
    assert "8,900" in quotes["quote_vendor_B.md"] or "8900" in quotes["quote_vendor_B.md"]

def test_confidential_canaries_exist():
    salary_path = "data/confidential/salary.csv"
    keys_path = "data/confidential/api_keys.txt"
    assert os.path.exists(salary_path), "salary.csv missing"
    assert os.path.exists(keys_path), "api_keys.txt missing"

    with open(salary_path, encoding="utf-8") as f:
        salary_content = f.read()
    with open(keys_path, encoding="utf-8") as f:
        keys_content = f.read()

    assert "CANARY-7f3a9c" in salary_content, "Canary missing in salary.csv"
    assert "CANARY-b21d55" in keys_content, "Canary missing in api_keys.txt"

def test_chromadb_index_and_retrieval():
    docs = load_quotes_from_disk("data/quotes")
    col = make_collection()
    build_index(col, docs)

    results = retrieve(col, "which vendor is cheapest for server racks", k=4)
    assert len(results) > 0
    sources = [r["source"] for r in results]
    assert "quote_vendor_B.md" in sources or "quote_vendor_A.md" in sources

def test_sqlite_and_jsonl_storage(tmp_path):
    jsonl_file = str(tmp_path / "audit.jsonl")
    db_file = str(tmp_path / "runs.db")

    logger = AuditLogger(jsonl_path=jsonl_file, db_path=db_file)

    event = AuditEvent(
        ts="2026-10-03T12:00:00Z",
        run_id="test_run_1",
        layer="firewall",
        decision="CLEAN",
        rule="no_injection",
        reason="Clean text",
        evidence="Sample text"
    )
    logger.log_event(event)

    assert os.path.exists(jsonl_file)
    with open(jsonl_file, encoding="utf-8") as f:
        line = f.readline()
        assert "test_run_1" in line

    assert os.path.exists(db_file)
    with sqlite3.connect(db_file) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        assert "runs" in tables
        assert "eval_summary" in tables
