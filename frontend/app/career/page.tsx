"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

const STUDENT_ID = "7579270a-4747-4073-9d3f-15516f05f00c";

interface CareerData {
  student: {
    id: string;
    name: string;
    branch: string;
    semester: number;
    cgpa: number;
  };

  career_strength: number;
  average_marks: number;
  skills: string[];
  target_roles: string[];
  recommended_roles: string[];
  skill_gaps: string[];
}

export default function CareerPage() {
  const [career, setCareer] = useState<CareerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCareerData() {
      try {
        const response = await fetch(
          `${API_URL}/students/${STUDENT_ID}/career`
        );

        if (!response.ok) {
          throw new Error("Failed to load career data");
        }

        const data: CareerData = await response.json();

        setCareer(data);
      } catch (error) {
        console.error("Career data error:", error);
        setError("Unable to load career information.");
      } finally {
        setLoading(false);
      }
    }

    loadCareerData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg">Loading Career Intelligence...</p>
      </main>
    );
  }

  if (error || !career) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">
          {error || "Unable to load career information."}
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
            Career Intelligence
          </h1>

          <p className="text-slate-400 mt-2">
            Discover suitable career paths, identify skill gaps and
            prepare for your target roles.
          </p>
        </div>

        {/* Student Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h2 className="text-xl font-semibold">
                {career.student.name}
              </h2>

              <p className="text-slate-400 mt-1">
                {career.student.branch} • Semester {career.student.semester}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                CGPA
              </p>

              <p className="text-2xl font-bold text-green-400">
                {career.student.cgpa}
              </p>
            </div>

          </div>
        </div>

        {/* Profile Strength */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <div className="flex justify-between items-center mb-4">

            <div>
              <h2 className="text-xl font-semibold">
                Career Profile Strength
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Based on your current skills and career profile.
              </p>
            </div>

            <span className="text-3xl font-bold text-blue-400">
              {career.career_strength}%
            </span>

          </div>

          <div className="w-full bg-slate-700 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${career.career_strength}%`,
              }}
            />
          </div>

        </div>

        {/* Target Roles + Recommended Roles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Target Roles */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">

            <h2 className="text-xl font-semibold">
              Target Career Roles
            </h2>

            <p className="text-slate-400 text-sm mt-2 mb-5">
              Roles aligned with your career interests.
            </p>

            <div className="space-y-3">
              {career.target_roles.map((role) => (
                <div
                  key={role}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4"
                >
                  <p className="font-medium text-white">
                    {role}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* Recommended Roles */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">

            <h2 className="text-xl font-semibold">
              Recommended Roles
            </h2>

            <p className="text-slate-400 text-sm mt-2 mb-5">
              Roles recommended based on your current profile.
            </p>

            <div className="space-y-3">
              {career.recommended_roles.map((role) => (
                <div
                  key={role}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4"
                >
                  <p className="font-medium text-blue-400">
                    {role}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Current Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <h2 className="text-2xl font-semibold">
            Current Skills
          </h2>

          <p className="text-slate-400 mt-2 mb-6">
            Technical skills currently present in your profile.
          </p>

          <div className="flex flex-wrap gap-3">

            {career.skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400"
              >
                {skill}
              </span>
            ))}

          </div>

        </div>

        {/* Skill Gap */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">

          <h2 className="text-2xl font-semibold">
            Skill Gap Analysis
          </h2>

          <p className="text-slate-400 mt-2 mb-6">
            Skills recommended to improve your readiness for
            target roles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {career.skill_gaps.map((skill) => (
              <div
                key={skill}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5"
              >

                <p className="text-yellow-400 font-medium">
                  {skill}
                </p>

                <p className="text-slate-500 text-sm mt-2">
                  Recommended skill
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>
    </main>
  );
}