from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel
from dotenv import load_dotenv
import tempfile
import os

load_dotenv()
from parse_resume import extract_text_from_pdf, extract_text_from_docx, extract_skills
from parse_jd import extract_skills_from_jd
from skills import load_taxonomy

DAILY_LIMIT = os.getenv("DAILY_LIMIT", "10/day")
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

taxonomy = load_taxonomy()

class JobPosting(BaseModel):
    text: str

class MatchRequest(BaseModel):
    resume_skills: list[str]
    jd_skills: list[str]

@app.get("/")
def root():
    return {"status": "SkillMatch API is running"}

@app.post("/upload-resume")
@limiter.limit(DAILY_LIMIT)
async def upload_resume(request: Request, file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf") and not file.filename.endswith(".docx"):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    suffix = ".pdf" if file.filename.endswith(".pdf") else ".docx"
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        if suffix == ".pdf":
            text = extract_text_from_pdf(tmp_path)
        else:
            text = extract_text_from_docx(tmp_path)
        skills = extract_skills(text, taxonomy)
    finally:
        os.unlink(tmp_path)

    return {"skills": skills}

@app.post("/analyze-posting")
@limiter.limit(DAILY_LIMIT)
async def analyze_posting(request: Request, posting: JobPosting):
    if not posting.text.strip():
        raise HTTPException(status_code=400, detail="Job posting text cannot be empty")
    
    skills = extract_skills_from_jd(posting.text, taxonomy)
    return {"skills": skills}

@app.post("/match")
@limiter.limit(DAILY_LIMIT)
async def match(request: Request, request_body: MatchRequest):
    resume_map = {s.lower(): s for s in request_body.resume_skills}
    jd_map = {s.lower(): s for s in request_body.jd_skills}

    resume_set = set(resume_map.keys())
    jd_set = set(jd_map.keys())

    matched_keys = resume_set & jd_set
    missing_keys = jd_set - resume_set

    fit_score = len(matched_keys) / len(jd_set) if jd_set else 0

    return {
        "fit_score": round(fit_score, 2),
        "matched": [jd_map[k] for k in matched_keys],
        "missing": [jd_map[k] for k in missing_keys]
    }