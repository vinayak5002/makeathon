from sqlalchemy import create_engine
from sqlalchemy import text

def dataframe_to_database(df, table_name):
    """
This function takes a pandas dataframe and a table name as input and creates a temporary database in RAM and pushes the dataframe into the database.

Parameters:
    df (pandas dataframe): The dataframe to be pushed into the database.
    table_name (str): The name of the table to be created in the database.

Returns:
    engine (sqlalchemy engine): The engine of the created database.
     """

    engine = create_engine('sqlite:///:memory:', echo=False)

    df.to_sql(name = table_name, con = engine, index = False)
    return engine


def execute_query(engine, query):
    """
This function executes a given SQL query on a given engine and returns the results.

Parameters:
engine (object): The engine to execute the query on.
query (str): The SQL query to execute.

Returns:
list: A list of tuples containing the results of the query.

    """

    with engine.connect() as conn:
        result = conn.execute(text(query))
        return result.fetchall()

def strip_Query(query):
    cleaned_query = query.strip('```sql').strip('```').strip()

    return cleaned_query


def handle_response(response):
    """
 This function takes in a response from a user and cleans it up to get the SQL query.
 
 Parameters:
 response (dict): The response from the user.
 
 Returns:
 query (str): The SQL query.
 
     """

    query = response['choices'][0]['text']
    if query.startswith(" "):
        query = "SELECT"+query
    return query
