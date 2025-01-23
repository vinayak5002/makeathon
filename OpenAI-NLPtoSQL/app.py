from flask import Flask, jsonify, request
import logging
import openai_utils
import db_utils
import json
import mysql.connector
from flask_cors import CORS, cross_origin
import utils 

logging.basicConfig(format="%(asctime)s - %(message)s", level=logging.INFO)

app = Flask(__name__)

cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
@cross_origin()
def hello_name():
    return "Hello world"


@app.route("/text-sql", methods=["GET"])
@cross_origin()
def text_sql():
    text = request.args.get("text")
    if not text:
        return jsonify({"error": "Text is required"}), 400

    schema = db_utils.get_table_schemas()
    logging.info(f"Schema: {schema}")

    user_input = text
    final_prompt = openai_utils.combine_prompts(schema, user_input)
    logging.info(f"Final prompt: {final_prompt}")

    logging.info("Sending to OpenAI...")
    response_str = openai_utils.send_to_openai(final_prompt)
    response = json.loads(response_str)
    proposed_query = response["choices"][0]["message"]["content"]

    proposed_query_postprocessed = utils.strip_Query(proposed_query)
    logging.info(
        f"Response obtained. Proposed sql query: {proposed_query_postprocessed}"
    )

    return jsonify({"query": proposed_query_postprocessed})


@app.route("/execute-query", methods=["GET"])
@cross_origin()
def exec_query():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query is required"}), 400
    try:

        data, columns, message = db_utils.execute_query(query)
        return jsonify({"data": data, "columns": columns, "message": message})

    except mysql.connector.Error as e:  
        # Catch database-related errors  
        return jsonify({"error": f"Database error: {str(e)}"}), 500  
    except Exception as e:  
        # Catch any other unexpected exceptions  
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500  


@app.route("/sql-text", methods=["GET"])
@cross_origin()
def sql_text():
    user_input = request.args.get("query")
    if not user_input:
        return jsonify({"error": "Query is required"}), 400

    final_prompt = openai_utils.get_prompt(user_input)
    logging.info(f"Final prompt: {final_prompt}")

    logging.info("Sending to OpenAI...")
    response_str = openai_utils.send_to_openai(final_prompt)
    response = json.loads(response_str)
    query_description = response["choices"][0]["message"]["content"]

    logging.info(
        f"Response obtained. Query Explaination: {query_description}"
    )

    return jsonify({"description": query_description})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
