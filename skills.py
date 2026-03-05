import csv

def load_taxonomy(path="skills.csv"):
    skills = set()
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader)  # skip header row
        for row in reader:
            if row:
                skills.add(row[0].strip().lower())
    return skills

if __name__ == "__main__":

    
    skills = load_taxonomy()
    print(f"Loaded {len(skills)} skills")
    matches = [s for s in skills if "tailwind" in s]
    print(matches)
    check = ["c", "c++", "kotlin", "react", "react native", "flask", "android studio"]
    for term in check:
        matches = [s for s in skills if term == s]
        print(f"'{term}': {'FOUND' if matches else 'NOT FOUND'}")