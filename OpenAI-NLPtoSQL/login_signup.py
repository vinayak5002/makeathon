from flask import Flask, jsonify, request  
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt  
from flask_cors import CORS, cross_origin  
import logging  
import openai_utils  
import db_utils  
import json  
import mysql.connector  
from dotenv import load_dotenv
import os
import utils
  
logging.basicConfig(format="%(asctime)s - %(message)s", level=logging.INFO) 

load_dotenv()  # Load environment variables from .env file
secret_key = os.getenv("SECRET_KEY")
cors_headers = os.getenv("CORS_HEADERS")
  
app = Flask(__name__)  
cors = CORS(app, resources={
    r"*": {
        "origins": "http://localhost:5173",  # Frontend origin for all routes
        "supports_credentials": True  # Allow credentials globally
    }
})
app.config['CORS_HEADERS'] = cors_headers
app.config['SECRET_KEY'] = secret_key
  
# Initialize Flask-Login  
login_manager = LoginManager()  
login_manager.init_app(app)  
login_manager.login_view = 'login'  
  
# Initialize Flask-Bcrypt  
bcrypt = Bcrypt(app)  
  
class User(UserMixin):  
    def __init__(self, id, username, db_password, password=None):  
        self.id = id  
        self.db_password = db_password
        self.username = username  
        self.password = password  
  
@login_manager.user_loader  
def load_user(user_id):  
    user = db_utils.get_user_from_db(user_id)
    if user:  
        return User(str(user['id']), user['username'],user['db_password'], user['password'])  
    return None  

def unauthorized():
    return jsonify({"error": "Unauthorized access. Please log in."}), 401

login_manager.unauthorized = unauthorized

@app.route("/signup", methods=["POST"])
@cross_origin(supports_credentials=True)  
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    admin = data.get('admin')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    db_password = utils.generate_random_password(10)
    try:
        user_id = db_utils.create_user_in_db(username, hashed_password, db_password,admin)
        user = User(str(user_id), username, db_password, hashed_password)
        login_user(user)
        return jsonify({"message": "User created and logged in", "userId": str(user_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

  
@app.route("/login", methods=["POST"])
@cross_origin(supports_credentials=True)  
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    try:
        user = db_utils.get_user_by_username(username)
        if user and bcrypt.check_password_hash(user['password'], password):
            user_obj = User(str(user['id']), user['username'], user['db_password'], user['password'])
            login_user(user_obj)
            return jsonify({"message": "Logged in successfully", "userID": str(user['id'])}), 200
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

  
@app.route("/logout")  
@cross_origin(supports_credentials=True)  
@login_required  
def logout():  
    logout_user()  
    return jsonify({"message": "Logged out successfully"}), 200  


@app.route("/")
@cross_origin(supports_credentials=True)  
def hello_name():
    return "Hello world"

@app.route("/text-sql", methods=["GET"])  
@cross_origin(supports_credentials=True)  
@login_required  
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
    logging.info(f"Response obtained. Proposed sql query: {proposed_query_postprocessed}")  
    
    return jsonify({"query": proposed_query_postprocessed})  
  
@app.route("/execute-query", methods=["GET"])  
# @cross_origin()  
@cross_origin(supports_credentials=True)  
@login_required  
def exec_query():  
    query = request.args.get("query")  
    if not query:  
        return jsonify({"error": "Query is required"}), 400  
      
    try:
        db_user = current_user.username
        db_password = current_user.db_password    
        data, columns, message = db_utils.execute_query(query,db_user,db_password)  
        return jsonify({"data": data, "columns": columns, "message": message})  
    except mysql.connector.Error as e:  
        return jsonify({"error": f"Database error: {str(e)}"}), 500  
    except Exception as e:  
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500  
  
@app.route("/sql-text", methods=["GET"])  
# @cross_origin()  
@cross_origin(supports_credentials=True)  
@login_required  
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
  
    logging.info(f"Response obtained. Query Explanation: {query_description}")  
  
    return jsonify({"description": query_description})  
  
if __name__ == "__main__":  
    app.run(port=5000, debug=True)  