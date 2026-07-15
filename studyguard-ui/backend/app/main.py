import os
import json
import tempfile
from typing import Dict, Any

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from PyPDF2 import PdfReader
import google.generativeai as genai

load_dotenv()

app = FastAPI(title="StudyGuard API", version="0.1.0")

app.state.knowledge_maps: Dict[str, Any] = {}
app.state.quiz_sessions: Dict[str, Any] = {}
app.state.risk_reports: Dict[str, Any] = {}

if os.getenv("GEMINI_API_KEY"):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class QuizRequest(BaseModel):
    student_id: str
    topic: str


class AnswerSubmission(BaseModel):
    student_id: str
    topic: str
    student_answer: str


class RiskRequest(BaseModel):
    class_id: str


@app.get("/health")
def health_check() -> Dict[str, str]:
    return {"status": "ok", "service": "studyguard-api"}


@app.post("/upload-syllabus")
async def upload_syllabus(file: UploadFile = File(...)) -> Dict[str, Any]:
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    with tempfile.NamedTemporaryFile(suffix=".pdf") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp.flush()
        reader = PdfReader(tmp.name)
        text = "\n".join(page.extract_text() or "" for page in reader.pages)

    if not text.strip():
        raise HTTPException(status_code=400, detail="No readable text found in PDF")

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
            parsed = [{"topic_name": "Syllabus parsed", "difficulty_level": 3, "prerequisites": [], "estimated_mastery_time": 30, "common_misconceptions": ["Needs review"]}]
    else:
        parsed = [{
            "topic_name": "Syllabus uploaded",
            "difficulty_level": 3,
            "prerequisites": [],
            "estimated_mastery_time": 30,
            "common_misconceptions": ["Need more content to produce a full map"]
        }]

    course_id = file.filename.replace(".pdf", "")
    app.state.knowledge_maps[course_id] = parsed
    return {"course_id": course_id, "knowledge_map": parsed}


@app.post("/generate-quiz")
async def generate_quiz(payload: QuizRequest) -> Dict[str, Any]:
    prompt = f"""
You are a Spaced Repetition Quiz Engine.
Create one active-recall question for topic '{payload.topic}' for student '{payload.student_id}'.
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
                "question": f"Explain the main idea behind {payload.topic} in your own words.",
                "expected_answer_keywords": [payload.topic],
                "prerequisite_tested": "Foundational concept",
                "difficulty": "medium"
            }
    else:
        result = {
            "question": f"Explain the main idea behind {payload.topic} in your own words.",
            "expected_answer_keywords": [payload.topic],
            "prerequisite_tested": "Foundational concept",
            "difficulty": "medium"
        }

    app.state.quiz_sessions[payload.student_id] = result
    return result


@app.post("/submit-answer")
async def submit_answer(payload: AnswerSubmission) -> Dict[str, Any]:
    prompt = f"""
You are a Cognitive Diagnostic Engine.
Topic: {payload.topic}
Student answer: {payload.student_answer}
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

    app.state.risk_reports[payload.student_id] = diagnosis
    return diagnosis


@app.post("/risk-dashboard")
async def risk_dashboard(payload: RiskRequest) -> Dict[str, Any]:
    report = {
        "class_id": payload.class_id,
        "risk_level": "YELLOW",
        "students_at_risk": 3,
        "common_gap": "Product Rule",
        "recommended_intervention": "Send a short prerequisite refresher to the 3 at-risk students"
    }
    return report
