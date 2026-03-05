import anthropic
import os
print(f"Key found: {os.environ.get('ANTHROPIC_API_KEY')[:15]}...") 
client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=100,
    messages=[
        {"role": "user", "content": "Say hello in one sentence."}
    ]
)

print(message.content[0].text)