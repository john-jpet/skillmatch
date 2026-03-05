import anthropic
import json
from skills import load_taxonomy

def extract_skills_from_jd(jd_text, taxonomy):
    client = anthropic.Anthropic()

    prompt = f"""Extract the required and preferred technical skills from this job posting.
Only return skills that exist in the LinkedIn skills taxonomy.
Use canonical taxonomy names — for example, use "React.js" not "React".
Do not include soft skills like "communication" or "teamwork".

Return a JSON array of strings only. No explanation, no markdown, just the JSON array.

Example output: ["Python", "Java", "Git"]

Job Posting:
{jd_text}"""

    message = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1]
        raw = raw.rsplit("```", 1)[0]
        raw = raw.strip()

    skills = json.loads(raw)

    validated = [s for s in skills if s.lower() in taxonomy]
    rejected = [s for s in skills if s.lower() not in taxonomy]

    print(f"Validated: {len(validated)} skills")
    print(f"Rejected: {rejected}")

    return validated

if __name__ == "__main__":
    taxonomy = load_taxonomy()
    jd_text = input("Paste job posting text and press Enter: ")
    skills = extract_skills_from_jd(jd_text, taxonomy)
    print(f"\nExtracted skills:\n{skills}")