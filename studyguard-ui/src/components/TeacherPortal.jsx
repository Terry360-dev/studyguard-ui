import React, { useState } from 'react';

export default function TeacherPortal() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = [
    { id: 1, name: 'Emmanuel K.', risk: 'RED', score: 22, gap: 'Product Rule (Calc I)', completion: '45%', trend: 'Dropping' },
    { id: 2, name: 'Sarah M.', risk: 'RED', score: 34, gap: 'Basic Integration', completion: '50%', trend: 'Declining' },
    { id: 3, name: 'David O.', risk: 'YELLOW', score: 64, gap: 'Chain Rule', completion: '80%', trend: 'Stable' },
    { id: 4, name: 'Chioma A.', risk: 'GREEN', score: 92, gap: 'None', completion: '100%', trend: 'Improving' },
    { id: 5, name: 'Oluwaseun B.', risk: 'GREEN', score: 88, gap: 'None', completion: '95%', trend: 'Improving' },
  ];

  const topicRisks = [
    { topic: 'Product Rule', students: 8, severity: 'High' },
    { topic: 'Chain Rule', students: 6, severity: 'Medium' },
    { topic: 'Vector Functions', students: 5, severity: 'Medium' },
  ];

  const getRiskColor = (risk) => {
    if (risk === 'RED') return 'border-red-200 bg-red-50 text-red-700';
    if (risk === 'YELLOW') return 'border-amber-200 bg-amber-50 text-amber-700';
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  };

  const handleExport = () => {
    const rows = [
      ['student', 'risk', 'completion', 'detected_gap'],
      ...students.map((student) => [student.name, student.risk, student.completion, student.gap]),
    ];
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'studyguard_interventions.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-studyblue">MTH 201 • Calculus III</p>
          <h1 className="text-3xl font-bold text-slate-900">Class risk dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">42 students enrolled • intervention window: next 14 days</p>
        </div>
        <button
          onClick={handleExport}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Export CSV
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Class average mastery</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">76%</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">High-risk students</p>
          <p className="mt-2 text-3xl font-bold text-red-600">8</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Most common gap</p>
          <p className="mt-2 text-xl font-bold text-amber-600">Product Rule</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Student risk matrix</h2>
            <p className="text-sm text-slate-500">Tap a student to inspect the exact gap and send a nudge</p>
          </div>
        </div>
        <div className="space-y-3">
          {students.map((student) => (
            <div key={student.id} className={`rounded-[20px] border p-4 transition ${selectedStudent?.id === student.id ? 'border-studyblue bg-blue-50/60' : 'border-slate-200 bg-white'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${student.risk === 'RED' ? 'bg-red-500' : student.risk === 'YELLOW' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                  <div>
                    <p className="font-semibold text-slate-800">{student.name}</p>
                    <p className="text-sm text-slate-500">Quiz completion: {student.completion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getRiskColor(student.risk)}`}>{student.risk} risk</span>
                  <button
                    onClick={() => setSelectedStudent(student.id === selectedStudent?.id ? null : student)}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    {selectedStudent?.id === student.id ? 'Hide' : 'Inspect'}
                  </button>
                </div>
              </div>

              {selectedStudent?.id === student.id && (
                <div className="mt-4 grid gap-4 rounded-[16px] border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Detected gap</p>
                    <p className="mt-1 font-semibold text-slate-800">{student.gap}</p>
                    <p className="mt-1 text-sm text-slate-500">Trend: {student.trend}</p>
                  </div>
                  <div className="flex items-center">
                    {student.risk !== 'GREEN' && (
                      <button className="rounded-full bg-studyblue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                        Send nudge
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Class overview</h2>
        <p className="mt-1 text-sm text-slate-500">The topics the whole class is struggling with right now</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {topicRisks.map((item) => (
            <div key={item.topic} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">{item.topic}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{item.students} students</p>
              <p className="mt-1 text-sm text-slate-500">Severity: {item.severity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
