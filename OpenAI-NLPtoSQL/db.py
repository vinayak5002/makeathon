import mysql.connector
from dotenv import load_dotenv
import os

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


def execute_query(query):
    # Establish connection to the MySQL database
    connection = mysql.connector.connect(
        host=host,  # E.g., 'localhost' or an IP address
        user=user,  # Your MySQL username
        password=password,  # Your MySQL password
        database=database,  # This is a default schema that contains metadata
    )
    
       # Create a cursor object
    cursor = connection.cursor()

    # Execute the query
    cursor.execute(query)

    # Fetch all results
    output = cursor.fetchall()

    # Get column names for the output formatting
    column_names = [desc[0] for desc in cursor.description]

    # Calculate column width based on the longest entry (including column names)
    column_widths = [max(len(str(item)), len(column)) for column, item in zip(column_names, zip(*output))] if output else [len(column) for column in column_names]
    column_widths = [max(width, len(column)) for column, width in zip(column_names, column_widths)]

    # Prepare the format for the table headers and rows
    separator = "+" + "+".join(["-" * width for width in column_widths]) + "+"
    format_string = "| " + " | ".join([f"{{:<{width}}}" for width in column_widths]) + " |"

    # Prepare the formatted result
    result = separator + "\n"
    result += format_string.format(*column_names) + "\n"
    result += separator + "\n"

    # Format and print each row of the result
    for row in output:
        result += format_string.format(*row) + "\n"

    result += separator  # Closing separator line

    # Close the cursor and connection
    cursor.close()
    connection.close()

    # Return the formatted result
    return result