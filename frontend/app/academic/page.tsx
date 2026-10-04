"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

const STUDENT_ID = "7579270a-4747-4073-9d3f-15516f05f00c";

interface AcademicRecord {
  id: string;
  student_id: string;
  subject_id: string;
  marks: number;
  grade: string;
  grade_points: number;
  semester: number;
  academic_year: string;
  subjects?: {
    subject_code: string;
    subject_name: string;
    credits: number;
  };
}

export default function AcademicPage() {
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAcademicData() {
      try {
        const response = await fetch(
          `${API_URL}/students/${STUDENT_ID}/academic`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch academic data");
        }

        const data = await response.json();
        setRecords(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load academic data.");
      } finally {
        setLoading(false);
      }
    }

    fetchAcademicData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] text-white p-10">
        <div className="flex items-center justify-center min-h-[70vh]">
          <p className="text-blue-400 text-lg">
            Loading academic intelligence...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#020617] text-white p-10">
        <div className="flex items-center justify-center min-h-[70vh]">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </main>
    );
  }

  const averageMarks =
    records.length > 0
      ? records.reduce((sum, record) => sum + Number(record.marks), 0) /
        records.length
      : 0;

  const averageGradePoints =
    records.length > 0
      ? records.reduce(
          (sum, record) => sum + Number(record.grade_points),
          0
        ) / records.length
      : 0;

  const highestMarks =
    records.length > 0
      ? Math.max(...records.map((record) => Number(record.marks)))
      : 0;

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      {/* Header */}
      <section className="px-8 pt-10 pb-6">
        <p className="text-blue-400 text-sm font-medium">
          AI-Powered Student Intelligence Platform
        </p>

        <h1 className="text-4xl font-bold mt-2">
          Academic Intelligence
        </h1>

        <p className="text-slate-400 mt-2">
          Analyze your academic performance, grades and subject-wise progress.
        </p>
      </section>

      {/* Summary Cards */}
      <section className="px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm">Average Marks</p>
          <h2 className="text-4xl font-bold mt-3">
            {averageMarks.toFixed(1)}
          </h2>
          <p className="text-blue-400 mt-2">Current Performance</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm">Grade Points</p>
          <h2 className="text-4xl font-bold mt-3">
            {averageGradePoints.toFixed(1)}
          </h2>
          <p className="text-green-400 mt-2">Average Grade Point</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm">Highest Marks</p>
          <h2 className="text-4xl font-bold mt-3">
            {highestMarks}
          </h2>
          <p className="text-purple-400 mt-2">Best Subject Score</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm">Subjects</p>
          <h2 className="text-4xl font-bold mt-3">
            {records.length}
          </h2>
          <p className="text-cyan-400 mt-2">Current Semester</p>
        </div>
      </section>

      {/* Academic Overview */}
      <section className="px-8 mt-8">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-7">
          <h2 className="text-2xl font-bold">
            Academic Overview
          </h2>

          <p className="text-slate-400 mt-2">
            Your current academic performance based on available records.
          </p>

          <div className="mt-6 bg-[#0f172a] rounded-xl p-5">
            <div className="flex justify-between mb-3">
              <span className="text-slate-300">
                Overall Performance
              </span>

              <span className="text-green-400 font-semibold">
                {averageMarks >= 80
                  ? "Excellent"
                  : averageMarks >= 60
                  ? "Good"
                  : "Needs Improvement"}
              </span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{
                  width: `${Math.min(averageMarks, 100)}%`,
                }}
              />
            </div>

            <p className="text-slate-500 text-sm mt-2">
              {averageMarks.toFixed(1)} / 100
            </p>
          </div>
        </div>
      </section>

      {/* Subject Performance */}
      <section className="px-8 mt-8 pb-10">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-7">
          <h2 className="text-2xl font-bold">
            Subject Performance
          </h2>

          <p className="text-slate-400 mt-2 mb-6">
            Detailed performance across your subjects.
          </p>

          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-[#0f172a] border border-slate-800 rounded-xl p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {record.subjects?.subject_name ||
                        "Unknown Subject"}
                    </h3>

                    <p className="text-slate-500 text-sm mt-1">
                      {record.subjects?.subject_code || "N/A"}
                      {" • "}
                      {record.subjects?.credits || 0} Credits
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                      <p className="text-slate-500 text-xs">
                        Marks
                      </p>
                      <p className="text-xl font-bold text-blue-400">
                        {record.marks}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500 text-xs">
                        Grade
                      </p>
                      <p className="text-xl font-bold text-green-400">
                        {record.grade}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500 text-xs">
                        Grade Point
                      </p>
                      <p className="text-xl font-bold text-purple-400">
                        {record.grade_points}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500">
                      Performance
                    </span>

                    <span className="text-slate-400">
                      {record.marks}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          Number(record.marks),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}