import React, { useState } from 'react';

export default function StudentPortal() {
  const [gapAlert, setGapAlert] = useState(true);

  const heatmapData = [
    { topic: 'Vectors', mastery: 90 },
    { topic: 'Dot Product', mastery: 85 },
    { topic: 'Cross Product', mastery: 72 },
    { topic: 'Lines & Planes', mastery: 41 },
    { topic: 'Vector Functions', mastery: 32 },
    { topic: 'Arc Length', mastery: 58 },
    { topic: 'Partial Derivs', mastery: 80 },
    { topic: 'Chain Rule', mastery: 46 },
    { topic: 'Gradients', mastery: 18 },
    { topic: 'Double Integrals', mastery: 12 },
  ];

  const groupMembers = [
    { name: 'David O.', progress: '92%', status: 'On track' },
    { name: 'Chioma A.', progress: '86%', status: 'Reviewing' },
    { name: 'Emmanuel K.', progress: '74%', status: 'Needs nudge' },
  ];

  const getColor = (mastery) => {
    if (mastery >= 75) return 'bg-emerald-500';
    if (mastery >= 40) return 'bg-amber-400';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-studyblue">Calculus III • MTH 201</p>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, Chioma</h1>
          <p className="mt-1 text-sm text-slate-500">6 weeks to your exams • your next review is already queued</p>
        </div>
        <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-center">
          <div className="text-2xl font-bold text-orange-600">🔥 12</div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Day streak</div>
        </div>
      </div>

      {gapAlert && (
        <div className="flex flex-col gap-4 rounded-[24px] border border-red-200 bg-red-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-100 p-2 text-red-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-red-800">Prerequisite gap detected</h2>
              <p className="text-sm text-red-700">You missed a key step in <span className="font-semibold">Gradients</span>. The likely missing concept is <span className="font-semibold">Product Rule</span>.</p>
            </div>
          </div>
          <button
            onClick={() => setGapAlert(false)}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Fix it now • 3 mins
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] bg-gradient-to-br from-studyblue to-blue-700 p-6 text-white shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">Today’s mini challenge</p>
          <h2 className="mt-2 text-2xl font-bold">2-minute active recall quiz</h2>
          <p className="mt-3 max-w-md text-sm text-blue-100">
            You’re about to forget <span className="font-semibold text-white">Vector Functions</span>. Answer this now and lock it in before the forgetting curve hits.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button className="rounded-full bg-white px-5 py-3 font-semibold text-studyblue transition hover:bg-blue-50">
              Start quiz
            </button>
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-2 text-sm">Estimated time: 2 mins</span>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Your progress</p>
              <h3 className="text-xl font-bold text-slate-900">77% course readiness</h3>
            </div>
            <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Improving</div>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-sm text-slate-600">
                <span>Daily quiz completion</span>
                <span>82%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[82%] rounded-full bg-studyblue" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm text-slate-600">
                <span>Prerequisite recovery</span>
                <span>68%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[68%] rounded-full bg-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Mastery heatmap</h2>
            <p className="text-sm text-slate-500">A simple view of what you know and what needs review</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Weak</span>
            <div className="h-3 w-3 rounded-sm bg-red-500" />
            <div className="h-3 w-3 rounded-sm bg-amber-400" />
            <div className="h-3 w-3 rounded-sm bg-emerald-500" />
            <span>Strong</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {heatmapData.map((item, index) => (
            <div key={index} className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <div className={`flex h-12 w-full items-center justify-center rounded-xl ${getColor(item.mastery)} font-semibold text-white`}>
                {item.mastery}%
              </div>
              <span className="mt-2 text-center text-xs text-slate-600">{item.topic}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Study group</h2>
          <span className="rounded-full bg-studyblue/10 px-3 py-1 text-sm font-semibold text-studyblue">Friends are improving</span>
        </div>
        <div className="space-y-3">
          {groupMembers.map((member, index) => (
            <div key={member.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-studyblue/15 font-semibold text-studyblue">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.status}</p>
                </div>
              </div>
              <div className="text-sm font-semibold text-slate-700">{member.progress} mastery</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
