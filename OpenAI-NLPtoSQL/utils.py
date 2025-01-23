import secrets
import string

def generate_random_password(length=12):
    # Define the alphabet to choose from (letters + digits + punctuation)
    alphabet = string.ascii_letters + string.digits + string.punctuation
    # Use secrets.choice for cryptographically secure random selection
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return password

def strip_Query(query):
    cleaned_query = query.strip("```sql").strip("```").strip()

    return cleaned_query