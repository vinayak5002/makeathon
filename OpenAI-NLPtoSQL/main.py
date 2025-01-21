# DATASET: https://www.kaggle.com/datasets/kyanyoga/sample-sales-data

import json
import os 
import logging
import pandas as pd
import openai
import db_utils
import openai_utils

logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO)

# SET UP API KEY
openai.api_key = os.environ.get('OPENAI_API_KEY')

if __name__ == '__main__':

    fixed_sql_prompt = db_utils.get_table_schemas()
    logging.info(f'Fixed SQL Prompt: {fixed_sql_prompt}')

    logging.info("Waiting for user input...")
    user_input = openai_utils.user_query_input()
    final_prompt = openai_utils.combine_prompts(fixed_sql_prompt, user_input)
    logging.info(f'Final prompt: {final_prompt}')

    logging.info("Sending to OpenAI...")
    response_str = openai_utils.send_to_openai(final_prompt)
    response = json.loads(response_str)
    proposed_query = response['choices'][0]['message']['content']
    # print(proposed_query)
    proposed_query_postprocessed = db_utils.strip_Query(proposed_query)
    logging.info(f'Response obtained. Proposed sql query: {proposed_query_postprocessed}')

    result = db_utils.execute_query(proposed_query_postprocessed)
    print("Query execution output:")
    print(result)
