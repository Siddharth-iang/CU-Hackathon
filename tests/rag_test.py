import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from shield.rag import make_collection, build_index, retrieve, load_quotes_from_disk

# 1. Load all vendor quotations from data/quotes/
docs = load_quotes_from_disk("data/quotes")

# 2. Initialize ChromaDB vector store collection
col = make_collection()

# 3. Index/embed the documents into ChromaDB
build_index(col, docs)

# 4. Query the index for the cheapest vendor
results = retrieve(col, "Unit Price of Quote Vendor A", k=5)

# 5. Display the retrieved chunks and their source vendor files
for item in results:
    print(f"Source: {item['source']}")
    print(f"Content:\n{item['text']}")
    print("-" * 50)
