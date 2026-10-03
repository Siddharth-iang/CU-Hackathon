import chromadb
from typing import List, Dict, Any, Optional

def make_collection(persistent_path: Optional[str] = None):
    """Create or get ChromaDB collection for vendor quotation retrieval."""
    if persistent_path:
        client = chromadb.PersistentClient(path=persistent_path)
    else:
        client = chromadb.EphemeralClient()
    return client.get_or_create_collection("quotes")

def split(text: str, size: int = 600) -> List[str]:
    """Split text into uniform chunks."""
    return [text[i:i + size] for i in range(0, len(text), size)] or [""]

def build_index(col, docs: Dict[str, str]):
    """Index dictionary of documents into ChromaDB collection."""
    ids, texts, metas = [], [], []
    for name, text in docs.items():
        for i, chunk in enumerate(split(text, 600)):
            ids.append(f"{name}:{i}")
            texts.append(chunk)
            metas.append({"source": name})
    if ids:
        col.upsert(ids=ids, documents=texts, metadatas=metas)

def retrieve(col, query: str, k: int = 4) -> List[Dict[str, str]]:
    """Retrieve relevant chunks for a given query."""
    r = col.query(query_texts=[query], n_results=k)
    if not r or not r.get("documents") or not r["documents"][0]:
        return []
    return [
        {"text": d, "source": m["source"]}
        for d, m in zip(r["documents"][0], r["metadatas"][0])
    ]

def load_quotes_from_disk(quotes_dir: str = "data/quotes") -> Dict[str, str]:
    """Load all quotation markdown files from disk directory."""
    import os
    docs = {}
    if os.path.exists(quotes_dir):
        for filename in os.listdir(quotes_dir):
            if filename.endswith(".md"):
                path = os.path.join(quotes_dir, filename)
                with open(path, encoding="utf-8") as f:
                    docs[filename] = f.read()
    return docs

