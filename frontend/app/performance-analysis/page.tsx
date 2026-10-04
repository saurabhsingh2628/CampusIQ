"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";
const STUDENT_ID = "7579270a-4747-4073-9d3f-15516f05f00c";

interface PerformanceAnalysisData {
  student: {
    id: string;
    name: string;
    branch: string;
    semester: number;
    cgpa: number;
    enrollment_number?: string;
  };
  overall_performance_score: number;
  academic_assessment: string;
  attendance_assessment: string;
  overall_status: string;
  risk_level: string;
  metrics: {
    cgpa: number;
    average_marks: number;
    average_attendance: number;
    subjects_count: number;
  };
  strengths: string[];
  weaknesses: string[];
  key_insights: string[];
  recommendations: string[];
  suggested_next_actions: string[];
}

export default function PerformanceAnalysisPage() {
  const [data, setData] = useState<PerformanceAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalysis() {
      try {
        const response = await fetch(
          `${API_URL}/students/${STUDENT_ID}/performance-analysis`
        );

        if (!response.ok) {
          throw new Error("Failed to load performance analysis");
        }

        const result: PerformanceAnalysisData = await response.json();
        setData(result);
      } catch (err) {
        console.error("Performance analysis error:", err);
        setError("Unable to load performance analysis data.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg text-slate-300">Loading AI Performance Analysis...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">{error || "Unable to load performance analysis."}</p>
      </main>
    );
  }

  const { student, metrics } = data;

  // Determine risk badge color
  const riskColor =
    data.risk_level === "Low"
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : data.risk_level === "Moderate"
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-red-400 border-red-500/30 bg-red-500/10";

  // Determine status color
  const statusColor =
    data.overall_status === "Distinction"
      ? "text-blue-400 border-blue-500/30 bg-blue-500/10"
      : data.overall_status === "Good Standing"
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : data.overall_status === "Needs Improvement"
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-red-400 border-red-500/30 bg-red-500/10";

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-block rounded-full border border-blue-400/20 bg-blue-400/10 px-3.5 py-1 text-xs font-medium text-blue-300">
            AI-Powered Student Intelligence Platform
          </div>

          <h1 className="text-4xl font-bold mt-3">
            AI Performance Analysis
          </h1>

          <p className="text-slate-400 mt-2">
            Deterministic diagnostic analysis synthesizing academic rigor, attendance consistency, risk indicators, and growth pathways.
          </p>
        </div>

        {/* Student Profile Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-slate-400 mt-1">
                {student.branch} • Semester {student.semester}
                {student.enrollment_number ? ` • Enrollment: ${student.enrollment_number}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold ${statusColor}`}>
                Status: {data.overall_status}
              </div>

              <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold ${riskColor}`}>
                Risk: {data.risk_level}
              </div>
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Overall Performance Score */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm font-medium">Performance Score</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-4xl font-bold text-blue-400">
                {data.overall_performance_score}
              </h3>
              <span className="text-slate-500 text-sm">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 mt-3">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(data.overall_performance_score, 100)}%` }}
              />
            </div>
            <p className="text-slate-400 text-xs mt-2">Multi-factor weighted index</p>
          </div>

          {/* Cumulative CGPA */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm font-medium">Cumulative CGPA</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-4xl font-bold text-emerald-400">
                {metrics.cgpa.toFixed(2)}
              </h3>
              <span className="text-slate-500 text-sm">/ 10.0</span>
            </div>
            <p className="text-slate-400 text-xs mt-4">
              Avg Exam Score: <span className="text-white font-medium">{metrics.average_marks}%</span>
            </p>
          </div>

          {/* Average Attendance */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm font-medium">Average Attendance</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className={`text-4xl font-bold ${metrics.average_attendance >= 75 ? "text-emerald-400" : "text-red-400"}`}>
                {metrics.average_attendance.toFixed(1)}%
              </h3>
            </div>
            <p className="text-slate-400 text-xs mt-4">
              {metrics.average_attendance >= 75 ? "Above 75% threshold" : "Below 75% threshold"}
            </p>
          </div>

          {/* Registered Subjects */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm font-medium">Coursework Load</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-4xl font-bold text-purple-400">
                {metrics.subjects_count}
              </h3>
              <span className="text-slate-500 text-sm">Subjects</span>
            </div>
            <p className="text-slate-400 text-xs mt-4">
              Current Semester {student.semester}
            </p>
          </div>
        </div>

        {/* Academic & Attendance Assessments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <h3 className="text-xl font-semibold">Academic Performance Assessment</h3>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm mt-3">
              {data.academic_assessment}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="text-xl font-semibold">Attendance Assessment</h3>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm mt-3">
              {data.attendance_assessment}
            </p>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
            <h3 className="text-xl font-semibold text-emerald-400 flex items-center gap-2">
              <span>Identified Strengths</span>
            </h3>
            <p className="text-slate-400 text-xs mt-1 mb-5">
              Key positive differentiators observed in coursework & attendance.
            </p>

            <div className="space-y-3">
              {data.strengths.map((strength, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start gap-3"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <p className="text-slate-200 text-sm leading-snug">{strength}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
            <h3 className="text-xl font-semibold text-amber-400 flex items-center gap-2">
              <span>Areas for Improvement</span>
            </h3>
            <p className="text-slate-400 text-xs mt-1 mb-5">
              Identified vulnerabilities or potential performance bottlenecks.
            </p>

            <div className="space-y-3">
              {data.weaknesses.map((weakness, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start gap-3"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-bold">
                    !
                  </span>
                  <p className="text-slate-200 text-sm leading-snug">{weakness}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <h3 className="text-xl font-semibold text-cyan-400">
            Key Diagnostic Insights
          </h3>
          <p className="text-slate-400 text-xs mt-1 mb-5">
            Cross-functional inferences synthesized from semester records.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.key_insights.map((insight, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <p className="text-slate-300 text-sm leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <h3 className="text-xl font-semibold text-blue-400">
            Personalized Recommendations
          </h3>
          <p className="text-slate-400 text-xs mt-1 mb-5">
            Tailored guidance engineered to maximize academic resilience and placement readiness.
          </p>

          <div className="space-y-3">
            {data.recommendations.map((recommendation, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start gap-3.5"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-semibold">
                  {idx + 1}
                </span>
                <p className="text-slate-200 text-sm leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Next Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <h3 className="text-xl font-semibold text-purple-400">
            Suggested Next Actions
          </h3>
          <p className="text-slate-400 text-xs mt-1 mb-5">
            Immediate steps to take over the next 14 days.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.suggested_next_actions.map((action, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start gap-3"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs font-semibold">
                  →
                </span>
                <p className="text-slate-200 text-sm leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
