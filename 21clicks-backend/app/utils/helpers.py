"""
Generic text helpers, independent of the database, used mainly for
repetition detection and lightweight validation of AI output.
"""

import difflib
import re


def normalize_text(text: str) -> str:
    """Lowercase and strip punctuation/whitespace so comparisons ignore formatting noise."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text


def word_count(text: str) -> int:
    return len(text.split())


def is_similar(text_a: str, text_b: str, threshold: float = 0.85) -> bool:
    """True if two strings are effectively the same option (exact match or close fuzzy match)."""
    norm_a, norm_b = normalize_text(text_a), normalize_text(text_b)
    if norm_a == norm_b:
        return True
    ratio = difflib.SequenceMatcher(None, norm_a, norm_b).ratio()
    return ratio >= threshold


def find_duplicates(new_options: list[str], existing_texts: list[str], threshold: float = 0.85) -> list[str]:
    """Return the subset of new_options that duplicate something already stored."""
    return [opt for opt in new_options if any(is_similar(opt, existing, threshold) for existing in existing_texts)]


def has_internal_duplicates(options: list[str], threshold: float = 0.85) -> bool:
    """True if any two options within the same freshly-generated batch resemble each other."""
    for i in range(len(options)):
        for j in range(i + 1, len(options)):
            if is_similar(options[i], options[j], threshold):
                return True
    return False
