import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
import os  # Add this import to work with environment variables

def run(text_input):
    genai.configure(api_key="AIzaSyB7r4tMrDHwBVL6MIPAWNEdiR3R-GY-c0s")  # Use the passed API key

    # Create the model
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro-002",
        generation_config=generation_config,
    )

    chat_session = model.start_chat()

    response = chat_session.send_message(text_input)

    return str(response.text)


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json.get('message')
    try:
        response_text = run(user_input)  # Pass the API key here
        return jsonify({"response": response_text})
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
