import json
import os
import tempfile
from typing import Dict, Any

import functions_framework
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader
from python_dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# In-memory storage (replaces FastAPI app.state)
knowledge_maps: Dict[str, Any] = {}
quiz_sessions: Dict[str, Any] = {}
risk_reports: Dict[str, Any] = {}

if os.getenv("GEMINI_API_KEY"):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def cors_response(response_data: Dict[str, Any], status_code: int = 200):
    """Wrap response with CORS headers."""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    }
    return (json.dumps(response_data), status_code, headers)


@functions_framework.http
def health(request):
    """Health check endpoint."""
    if request.method == "OPTIONS":
        return ("", 204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        })
    
    response = {"status": "ok", "service": "studyguard-api"}
    return cors_response(response)


@functions_framework.http
def upload_syllabus(request):
    """Upload and parse syllabus PDF."""
    if request.method == "OPTIONS":
        return ("", 204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        })
    
    try:
        if "file" not in request.files:
            return cors_response({"error": "No file provided"}, 400)
        
        file = request.files["file"]
        if not file.filename.endswith(".pdf"):
            return cors_response({"error": "Only PDF files are supported"}, 400)
        
        # Save temp file and parse
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            file.save(tmp.name)
            reader = PdfReader(tmp.name)
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
            os.unlink(tmp.name)
        
        if not text.strip():
            return cors_response({"error": "No readable text found in PDF"}, 400)
        
        # Generate knowledge map via Gemini
        prompt = f"""
You are a Curriculum Intelligence Engine. Turn the following syllabus text into a strict JSON array of knowledge map entries.
Each entry must include: topic_name, difficulty_level (1-5), prerequisites (array of topic_names), estimated_mastery_time (minutes), and common_misconceptions (array of 3 strings).
Syllabus text:
{text}
"""
        
        if os.getenv("GEMINI_API_KEY"):
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            try:
                parsed = json.loads(response.text)
            except Exception:
                parsed = [{
                    "topic_name": "Syllabus parsed",
                    "difficulty_level": 3,
                    "prerequisites": [],
                    "estimated_mastery_time": 30,
                    "common_misconceptions": ["Needs review"]
                }]
        else:
            parsed = [{
                "topic_name": "Syllabus uploaded",
                "difficulty_level": 3,
                "prerequisites": [],
                "estimated_mastery_time": 30,
                "common_misconceptions": ["Need Gemini API key for full analysis"]
            }]
        
        course_id = secure_filename(file.filename.replace(".pdf", ""))
        knowledge_maps[course_id] = parsed
        
        return cors_response({
            "course_id": course_id,
            "knowledge_map": parsed
        })
    
    except Exception as e:
        return cors_response({"error": str(e)}, 500)


@functions_framework.http
def generate_quiz(request):
    """Generate a 2-minute active-recall quiz."""
    if request.method == "OPTIONS":
        return ("", 204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        })
    
    try:
        payload = request.get_json()
        student_id = payload.get("student_id")
        topic = payload.get("topic")
        
        if not student_id or not topic:
            return cors_response({"error": "Missing student_id or topic"}, 400)
        
        prompt = f"""
You are a Spaced Repetition Quiz Engine.
Create one active-recall question for topic '{topic}' for student '{student_id}'.
The question must be free-response and not multiple choice. Calibrate difficulty based on an average level.
Return JSON with: question, expected_answer_keywords, prerequisite_tested, difficulty.
"""
        
        if os.getenv("GEMINI_API_KEY"):
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            try:
                result = json.loads(response.text)
            except Exception:
                result = {
                    "question": f"Explain the main idea behind {topic} in your own words.",
                    "expected_answer_keywords": [topic],
                    "prerequisite_tested": "Foundational concept",
                    "difficulty": "medium"
                }
        else:
            result = {
                "question": f"Explain the main idea behind {topic} in your own words.",
                "expected_answer_keywords": [topic],
                "prerequisite_tested": "Foundational concept",
                "difficulty": "medium"
            }
        
        quiz_sessions[student_id] = result
        return cors_response(result)
    
    except Exception as e:
        return cors_response({"error": str(e)}, 500)


@functions_framework.http
def submit_answer(request):
    """Submit answer and get cognitive diagnostic."""
    if request.method == "OPTIONS":
        return ("", 204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        })
    
    try:
        payload = request.get_json()
        student_id = payload.get("student_id")
        topic = payload.get("topic")
        student_answer = payload.get("student_answer")
        
        if not all([student_id, topic, student_answer]):
            return cors_response({"error": "Missing required fields"}, 400)
        
        prompt = f"""
You are a Cognitive Diagnostic Engine.
Topic: {topic}
Student answer: {student_answer}
Diagnose the likely missing prerequisite concept and explain the remediation in 3 sentences.
Return JSON with: diagnosed_gap, confidence, reasoning, remediation_micro_lesson, estimated_recovery_time.
"""
        
        if os.getenv("GEMINI_API_KEY"):
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            try:
                diagnosis = json.loads(response.text)
            except Exception:
                diagnosis = {
                    "diagnosed_gap": "Foundational prerequisite",
                    "confidence": 0.6,
                    "reasoning": "The student appears to be missing a prerequisite concept needed for this topic.",
                    "remediation_micro_lesson": "Review the prerequisite concept for 3 minutes and then answer one short practice question.",
                    "estimated_recovery_time": "10 minutes"
                }
        else:
            diagnosis = {
                "diagnosed_gap": "Foundational prerequisite",
                "confidence": 0.6,
                "reasoning": "The student appears to be missing a prerequisite concept needed for this topic.",
                "remediation_micro_lesson": "Review the prerequisite concept for 3 minutes and then answer one short practice question.",
                "estimated_recovery_time": "10 minutes"
            }
        
        risk_reports[student_id] = diagnosis
        return cors_response(diagnosis)
    
    except Exception as e:
        return cors_response({"error": str(e)}, 500)


@functions_framework.http
def risk_dashboard(request):
    """Return class risk report."""
    if request.method == "OPTIONS":
        return ("", 204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        })
    
    try:
        payload = request.get_json()
        class_id = payload.get("class_id")
        
        if not class_id:
            return cors_response({"error": "Missing class_id"}, 400)
        
        report = {
            "class_id": class_id,
            "risk_level": "YELLOW",
            "students_at_risk": 3,
            "common_gap": "Product Rule",
            "recommended_intervention": "Send a short prerequisite refresher to the 3 at-risk students"
        }
        return cors_response(report)
    
    except Exception as e:
        return cors_response({"error": str(e)}, 500)
