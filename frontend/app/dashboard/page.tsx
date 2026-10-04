"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStudentAnalytics } from "@/lib/api";

const STUDENT_ID = "7579270a-4747-4073-9d3f-15516f05f00c";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await getStudentAnalytics(STUDENT_ID);
        setData(result);
      } catch (err) {
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg">Loading CampusIQ...</p>
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

  const student = data.student;
  const analytics = data.analytics;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-blue-400 text-sm font-medium">
            AI-Powered Student Intelligence Platform
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Welcome, {student.name}
          </h1>

          <p className="text-slate-400 mt-2">
            {student.branch} • Semester {student.semester}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* CGPA */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">CGPA</p>

            <h2 className="text-4xl font-bold mt-3">
              {analytics.cgpa}
            </h2>

            <p className="text-green-400 text-sm mt-2">
              Academic Performance
            </p>
          </div>

          {/* Marks */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Average Marks
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {analytics.average_marks}
            </h2>

            <p className="text-blue-400 text-sm mt-2">
              Current Average
            </p>
          </div>

          {/* Attendance */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Attendance
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {analytics.average_attendance}%
            </h2>

            <p className="text-green-400 text-sm mt-2">
              {analytics.attendance_status}
            </p>
          </div>

          {/* Subjects */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Subjects
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {analytics.subjects_count}
            </h2>

            <p className="text-purple-400 text-sm mt-2">
              Current Semester
            </p>
          </div>

        </div>

        {/* Academic Status */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-xl font-semibold">
            Academic Intelligence
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mt-6">

            <div>
              <p className="text-slate-400 text-sm">
                Academic Status
              </p>

              <p className="text-2xl font-semibold text-green-400 mt-2">
                {analytics.academic_status}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Attendance Status
              </p>

              <p className="text-2xl font-semibold text-green-400 mt-2">
                {analytics.attendance_status}
              </p>
            </div>

          </div>
        </div>

        {/* Student Information */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-xl font-semibold">
            Student Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

            <div>
              <p className="text-slate-400 text-sm">
                Enrollment Number
              </p>

              <p className="mt-2 font-medium">
                {student.enrollment_number}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Branch
              </p>

              <p className="mt-2 font-medium">
                {student.branch}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Semester
              </p>

              <p className="mt-2 font-medium">
                {student.semester}
              </p>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}