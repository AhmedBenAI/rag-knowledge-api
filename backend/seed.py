"""
Seed the UK Employment Law knowledge base.
Run once from the backend/ directory:  python seed.py
Re-seed from scratch:                  python seed.py --force
"""
import argparse
import sys
from pathlib import Path

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(raise_error_if_not_found=False))

from ingest.chunker import chunk_text
from ingest.embed import embed_chunks
from ingest.loader import load_url

USER_ID = "uk_employment_law"

SOURCES = [
    # ── GOV.UK ──────────────────────────────────────────────────────────────
    "https://www.gov.uk/employment-contracts-and-conditions",
    "https://www.gov.uk/redundancy-your-rights",
    "https://www.gov.uk/dismissal",
    "https://www.gov.uk/employment-tribunals",
    "https://www.gov.uk/national-minimum-wage-rates",
    "https://www.gov.uk/maternity-pay-leave",
    "https://www.gov.uk/paternity-pay-leave",
    "https://www.gov.uk/holiday-entitlement-rights",
    "https://www.gov.uk/discrimination-your-rights",
    "https://www.gov.uk/whistleblowing",
    "https://www.gov.uk/employee-rights-when-business-transfers",
    "https://www.gov.uk/flexible-working",
    "https://www.gov.uk/sick-pay",
    # ── ACAS ────────────────────────────────────────────────────────────────
    "https://www.acas.org.uk/dismissal",
    "https://www.acas.org.uk/redundancy",
    "https://www.acas.org.uk/discrimination-and-the-law",
    "https://www.acas.org.uk/contracts-of-employment",
    "https://www.acas.org.uk/disciplinary-procedure-step-by-step",
    "https://www.acas.org.uk/grievance-procedure-step-by-step",
    "https://www.acas.org.uk/the-right-to-be-accompanied",
    "https://www.acas.org.uk/notice-periods",
    "https://www.acas.org.uk/settlement-agreements",
    "https://www.acas.org.uk/if-your-employer-stops-trading-or-goes-insolvent",
]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Re-seed even if index exists")
    args = parser.parse_args()

    index_path = Path("data/processed") / f"{USER_ID}.index"

    if index_path.exists() and not args.force:
        print(f"Knowledge base already seeded. Use --force to re-seed.")
        return

    if args.force and index_path.exists():
        index_path.unlink(missing_ok=True)
        meta = Path("data/processed") / f"{USER_ID}_meta.pkl"
        meta.unlink(missing_ok=True)
        print("Cleared existing index.")

    Path("data/processed").mkdir(parents=True, exist_ok=True)

    ok, fail = 0, 0
    for url in SOURCES:
        print(f"  → {url}")
        try:
            doc = load_url(url)
            chunks = chunk_text([doc])
            embed_chunks(chunks, USER_ID)
            print(f"    ✓ {len(chunks)} chunks")
            ok += 1
        except Exception as exc:
            print(f"    ✗ FAILED: {exc}")
            fail += 1

    print(f"\nDone — {ok} sources indexed, {fail} failed.")
    if ok:
        print("Start the API and run: curl -s -X POST http://localhost:8000/ask "
              '-H "Content-Type: application/json" '
              f'-d \'{{"user_id":"{USER_ID}","question":"What is unfair dismissal?"}}\' | python -m json.tool')


if __name__ == "__main__":
    main()
