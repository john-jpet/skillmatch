import anthropic
import pdfplumber
import json
import os
from skills import load_taxonomy
from docx import Document

def extract_text_from_docx(path):
    doc = Document(path)
    return "\n".join(paragraph.text for paragraph in doc.paragraphs)

def extract_text_from_pdf(path):
    with pdfplumber.open(path) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)

def extract_skills(resume_text, taxonomy):
    client = anthropic.Anthropic()
    
    prompt = f"""Extract skills from this resume. Only return skills that exist in the provided taxonomy.
Use the canonical taxonomy name — for example, use "React.js" not "React".

Return a JSON array of strings only. No explanation, no markdown, just the JSON array.

Example output: ["Python", "React.js", "MySQL"]

Resume:
{resume_text}"""

    message = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=1000,
        temperature=0,
        messages=[{"role": "user", "content": prompt}]
    )
    
    raw = message.content[0].text.strip()
    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1]  # remove first line (```json)
        raw = raw.rsplit("```", 1)[0]  # remove closing ```
        raw = raw.strip()
    print(f"Raw response: {repr(raw)}")
    skills = json.loads(raw)
    
    # Validate against taxonomy
    validated = [s for s in skills if s.lower() in taxonomy]
    rejected = [s for s in skills if s.lower() not in taxonomy]
    
    print(f"Validated: {len(validated)} skills")
    print(f"Rejected: {rejected}")
    
    return validated

if __name__ == "__main__":
    taxonomy = load_taxonomy()
    text = extract_text_from_pdf("sampleresume.pdf")
    skills = extract_skills(text, taxonomy)
    print(f"\nExtracted skills:\n{skills}")