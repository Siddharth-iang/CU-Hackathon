"""Assert-based test checking zero emojis across dashboard code and font control configuration."""
import os
import re

EMOJI_REGEX = re.compile(
    r"[\U0001F300-\U0001F9FF\U00002600-\U000026FF\U00002700-\U000027BF"
    r"\U0001F1E6-\U0001F1FF\U0001F600-\U0001F64F\U0001F680-\U0001F6FF]"
)

def test_no_emojis_in_core_and_app():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    targets = [
        os.path.join(root, "app.py"),
        os.path.join(root, "core", "benchmark.py"),
        os.path.join(root, "core", "reporting.py"),
        os.path.join(root, "core", "simulation.py"),
        os.path.join(root, "core", "replay.py"),
        os.path.join(root, "shield", "agent.py"),
        os.path.join(root, "shield", "service.py"),
    ]
    for path in targets:
        assert os.path.exists(path), f"File {path} must exist"
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            matches = EMOJI_REGEX.findall(content)
            assert len(matches) == 0, f"Found {len(matches)} emojis in {path}: {matches[:5]}"

def test_font_resizing_implemented():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    app_py = os.path.join(root, "app.py")
    with open(app_py, "r", encoding="utf-8") as f:
        content = f.read()
        assert "dashboard_font_control" in content, "Font control state missing from app.py"
        assert '["A-", "A", "A+"]' in content or "['A-', 'A', 'A+']" in content, "Font size options missing from app.py"

    header_tsx = os.path.join(root, "frontend", "src", "components", "Header.tsx")
    with open(header_tsx, "r", encoding="utf-8") as f:
        content = f.read()
        assert "sentinel_font_size" in content, "Font size persistence missing from Header.tsx"
        assert "A-" in content and "A+" in content, "Font size controls missing from Header.tsx"

def test_no_unnecessary_topbar_labels():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    app_py = os.path.join(root, "app.py")
    with open(app_py, "r", encoding="utf-8") as f:
        content = f.read()
        assert "PROD-US-EAST" not in content, "PROD-US-EAST still in app.py"
        assert "SEC-OPS" not in content, "SEC-OPS still in app.py"
        assert "L3 Engineer" not in content, "L3 Engineer still in app.py"
        assert "RAG-FinOps-v3" not in content, "RAG-FinOps-v3 still in app.py"

    header_tsx = os.path.join(root, "frontend", "src", "components", "Header.tsx")
    with open(header_tsx, "r", encoding="utf-8") as f:
        content = f.read()
        assert "PROD-US-EAST" not in content, "PROD-US-EAST still in Header.tsx"
        assert "RAG-FinOps-v3" not in content, "RAG-FinOps-v3 still in Header.tsx"

if __name__ == "__main__":
    test_no_emojis_in_core_and_app()
    test_font_resizing_implemented()
    test_no_unnecessary_topbar_labels()
    print("[OK] UI cleanliness, font resizing, and unneeded label removal assertions passed.")

