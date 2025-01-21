from flask import Flask, jsonify, request
import logging
import openai_utils
import db_utils
import json

logging.basicConfig(format="%(asctime)s - %(message)s", level=logging.INFO)

app = Flask(__name__)


@app.route("/")
def hello_name():
    return "Hello world"


@app.route("/text-sql", methods=["GET"])
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

    proposed_query_postprocessed = db_utils.strip_Query(proposed_query)
    logging.info(
        f"Response obtained. Proposed sql query: {proposed_query_postprocessed}"
    )

    return jsonify({"query": proposed_query_postprocessed})


@app.route("/execute-query", methods=["GET"])
def exec_query():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query is required"}), 400

    result, columns = db_utils.execute_query(query)

    return jsonify({"columns": columns, "data": result})

if __name__ == "__main__":
    app.run(port=5000)