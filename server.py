from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import tempfile, os, re
from data_parse import read_resume, parse_personal_info, parse_sections

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["https://folio-creator-onboar-5g2q.bolt.host", 
                     "http://127.0.0.1:5173",
                     "http://localhost:5173"
    ],
    allow_credentials =True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok:": True}

def extract_skills(skills_text: str) -> List[str]:
    if not skills_text:
        return []
    parts = re.split(r'[\n,;•-]+', skills_text)
    return [p.strip() for p in parts if p.strip()]

@app.post("/parse")
async def parse(file: UploadFile = File(...)) -> Dict[str, Any]:
    suffix = os.path.splitext(file.filename)[1] or ".txt"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        resume_data = read_resume(tmp_path)
        if not resume_data or not resume_data.get("raw_text"):
            return {"error": "Failed to read resume text."}

        text = resume_data["raw_text"]
        metadata = resume_data.get("metadata")

        info = parse_personal_info(text) or {}
        sections = parse_sections(text, metadata=metadata) or {}

        skills = extract_skills(sections.get("Skills", ""))

        # Define 'highlights' and 'edu_text' from the parsed sections
        highlights = sections.get("Experience", "").splitlines()
        edu_text = sections.get("Education", "").splitlines()

        return {
            "profile": {
                "name": info.get("name") or "",
                "headline": (sections.get("Summary", "") or "").splitlines()[0] if sections.get("Summary") else "",
                "location": "",
                "email": info.get("email") or "",
                "phone": info.get("phone") or "",
            },
            "experience": [
                {
                    "id": "1",
                    "company": "",
                    "role": "",
                    "startDate": "",
                    "endDate": "",
                    "highlights": highlights[:10],
                }
            ] if highlights else [],
            "education": [
                {
                    "id": "1",
                    "school": edu_text[0] if edu_text else "",
                    "degree": edu_text[0] if edu_text else "",
                    "startDate": "",
                    "endDate": "",
                }
            ] if edu_text else [],
            "skills": skills[:50],
        }
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

