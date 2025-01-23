import mysql.connector
from flask import jsonify
from dotenv import load_dotenv
import os
import re

load_dotenv()  # Load environment variables from .env file

host = os.getenv("HOST")
user = os.getenv("USER")
password = os.getenv("PASSWORD")
database = os.getenv("DATABASE")


def get_table_schemas():

    # Establish connection to the MySQL database
    connection = mysql.connector.connect(
        host=host,  # E.g., 'localhost' or an IP address
        user=user,  # Your MySQL username
        password=password,  # Your MySQL password
        database=database,  # This is a default schema that contains metadata
    )

    # Create a cursor object
    cursor = connection.cursor()

    # Query to get all tables in the database
    cursor.execute("SHOW TABLES")

    # Fetch all tables
    tables = cursor.fetchall()

    # Prepare a dictionary to store schema information
    schemas = {}

    # For each table, get the columns
    for table in tables:
        table_name = table[0]
        cursor.execute(f"DESCRIBE {table_name}")  # Get schema for each table
        columns = cursor.fetchall()

        # Store column details in a dictionary under the table name
        schemas[table_name] = []
        for column in columns:
            column_name = column[0]
            column_type = column[1]
            column_nullable = column[2]
            column_key = column[3]
            column_default = column[4]
            column_extra = column[5]

            column_details = {
                "name": column_name,
                "type": column_type,
                "nullable": column_nullable,
                "key": column_key,
                "default": column_default,
                "extra": column_extra,
            }
            schemas[table_name].append(column_details)

    # Store the schema information in a variable (as a string)
    schema_output = ""

    for table, columns in schemas.items():
        schema_output += f"Table: {table}\n"
        for column in columns:
            schema_output += (
                f"  Column: {column['name']}, "
                f"Type: {column['type']}, "
                f"Nullable: {column['nullable']}, "
                f"Key: {column['key']}, "
                f"Default: {column['default']}, "
                f"Extra: {column['extra']}\n"
            )
        schema_output += "\n"

    # Close the cursor and connection
    cursor.close()
    connection.close()

    return schema_output

def get_table_name(query):
    # Regular expression to match table names in UPDATE and INSERT queries
    update_pattern = r"(?i)^UPDATE\s+([a-zA-Z0-9_]+)"
    insert_pattern = r"(?i)^INSERT\s+INTO\s+([a-zA-Z0-9_]+)"
    delete_pattern = r"(?i)^DELETE\s+FROM\s+([a-zA-Z0-9_]+)" 
    
    # Check if the query matches UPDATE or INSERT pattern
    match = re.match(update_pattern, query)
    if match:
        return match.group(1)
    
    match = re.match(insert_pattern, query)
    if match:
        return match.group(1)
    
    match = re.match(delete_pattern, query)
    if match:
        return match.group(1)
        
    return None 
    

import mysql.connector

def execute_query(query):
    try:
        connection = mysql.connector.connect(
            host=host,  # E.g., 'localhost' or an IP address
            user=user,  # Your MySQL username
            password=password,  # Your MySQL password
            database=database,  # The schema that contains metadata
        )
        
        cursor = connection.cursor()
        
        query_type = query.split()[0].lower()
        
        if query_type == "select":
            cursor.execute(query)
            
            output = cursor.fetchall()
            
            if not output:
                return [], [], ""
            
            column_names = [desc[0] for desc in cursor.description]
            
            formatted_result = [dict(zip(column_names, row)) for row in output]
            
            cursor.close()
            connection.close()
            
            return formatted_result, column_names, "Success"
        
        elif query_type == "update" or query_type == "insert":
            cursor.execute(query)
            num_rows_affected = cursor.rowcount
            
            connection.commit()
            
            table_name = get_table_name(query)
            
            cursor.execute(f"SELECT * FROM {table_name}")
            output = cursor.fetchall()
            
            column_names = [desc[0] for desc in cursor.description]
            formatted_result = [dict(zip(column_names, row)) for row in output]
            
            cursor.close()
            connection.close()
            
            return formatted_result, column_names, f"{num_rows_affected} no. of rows affected"
        
        elif query_type == "delete":
            cursor.execute(query)
            num_rows_affected = cursor.rowcount
            
            cursor.close()
            connection.close()
            
            return [], [], f"{num_rows_affected} no. of rows affected"
        
        else:
            return [], [], "Unable to execute query"
    
    except mysql.connector.Error as e:
        cursor.close()
        connection.close()
        raise e  
    
    except Exception as e:
        cursor.close()
        connection.close()
        raise e  

def strip_Query(query):
    cleaned_query = query.strip("```sql").strip("```").strip()

    return cleaned_query
