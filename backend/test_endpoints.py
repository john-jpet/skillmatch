import requests

# Test analyze-posting
jd_text = "Design and develop custom software solutions using Kotlin and Java for the Android platform. Proficiency in Android Studio. Solid understanding of Gradle and Git. Experience developing in a Linux environment. Familiarity with Jira."

response = requests.post(
    "http://localhost:8080/analyze-posting",
    json={"text": jd_text}
)
print("JD skills:", response.json())

# Test match
resume_skills = ["Python", "Java", "Kotlin", "Android Studio", "Git", "Linux", "MySQL"]
jd_skills = response.json()["skills"]

match_response = requests.post(
    "http://localhost:8080/match",
    json={"resume_skills": resume_skills, "jd_skills": jd_skills}
)
print("Match result:", match_response.json())