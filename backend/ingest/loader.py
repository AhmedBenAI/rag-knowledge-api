from pathlib import Path
from typing import List, Dict
from pypdf import PdfReader
import requests
from bs4 import BeautifulSoup

def load_pdf(file_path: str) -> List[Dict]:
    documents = []
    path = Path(file_path)
    reader = PdfReader(path)
    for page_num, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            documents.append({
                "text": text,
                "source": path.name,
                "page": page_num,
            })
    return documents

def load_url(url: str) -> Dict:
    r = requests.get(url, timeout=10)
    soup = BeautifulSoup(r.text, "html.parser")

    for tag in soup(["script", "style", "nav", "footer"]):
        tag.decompose()

    text = soup.get_text(separator=" ")
    return {
        "text": text,
        "source": url
    }
