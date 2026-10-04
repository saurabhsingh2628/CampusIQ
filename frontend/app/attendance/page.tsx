"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";
const STUDENT_ID = "7579270a-4747-4073-9d3f-15516f05f00c";

interface AttendanceRecord {
  id: string;
  student_id: string;
  subject_id: string;
  classes_attended: number;
  total_classes: number;
  attendance_percentage: number;
  subjects?: {
    subject_code: string;
    subject_name: string;
    credits: number;
  };
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAttendance() {
      try {
        const response = await fetch(
          `${API_URL}/students/${STUDENT_ID}/attendance`
        );

        if (!response.ok) {
          throw new Error("Failed to load attendance");
        }

        const data = await response.json();
        setRecords(data);
      } catch (err) {
        setError("Unable to load attendance data.");
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg">Loading attendance...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </main>
    );
  }

  const overallAttendance =
    records.length > 0
      ? records.reduce(
          (sum, record) => sum + record.attendance_percentage,
          0
        ) / records.length
      : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-blue-400 text-sm font-medium">
            AI-Powered Student Intelligence Platform
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Attendance Intelligence
          </h1>

          <p className="text-slate-400 mt-2">
            Monitor your attendance and subject-wise participation.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          {/* Overall Attendance */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Overall Attendance
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {overallAttendance.toFixed(1)}%
            </h2>

            <p className="text-green-400 text-sm mt-2">
              {overallAttendance >= 75 ? "Good Standing" : "Below Requirement"}
            </p>
          </div>

          {/* Subjects */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Subjects
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {records.length}
            </h2>

            <p className="text-blue-400 text-sm mt-2">
              Current Semester
            </p>
          </div>

          {/* Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Attendance Status
            </p>

            <h2
              className={`text-4xl font-bold mt-3 ${
                overallAttendance >= 75
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {overallAttendance >= 75 ? "Good" : "Low"}
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Based on current records
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Overall Attendance
            </h2>

            <span className="text-blue-400 font-semibold">
              {overallAttendance.toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{
                width: `${Math.min(overallAttendance, 100)}%`,
              }}
            />
          </div>

          <p className="text-slate-400 text-sm mt-3">
            Minimum recommended attendance: 75%
          </p>
        </div>

        {/* Subject Attendance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">

          <h2 className="text-2xl font-semibold">
            Subject-wise Attendance
          </h2>

          <p className="text-slate-400 mt-2 mb-6">
            Detailed attendance across your subjects.
          </p>

          <div className="space-y-5">

            {records.map((record) => (
              <div
                key={record.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5"
              >

                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="text-lg font-semibold">
                      {record.subjects?.subject_name ||
                        "Unknown Subject"}
                    </h3>

                    <p className="text-slate-400 text-sm mt-1">
                      {record.subjects?.subject_code || "N/A"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-400">
                      {record.attendance_percentage.toFixed(1)}%
                    </p>

                    <p className="text-slate-400 text-sm">
                      {record.classes_attended} /{" "}
                      {record.total_classes} classes
                    </p>
                  </div>

                </div>

                {/* Progress */}
                <div className="mt-5">

                  <div className="w-full bg-slate-700 rounded-full h-3">

                    <div
                      className={`h-3 rounded-full ${
                        record.attendance_percentage >= 75
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          record.attendance_percentage,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-slate-500">
                      Attendance
                    </span>

                    <span
                      className={
                        record.attendance_percentage >= 75
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {record.attendance_percentage >= 75
                        ? "Safe"
                        : "Needs Attention"}
                    </span>
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </main>
  );
}