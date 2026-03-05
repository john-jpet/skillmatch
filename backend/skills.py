def load_taxonomy(path="skills.txt"):
    with open(path, "r", encoding="utf-8") as f:
        return set(line.strip().lower() for line in f if line.strip())

if __name__ == "__main__":
    skills = load_taxonomy()
    print(f"Loaded {len(skills)} skills")