import base64
import re
import codecs
import unicodedata
from typing import List

ZW_BITS = {"\u200b": "0", "\u200c": "1"}  # zero-width space / non-joiner
ZW_ALL = dict.fromkeys(map(ord, "\u200b\u200c\u200d\u2060\ufeff"))

def printable_ratio(s: str) -> float:
    """Calculate the ratio of printable/space characters in string s."""
    if not s:
        return 0.0
    return sum(ch.isprintable() or ch.isspace() for ch in s) / len(s)

def zero_width_text(raw: str):
    """Extract zero-width binary encoded characters if present."""
    bits = "".join(ZW_BITS[c] for c in raw if c in ZW_BITS)
    if len(bits) < 16:
        return None
    try:
        data = bytes(int(bits[i:i + 8], 2) for i in range(0, len(bits) - 7, 8))
        s = data.decode("utf-8", errors="ignore")
        return s if printable_ratio(s) > 0.9 else None
    except Exception:
        return None

def normalise(raw: str) -> str:
    """Normalize unicode characters and remove zero-width spaces."""
    return unicodedata.normalize("NFKC", raw).translate(ZW_ALL)

def views(raw: str, depth: int = 0) -> List[str]:
    """Return the normalized raw text plus every decoded version of it (max depth 3)."""
    if raw is None:
        return [""]
    # ponytail: Truncating raw input at 250KB protects against memory exhaustion and ReDoS on edge-case inputs.
    if len(raw) > 250_000:
        raw = raw[:250_000]

    out = [normalise(raw)]
    if depth >= 3:
        return out
        
    hidden = zero_width_text(raw)
    if hidden:
        out += views(hidden, depth + 1)
        
    text = out[0]
    # Check base64 pattern (limit to first 25 candidate chunks per depth)
    for m in re.findall(r"[A-Za-z0-9+/]{24,}={0,2}", text)[:25]:
        try:
            d = base64.b64decode(m, validate=True).decode("utf-8")
            if printable_ratio(d) > 0.9:
                out += views(d, depth + 1)
        except Exception:
            pass
            
    # Check hex pattern (limit to first 25 candidate chunks per depth)
    for m in re.findall(r"(?:[0-9a-fA-F]{2}){12,}", text)[:25]:
        try:
            d = bytes.fromhex(m).decode("utf-8")
            if printable_ratio(d) > 0.9:
                out += views(d, depth + 1)
        except Exception:
            pass
            
    # ROT13 view
    try:
        out.append(codecs.decode(text, "rot13"))
    except Exception:
        pass
        
    return out
