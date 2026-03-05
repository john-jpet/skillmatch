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

    jd_text = """Job Posting: 453347 - Position: Software Developer Intern - Projection
Co-op Work Term Posted: 2026 - Spring
App Deadline 01/20/2026 09:00 AM
Application Method: WaterlooWorks
Posting Goes Live: 01/10/2026 09:00 AM
Job Posting Status: Expired
Company Information
Organization Ford Motor Company of Canada Limited
Division Product Development
Job Posting Information
Work Term 2026 - Spring
Job Type Co-op Main
Job Title Software Developer Intern - Projection
Employer Internal Job Number 11 Waterloo
Number of Job Openings 2
Level Junior
Intermediate
Senior
Region ON - Waterloo Region
Job - Address Line One 176 Columbia Street West
Job - City Waterloo
Job - Province/State Ontario
Job - Postal/Zip Code N2L 3L3
Job - Country Canada
Employment Location
Arrangement In-person
Work Term Duration 4 month work term
Job Summary
As a member of the product development team, you'll dive into the world of cutting-edge infotainment systems powering Ford
vehicles globally. Specifically, the Projection team focuses on integrating CarPlay and Android Auto, giving students the chance to
work directly with these technologies and gain invaluable experience. With excellent mentoring, you'll progress to development
tasks where your creative solutions can shine. You'll also have opportunities to test your work in real Ford vehicles, learning the
latest tools, technologies, and engineering practices along the way. At Ford, we're committed to providing students with engaging
and challenging work terms that pave the way for successful software careers. We work individually with each student, tailoring the
experience to match their abilities, enthusiasm, and drive.
LOCATION: Waterloo, Onsite.
LENGTH OF TERM: 4 Months with possibility of extension
Job Responsibilities
RESPONSIBILITIES
- Collaborate within an agile team of software developers, test engineers, product managers, and team leads.
- Actively participate in all aspects of the agile development lifecycle, including daily stand-ups, sprint planning, demos, and
retrospectives.
- Design and develop custom software solutions using Kotlin and Java for the Android platform.
- Contribute to the full software development lifecycle, including feature development, bug fixing, automated testing, and code
reviews.
Required Skills
SKILLS AND QUALIFICATIONS
- Currently pursuing a degree in Computer Science, Software Engineering, or a related field.
- Proficiency in Android Studio.
- Strong programming skills in Kotlin and Java.
- Excellent communication, collaboration, and interpersonal skills.
- Familiarity with formal software development and testing methodologies.
- Demonstrated eagerness to learn, solve complex problems, and contribute to a team.
- Highly motivated and seeking a challenging and rewarding work experience.
ADDITIONAL ASSETS
- Experience with the Android framework and AOSP (Android Open Source Project).
- Solid understanding of Gradle, Coroutines, and Android Services.
- Experience with unit testing
- Experience developing in a Linux environment.
- Familiarity with Jira for issue tracking and agile project management.
- Working knowledge of Git.
- Prior experience or interest in the automotive industry.
Compensation and Benefits
For Undergraduate students, the expected hourly pay range for this position is $28.39 - $35.92. Rates are based on the number of
completed work terms to a maximum of 6 terms.
For Graduate students, the expected hourly pay range for this position is $35.92 - $39.51. Rates are based on the number of
completed school terms to a maximum of 3 terms.
This posting is for an existing vacancy within our team.
Application Information
Application Delivery WaterlooWorks
Additional Application Information
Ford of Canada is an Equal Opportunity Employer and is committed to a culturally diverse workforce. Accommodations for
applicants with disabilities throughout the recruitment, selection and / or assessment processes, where needed, are available upon
request. Please inform Human Resources of the nature of any accommodation(s) that you may require."""

    skills = extract_skills_from_jd(jd_text, taxonomy)
    print(f"\nExtracted skills:\n{skills}")