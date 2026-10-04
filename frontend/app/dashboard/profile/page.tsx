"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";
const STUDENT_ID = "7579270a-4747-4073-9d3f-15516f05f00c";

interface ProfileData {
  student: {
    id: string;
    name: string;
    branch: string;
    semester: number;
    cgpa: number;
  };
  analytics: {
    cgpa: number;
    average_marks: number;
    average_attendance: number;
    subjects_count: number;
    academic_status: string;
    attendance_status: string;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(
          `${API_URL}/students/${STUDENT_ID}/analytics`
        );

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();

        setProfile(data);
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg text-slate-300">
          Loading Profile...
        </p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">
          Unable to load profile information.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-blue-400 text-sm font-medium">
            AI-Powered Student Intelligence Platform
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Student Profile
          </h1>

          <p className="text-slate-400 mt-2">
            View your academic information and current student profile.
          </p>
        </div>

        {/* Basic Student Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <div className="flex justify-between items-start">

            <div>
              <h2 className="text-2xl font-semibold">
                {profile.student.name}
              </h2>

              <p className="text-slate-400 mt-2">
                {profile.student.branch} • Semester{" "}
                {profile.student.semester}
              </p>
            </div>

            <div className="text-right">

              <p className="text-slate-400 text-sm">
                CGPA
              </p>

              <p className="text-3xl font-bold text-green-400">
                {profile.student.cgpa}
              </p>

            </div>

          </div>

        </div>

        {/* Academic Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          {/* Branch */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Branch
            </p>

            <p className="text-2xl font-bold mt-2">
              {profile.student.branch}
            </p>

          </div>

          {/* Semester */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Semester
            </p>

            <p className="text-2xl font-bold mt-2">
              {profile.student.semester}
            </p>

          </div>

          {/* Average Marks */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Average Marks
            </p>

            <p className="text-2xl font-bold text-blue-400 mt-2">
              {profile.analytics.average_marks}
            </p>

          </div>

          {/* Attendance */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Attendance
            </p>

            <p className="text-2xl font-bold text-green-400 mt-2">
              {profile.analytics.average_attendance}%
            </p>

          </div>

        </div>

        {/* Academic Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <h2 className="text-2xl font-semibold">
            Academic Status
          </h2>

          <p className="text-slate-400 mt-2 mb-6">
            Current academic performance based on your records.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Academic Performance */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <p className="text-slate-400 text-sm">
                Academic Performance
              </p>

              <p className="text-xl font-semibold text-green-400 mt-2">
                {profile.analytics.academic_status}
              </p>

            </div>

            {/* Attendance Status */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <p className="text-slate-400 text-sm">
                Attendance Status
              </p>

              <p className="text-xl font-semibold text-blue-400 mt-2">
                {profile.analytics.attendance_status}
              </p>

            </div>

            {/* Subjects */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <p className="text-slate-400 text-sm">
                Subjects Recorded
              </p>

              <p className="text-xl font-semibold mt-2">
                {profile.analytics.subjects_count}
              </p>

            </div>

          </div>

        </div>

        {/* Profile Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">

          <h2 className="text-2xl font-semibold">
            Profile Summary
          </h2>

          <p className="text-slate-400 mt-2 mb-6">
            Overview of your current academic profile.
          </p>

          <div className="space-y-4">

            <div className="flex justify-between border-b border-slate-800 pb-4">
              <span className="text-slate-400">
                Student Name
              </span>

              <span className="font-medium">
                {profile.student.name}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-4">
              <span className="text-slate-400">
                Branch
              </span>

              <span className="font-medium">
                {profile.student.branch}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-4">
              <span className="text-slate-400">
                Semester
              </span>

              <span className="font-medium">
                {profile.student.semester}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-4">
              <span className="text-slate-400">
                CGPA
              </span>

              <span className="font-medium text-green-400">
                {profile.student.cgpa}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-4">
              <span className="text-slate-400">
                Average Marks
              </span>

              <span className="font-medium text-blue-400">
                {profile.analytics.average_marks}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">
                Attendance
              </span>

              <span className="font-medium text-green-400">
                {profile.analytics.average_attendance}%
              </span>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}