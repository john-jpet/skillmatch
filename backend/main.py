from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import tempfile
import os
from parse_resume import extract_text_from_pdf, extract_skills
from parse_jd import extract_skills_from_jd
from skills import load_taxonomy

app = FastAPI()
taxonomy = load_taxonomy()

@app.get("/")
def root():
    return {"status": "SkillMatch API is running"}

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        text = extract_text_from_pdf(tmp_path)
        skills = extract_skills(text, taxonomy)
    finally:
        os.unlink(tmp_path)

    return {"skills": skills}

class JobPosting(BaseModel):
    text: str

class MatchRequest(BaseModel):
    resume_skills: list[str]
    jd_skills: list[str]

@app.post("/analyze-posting")
async def analyze_posting(posting: JobPosting):
    if not posting.text.strip():
        raise HTTPException(status_code=400, detail="Job posting text cannot be empty")
    
    skills = extract_skills_from_jd(posting.text, taxonomy)
    return {"skills": skills}

@app.post("/match")
async def match(request: MatchRequest):
    resume_set = set(s.lower() for s in request.resume_skills)
    jd_set = set(s.lower() for s in request.jd_skills)
    
    matched = resume_set & jd_set
    missing = jd_set - resume_set
    fit_score = len(matched) / len(jd_set) if jd_set else 0

    return {
        "fit_score": round(fit_score, 2),
        "matched": list(matched),
        "missing": list(missing)
    }