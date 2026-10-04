"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

const STUDENT_ID = "7579270a-4747-4073-9d3f-15516f05f00c";

interface PlacementData {
  student: {
    name: string;
    branch: string;
    semester: number;
    cgpa: number;
  };

  placement_readiness: number;

  eligible_companies: string[];

  applications: number;

  shortlisted: number;

  interviews: number;

  offers: number;

  preparation: {
    DSA: number;
    Aptitude: number;
    Communication: number;
    Resume: number;
  };

  skill_gaps: string[];
}

export default function PlacementPage() {
  const [placement, setPlacement] =
    useState<PlacementData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlacementData() {
      try {
        const response = await fetch(
          `${API_URL}/students/${STUDENT_ID}/placement`
        );

        if (!response.ok) {
          throw new Error("Failed to load placement data");
        }

        const data = await response.json();

        setPlacement(data);
      } catch (error) {
        console.error("Placement data error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPlacementData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg">
          Loading Placement Intelligence...
        </p>
      </main>
    );
  }

  if (!placement) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">
          Unable to load placement information.
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
            Placement Intelligence
          </h1>

          <p className="text-slate-400 mt-2">
            Track placement readiness, company eligibility,
            applications and interview preparation.
          </p>
        </div>

        {/* Student Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                {placement.student.name}
              </h2>

              <p className="text-slate-400 mt-1">
                {placement.student.branch} • Semester{" "}
                {placement.student.semester}
              </p>
            </div>

            <div className="text-right">
              <p className="text-slate-400 text-sm">
                CGPA
              </p>

              <p className="text-2xl font-bold text-green-400">
                {placement.student.cgpa}
              </p>
            </div>
          </div>
        </div>

        {/* Placement Readiness */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                Placement Readiness
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Overall preparation for campus placements.
              </p>
            </div>

            <span className="text-3xl font-bold text-blue-400">
              {placement.placement_readiness}%
            </span>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{
                width: `${placement.placement_readiness}%`,
              }}
            />
          </div>

        </div>

        {/* Placement Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Eligible Companies */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Eligible Companies
            </p>

            <p className="text-3xl font-bold text-blue-400 mt-2">
              {placement.eligible_companies.length}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Based on current profile
            </p>
          </div>

          {/* Applications */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Applications
            </p>

            <p className="text-3xl font-bold text-purple-400 mt-2">
              {placement.applications}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Companies applied
            </p>
          </div>

          {/* Shortlisted */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Shortlisted
            </p>

            <p className="text-3xl font-bold text-green-400 mt-2">
              {placement.shortlisted}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Current shortlist
            </p>
          </div>

        </div>

        {/* Eligible Companies */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <h2 className="text-2xl font-semibold">
            Eligible Companies
          </h2>

          <p className="text-slate-400 mt-2 mb-6">
            Companies matching your current academic profile.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {placement.eligible_companies.map((company) => (
              <div
                key={company}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5"
              >
                <p className="text-blue-400 font-medium">
                  {company}
                </p>

                <p className="text-slate-500 text-sm mt-2">
                  Eligible
                </p>
              </div>
            ))}

          </div>

        </div>

        {/* Interview Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <h2 className="text-2xl font-semibold">
            Interview Status
          </h2>

          <p className="text-slate-400 mt-2 mb-6">
            Track your current placement progress.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Shortlisted */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-400">
                Shortlisted
              </p>

              <p className="text-3xl font-bold text-green-400 mt-2">
                {placement.shortlisted}
              </p>
            </div>

            {/* Interviews */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-400">
                Interviews
              </p>

              <p className="text-3xl font-bold text-blue-400 mt-2">
                {placement.interviews}
              </p>
            </div>

            {/* Offers */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-400">
                Offers
              </p>

              <p className="text-3xl font-bold text-purple-400 mt-2">
                {placement.offers}
              </p>
            </div>

          </div>

        </div>

        {/* Preparation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <h2 className="text-2xl font-semibold">
            Placement Preparation
          </h2>

          <p className="text-slate-400 mt-2 mb-6">
            Your preparation level across important placement areas.
          </p>

          <div className="space-y-6">

            {Object.entries(placement.preparation).map(
              ([skill, score]) => (
                <div key={skill}>

                  <div className="flex justify-between mb-2">
                    <span>
                      {skill}
                    </span>

                    <span className="text-blue-400">
                      {score}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{
                        width: `${score}%`,
                      }}
                    />
                  </div>

                </div>
              )
            )}

          </div>

        </div>

        {/* Skill Gaps */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">

          <h2 className="text-2xl font-semibold">
            Placement Skill Gaps
          </h2>

          <p className="text-slate-400 mt-2 mb-6">
            Skills recommended to improve placement readiness.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {placement.skill_gaps.map((skill) => (
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