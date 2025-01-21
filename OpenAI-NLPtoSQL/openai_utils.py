from openai import AzureOpenAI  
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file


def combine_prompts(fixed_sql_prompt, user_query):
    """
    This function combines two strings, a fixed SQL prompt and a user query, to create a final user input.

    Parameters:
    fixed_sql_prompt (str): A fixed SQL prompt.
    user_query (str): A user query.

    Returns:
    final_user_input (str): The combined strings.

    """

    final_user_input = f"### A query to answer: {user_query}"
    return fixed_sql_prompt + final_user_input


def send_to_openai(prompt):
    """
    This function sends a prompt to OpenAI's completion API and returns the response.

    Parameters:
    prompt (str): The prompt to be sent to the OpenAI API.

    Returns:
    response (dict): The response from the OpenAI API.
    """

    endpoint = os.getenv("ENDPOINT")
    deployment = os.getenv("DEPLOYMENT_NAME")
    subscription_key = os.getenv("OPENAI_API_KEY")

    # Initialize Azure OpenAI Service client with key-based authentication    
    client = AzureOpenAI(  
        azure_endpoint=endpoint,  
        api_key=subscription_key,  
        api_version="2024-05-01-preview",
    )
    
    # Format the prompt into the expected message structure
    messages = [{"role": "user", "content": prompt}]

    completion = client.chat.completions.create(  
        model=deployment,
        messages=messages,  # Pass the formatted list of messages
        max_tokens=800,  
        temperature=0.7,  
        top_p=0.95,  
        frequency_penalty=0,  
        presence_penalty=0,
        stop=None,  
        stream=False
    )
 
    return completion.to_json()


def user_query_input():

    return "List the names and total amounts of all customers who have made orders totaling more than $500."

    user_input = input("Tell OpenAi what you want to know about the data: ")
    return user_input
