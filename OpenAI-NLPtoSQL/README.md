# Getting started

## Local setup
Create a python virtual environment.

Install python package 
```cmd
pip install virtualenv
```

Create a virtual environment
```cmd
python -m venv <env_name>
```

Activating Virtual enviornment 

Windows: 
```cmd
.<env_name>/Scipts/activate
```

Install dependencies
```cmd
pip install -r requirment.txt
```

## Configuration
Create `.env` file with following configurations

```env
OPENAI_API_KEY=YOUR_OPEN_API_KEY
DEPLOYMENT_NAME=YOUR_DEPLOYMENT
ENDPOINT=YOUR_ENDPOINT
LOCATION=YOUR_LOCATION

HOST=CONNECTION_URL
USER=USERNAME
PASSWORD=PASSWORD
DATABASE=SCHEMA_NAME
```

## Running Flask Server
```cmd
python app.py
```

# API documentation

## Endpoints

### GET /text-sql
#### Description:
Generates a SQL query based on a text input provided by the user. This input is processed and transformed into an SQL query using predefined schema and OpenAI's API.

#### Request Parameters:
 - text (required): A string of text describing the desired query.

```json
{
  "text": "Show me the total sales of each customer"
}
```

#### Example Request:
```
/text-sql?text=Show%20me%20the%20total%20sales%20for%20each%20customer
```
#### Response:
Status: 200 OK

#### Content:
```json
{
  "query": "SELECT customer_id, SUM(sales) FROM orders GROUP BY customer_id"
}
```

#### Error Response:
If no text is provided in the request, the API will respond with an error message.
```json
{
  "error": "Text is required"
}
```

### GET /execute-query
#### Description:
Executes a SQL query against the database. The query is provided as a parameter in the URL.

#### Request Parameters:
 - query (required): The SQL query to be executed.

```json
{
  "query": "SELECT customer_id, SUM(sales) FROM orders GROUP BY customer_id"
}
```

#### Example Request:
```
/execute-query?query=SELECT%20customer_id,%20SUM(sales)%20FROM%20orders%20GROUP%20BY%20customer_id
```
#### Response:
Status: 200 OK

#### Content:
```json
{
    "columns": ["first_name", "last_name", "total_spent"],
    "data": [
        {"first_name": "John", "last_name": "Doe", "total_spent": "1499.98"},
        {"first_name": "Jane", "last_name": "Smith", "total_spent": "799.98"},
        {"first_name": "Emily", "last_name": "Johnson", "total_spent": "599.97"},
    ],
}
```

#### Error Response:
If no text is provided in the request, the API will respond with an error message.
```json
{
  "error": "Query is required"
}
```