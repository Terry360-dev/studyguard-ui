const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function uploadSyllabus(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload-syllabus`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Syllabus upload failed');
  }

  return response.json();
}

export async function generateQuiz(studentId, topic) {
  const response = await fetch(`${API_BASE_URL}/generate-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, topic }),
  });

  if (!response.ok) {
    throw new Error('Quiz generation failed');
  }

  return response.json();
}

export async function submitAnswer(studentId, topic, answer) {
  const response = await fetch(`${API_BASE_URL}/submit-answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, topic, student_answer: answer }),
  });

  if (!response.ok) {
    throw new Error('Answer submission failed');
  }

  return response.json();
}

export async function getRiskDashboard(classId) {
  const response = await fetch(`${API_BASE_URL}/risk-dashboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ class_id: classId }),
  });

  if (!response.ok) {
    throw new Error('Risk dashboard failed');
  }

  return response.json();
}
