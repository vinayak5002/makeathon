import mysql.connector

# Establish connection to the MySQL database
connection = mysql.connector.connect(
    host='your_host',       # E.g., 'localhost' or an IP address
    user='your_username',   # Your MySQL username
    password='your_password',  # Your MySQL password
    database='information_schema'  # This is a default schema that contains metadata
)

# Create a cursor object
cursor = connection.cursor()

# Query to get all schemas
cursor.execute("SHOW DATABASES")

# Fetch all databases (schemas)
databases = cursor.fetchall()

# Loop through each database to get its tables
for db in databases:
    database_name = db[0]
    print(f"Schema: {database_name}")
    
    # For each schema, get the tables
    cursor.execute(f"SHOW TABLES IN {database_name}")
    tables = cursor.fetchall()
    
    for table in tables:
        print(f"  Table: {table[0]}")
    print("-" * 50)

# Close the cursor and connection
cursor.close()
connection.close()
