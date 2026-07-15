import React, { useState } from 'react';
import StudentPortal from './components/StudentPortal';
import TeacherPortal from './components/TeacherPortal';

export default function App() {
  const [view, setView] = useState('student');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-studyblue">AI Exam Prevention</p>
            <h1 className="text-2xl font-bold text-slate-900">StudyGuard</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setView('student')}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                view === 'student' ? 'bg-studyblue text-white shadow-sm' : 'text-slate-600 hover:bg-white'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setView('teacher')}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                view === 'teacher' ? 'bg-studyblue text-white shadow-sm' : 'text-slate-600 hover:bg-white'
              }`}
            >
              Teacher / Admin
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {view === 'student' ? <StudentPortal /> : <TeacherPortal />}
      </main>
    </div>
  );
}
