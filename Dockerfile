FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m app && chown -R app /app
USER app

# Warm up the embedding model at build time so the first request is not slow
RUN python -c "import chromadb; c=chromadb.EphemeralClient().create_collection('w'); c.add(ids=['1'], documents=['warm up'])"

EXPOSE 8501 8000

CMD ["streamlit", "run", "ui/app.py", "--server.port=8501", "--server.address=0.0.0.0"]
