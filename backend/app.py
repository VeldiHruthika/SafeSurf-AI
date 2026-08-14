import os
from dotenv import load_dotenv

from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai

load_dotenv()

app = Flask(__name__)
CORS(app)

# Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY is not set. "
        "Make sure your API key is available in the environment."
    )

client = genai.Client(api_key=api_key)


@app.route("/")
def home():
    return jsonify({
        "message": "SafeSurf AI backend is running"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "SafeSurf AI API"
    })


@app.route("/api/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data received"
        }), 400

    selected_symptoms = data.get("symptoms", [])

    if not selected_symptoms:
        return jsonify({
            "error": "No symptoms selected"
        }), 400

    symptoms_text = ", ".join(selected_symptoms)

    prompt = f"""
You are SafeSurf AI, a cautious health-information assistant.

The user selected these symptoms:

{symptoms_text}

Analyze these symptoms for general informational purposes.

IMPORTANT RULES:

1. Do NOT provide a definitive medical diagnosis.
2. Give possible conditions or explanations only.
3. Do not exaggerate or create unnecessary fear.
4. Consider common explanations before uncommon serious conditions.
5. Clearly mention when symptoms can have multiple causes.
6. Recommend an appropriate type of healthcare professional.
7. Mention important warning signs only when relevant.
8. Encourage professional medical evaluation when appropriate.
9. Do not recommend prescription medication or specific drug dosages.
10. Keep the response understandable to a normal user.

Return ONLY valid JSON in exactly this structure:

{{
    "condition": "Most likely general explanation",
    "confidence": "Low / Moderate / High",
    "description": "Short explanation of what these symptoms can commonly be associated with.",
    "possible_causes": [
        "Possible cause 1",
        "Possible cause 2",
        "Possible cause 3"
    ],
    "specialist": "Recommended healthcare professional",
    "recommendation": "What the user should reasonably do next.",
    "warning_signs": [
        "Warning sign 1",
        "Warning sign 2"
    ]
}}
"""

    try:

        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt
        )

        result = response.text

        print("Gemini response:")
        print(result)

        return jsonify({
            "success": True,
            "analysis": result
        })

    except Exception as error:

        print("Gemini error:", error)

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )

