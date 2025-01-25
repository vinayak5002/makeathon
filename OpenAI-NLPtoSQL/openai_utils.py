from openai import AzureOpenAI  
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file


def combine_prompts(fixed_sql_prompt, user_query):
    final_user_input = f"### A query to answer: {user_query}"
    context_and_instructions = (
    "\nInstructions for the model:\n"
    "Your role is to only generate the SQL query based on the schema and the user query provided to you. Avoid adding any information except query. Avoid extra commentary, greetings, or unrelated information.\n\n"
)
    return fixed_sql_prompt + final_user_input + context_and_instructions 


def send_to_openai(prompt):

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

def get_prompt(user_input):
    context_and_instructions = (
    "Context: The user will provide an SQL query, and you need to explain what it does in simple terms. Be brief and avoid unnecessary elaboration.\n\n"
    "Instructions for the model:\n"
    "Your role is to explain SQL queries concisely and to the point. Provide only the explanation of the query's purpose and functionality. Avoid adding extra commentary, greetings, or unrelated information. Focus solely on delivering a clear understanding of the query. Donot add quotes in response\n\n"
    "Example format for explanations:\n"
    '"This query selects..."\n'
    '"This query retrieves..."\n'
    '"This query updates..."'
)
    return context_and_instructions+"\n\n"+user_input 

def user_query_input():

    return "List the names and total amounts of all customers who have made orders totaling more than $500."

    user_input = input("Tell OpenAi what you want to know about the data: ")
    return user_input
