<h1>Natural Language to SQL Query Translator</h1>

<h2>This program is designed to translate natural language statements into SQL queries using OpenAI API, pandas library, and sqlalchemy. 
It is useful for those who are not familiar with SQL syntax and want to query databases using natural language.</h2>

<h3>Installation</h3>
To use this program, you will need to install the following dependencies:<br>

<ol>
<li>OpenAI API (https://beta.openai.com/docs/)</li>
<li>pandas library (https://pandas.pydata.org/)</li>
<li>sqlalchemy (https://www.sqlalchemy.org/)</li>
</ol>

You can install these dependencies using pip by running the following command:

<code>pip install openai pandas sqlalchemy</code>

<h3>Usage</h3>
Before running the program, you will need to set two variables: 

<ol><li><code>openai.api_key</code></li>
<li><code>dataset</code></li></ol>

<h4>How to obtain and set the <code>openai.api_key</code> variable:</h4>

<ol>
<li>To set up an OpenAI API key. You can sign up for an API key on the OpenAI website: https://beta.openai.com/signup/.<br><strong>Note that it is very important that this API Key is kept secure. Do not share it with anyone else.</strong></li>

<li>Once you have an API key, create a file named .env in the root directory of this project and add the following line:

<code>OPENAI_API_KEY="YOURAPIKEY"</code>

<li>Then, set the variable in the <code>main.py</code> file: <code>openai.api_key = environ.get('OPENAI_API_KEY')</code></li>
</ol>

<h4>How to set the <code>dataset</code> variable:</h4>

<ol>
<li>Make sure that you have downloaded your dataset to somewhere on your computer</li>
<li>Copy the file path of your dataset and set it to the variable in the <code>main.py</code> file: dataset=r"YOURFILEPATH"</li>
</ol>

<h4> Running the program</h4>
To run the program, run the <code>main.py</code> file and enter a natural language statement when prompted. 
The program will use the OpenAI API to generate a SQL query based on your statement, which will then be executed using sqlalchemy.
