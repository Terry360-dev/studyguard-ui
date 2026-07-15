const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000');

const MOCK_KNOWLEDGE_MAP = [
  {
    topic_name: 'Calculus Foundations',
    difficulty_level: 3,
    prerequisites: ['Algebra'],
    estimated_mastery_time: 25,
    common_misconceptions: ['Forgetting the chain rule', 'Mixing up derivative notation']
  }
];

const MOCK_QUIZ = {
  question: 'Explain the main idea behind Calculus Foundations in your own words.',
  expected_answer_keywords: ['derivative', 'rate of change'],
  prerequisite_tested: 'Algebra fluency',
  difficulty: 'medium'
};

const MOCK_DIAGNOSIS = {
  diagnosed_gap: 'Algebra fluency',
  confidence: 0.72,
  reasoning: 'The student appears to be missing a prerequisite concept that blocks this topic.',
  remediation_micro_lesson: 'Review one algebra prerequisite for 3 minutes, then answer one short practice question.',
  estimated_recovery_time: '10 minutes'
};

const MOCK_RISK_REPORT = {
  class_id: 'demo-class',
  risk_level: 'YELLOW',
  students_at_risk: 3,
  common_gap: 'Algebra fluency',
  recommended_intervention: 'Send a short prerequisite refresher to the at-risk students.'
};

async function requestJson(path, options, fallbackValue) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return fallbackValue;
  }
}

export async function uploadSyllabus(file) {
  const formData = new FormData();
  formData.append('file', file);

  return requestJson('/upload-syllabus', {
    method: 'POST',
    body: formData,
  }, {
    course_id: file.name.replace('.pdf', ''),
    knowledge_map: MOCK_KNOWLEDGE_MAP,
  });
}

export async function generateQuiz(studentId, topic) {
  return requestJson('/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, topic }),
  }, MOCK_QUIZ);
}

export async function submitAnswer(studentId, topic, answer) {
  return requestJson('/submit-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, topic, student_answer: answer }),
  }, MOCK_DIAGNOSIS);
}

export async function getRiskDashboard(classId) {
  return requestJson('/risk-dashboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ class_id: classId }),
  }, MOCK_RISK_REPORT);
}
