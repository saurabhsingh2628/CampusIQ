"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";
const STUDENT_ID = "7579270a-4747-4073-9d3f-15516f05f00c";

interface CareerPath {
  id: string;
  title: string;
  match_percentage: number;
  demand_level: string;
  industry: string;
  why_recommended: string;
  matched_skills: string[];
  target_roles: string[];
  salary_range?: string;
}

interface SkillGap {
  skill: string;
  severity: string;
  impact: string;
}

interface PrioritySkill {
  rank: number;
  name: string;
  category: string;
  urgency: string;
  estimated_weeks: number;
  focus_areas: string;
}

interface RoadmapPhase {
  phase: string;
  timeframe: string;
  objective: string;
  milestones: string[];
  outcome: string;
}

interface PlacementAlignment {
  overall_placement_readiness: number;
  eligible_companies: string[];
  tier_1_product_readiness: string;
  tier_2_services_readiness: string;
  preparation_scores: {
    DSA: number;
    Aptitude: number;
    Communication: number;
    Resume: number;
  };
  funnel_summary: {
    applications: number;
    shortlisted: number;
    interviews: number;
    offers: number;
    conversion_rate: string;
  };
  strategic_alignment_note: string;
}

interface CareerAdvisorData {
  student: {
    id: string;
    name: string;
    branch: string;
    semester: number;
    cgpa: number;
    enrollment_number?: string;
  };
  career_readiness_score: number;
  readiness_status: string;
  readiness_summary: string;
  metrics: {
    cgpa: number;
    average_marks: number;
    average_attendance: number;
    career_strength: number;
    placement_readiness: number;
  };
  recommended_career_paths: CareerPath[];
  strengths: string[];
  skill_gaps: SkillGap[];
  priority_skills: PrioritySkill[];
  learning_roadmap: RoadmapPhase[];
  placement_alignment: PlacementAlignment;
  personalized_advice: string[];
  next_actions: string[];
}

export default function CareerAdvisorPage() {
  const [data, setData] = useState<CareerAdvisorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdvisor() {
      try {
        const response = await fetch(
          `${API_URL}/students/${STUDENT_ID}/career-advisor`
        );

        if (!response.ok) {
          throw new Error("Failed to load career advisor data");
        }

        const result: CareerAdvisorData = await response.json();
        setData(result);
      } catch (err) {
        console.error("Career Advisor error:", err);
        setError("Unable to load career advisor data.");
      } finally {
        setLoading(false);
      }
    }

    loadAdvisor();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg text-slate-300">Loading AI Career Advisor...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">{error || "Unable to load career advice."}</p>
      </main>
    );
  }

  const { student, metrics, placement_alignment } = data;

  const scoreBadgeColor =
    data.career_readiness_score >= 80
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : data.career_readiness_score >= 65
      ? "text-blue-400 border-blue-500/30 bg-blue-500/10"
      : "text-amber-400 border-amber-500/30 bg-amber-500/10";

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* 1. Header */}
        <div>
          <div className="inline-block rounded-full border border-blue-400/20 bg-blue-400/10 px-3.5 py-1 text-xs font-medium text-blue-300">
            AI-Powered Student Intelligence Platform
          </div>

          <h1 className="text-4xl font-bold mt-3">
            AI Career Advisor
          </h1>

          <p className="text-slate-400 mt-2">
            Personalized, data-driven career strategy synthesizing coursework mastery, technical skill coverage, placement readiness, and actionable learning milestones.
          </p>
        </div>

        {/* 2. Student Profile Banner */}
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
              <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold ${scoreBadgeColor}`}>
                {data.readiness_status}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Career Readiness Score Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <p className="text-sm font-medium text-blue-400">Composite Readiness Assessment</p>
              <h2 className="text-2xl font-bold mt-1">Career Readiness Score</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                {data.readiness_summary}
              </p>
            </div>

            <div className="flex items-baseline gap-2 bg-slate-950 border border-slate-800 px-6 py-4 rounded-xl">
              <span className="text-5xl font-extrabold text-blue-400">
                {data.career_readiness_score}
              </span>
              <span className="text-slate-500 text-base">/ 100</span>
            </div>
          </div>

          {/* Progress Meter */}
          <div className="mt-6">
            <div className="w-full bg-slate-800 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(data.career_readiness_score, 100)}%` }}
              />
            </div>
          </div>

          {/* Contributing Factor Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400">Academic Standing</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">{metrics.cgpa.toFixed(2)} CGPA</p>
              <p className="text-xs text-slate-500 mt-1">Avg Marks: {metrics.average_marks}%</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400">Placement Readiness</p>
              <p className="text-xl font-bold text-blue-400 mt-1">{metrics.placement_readiness}%</p>
              <p className="text-xs text-slate-500 mt-1">Eligible for 5 Companies</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400">Career Profile Strength</p>
              <p className="text-xl font-bold text-purple-400 mt-1">{metrics.career_strength}%</p>
              <p className="text-xs text-slate-500 mt-1">7 Core Skills Logged</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400">Attendance Discipline</p>
              <p className="text-xl font-bold text-cyan-400 mt-1">{metrics.average_attendance}%</p>
              <p className="text-xs text-slate-500 mt-1">Consistency Metric</p>
            </div>
          </div>
        </div>

        {/* 4. Recommended Career Paths & Why Recommended */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Recommended Career Paths</h2>
              <p className="text-slate-400 text-sm mt-1">
                Data-driven role recommendations aligned with your verified technical competencies and coursework.
              </p>
            </div>
            <span className="text-xs text-slate-500">Sorted by profile match</span>
          </div>

          <div className="space-y-5">
            {data.recommended_career_paths.map((path) => (
              <div
                key={path.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-6 transition hover:border-slate-700"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-white">{path.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        {path.demand_level}
                      </span>
                      {path.salary_range && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {path.salary_range}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs mt-1">Industry: {path.industry}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Profile Match</span>
                    <span className="text-2xl font-bold text-blue-400">{path.match_percentage}%</span>
                  </div>
                </div>

                {/* Match Explanation */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Why This Path Is Recommended
                  </p>
                  <p className="text-sm text-slate-200 mt-1 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                    {path.why_recommended}
                  </p>
                </div>

                {/* Matched Skills & Target Roles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-2">
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Matched Competencies</p>
                    <div className="flex flex-wrap gap-2">
                      {path.matched_skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-2">Target Roles</p>
                    <div className="flex flex-wrap gap-2">
                      {path.target_roles.map((role) => (
                        <span
                          key={role}
                          className="px-2.5 py-1 rounded-md text-xs bg-blue-950/40 border border-blue-800/40 text-blue-300"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Current Strengths & Skill Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Current Strengths */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
            <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              <span>Current Strengths</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1 mb-5">
              Verified competitive differentiators in academics and skill readiness.
            </p>

            <div className="space-y-3">
              {data.strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start gap-3"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <p className="text-slate-200 text-sm leading-snug">{str}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
              <span>Identified Skill Gaps</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1 mb-5">
              Targeted competencies required to qualify for Tier-1 engineering packages.
            </p>

            <div className="space-y-3">
              {data.skill_gaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="font-semibold text-white text-sm">{gap.skill}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded border font-medium ${
                        gap.severity === "Critical"
                          ? "text-red-400 border-red-500/30 bg-red-500/10"
                          : gap.severity === "High"
                          ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                          : "text-blue-400 border-blue-500/30 bg-blue-500/10"
                      }`}
                    >
                      {gap.severity}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{gap.impact}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 6. Priority Skills to Learn */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Priority Skills to Learn</h2>
            <p className="text-slate-400 text-sm mt-1">
              Ranked, high-yield engineering domains with estimated ramp-up timeframes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.priority_skills.map((skill) => (
              <div
                key={skill.rank}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold">
                        #{skill.rank}
                      </span>
                      <h3 className="font-bold text-white text-base">{skill.name}</h3>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                        skill.urgency === "Urgent"
                          ? "text-red-400 border-red-500/30 bg-red-500/10"
                          : skill.urgency === "High"
                          ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                          : "text-blue-400 border-blue-500/30 bg-blue-500/10"
                      }`}
                    >
                      {skill.urgency}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-3">
                    Category: <span className="text-slate-400">{skill.category}</span> • Estimated:{" "}
                    <span className="text-slate-400">{skill.estimated_weeks} weeks</span>
                  </p>

                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                    <p className="text-xs font-medium text-slate-400 mb-1">Target Focus Areas:</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{skill.focus_areas}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Recommended Learning Roadmap */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Recommended Learning Roadmap</h2>
            <p className="text-slate-400 text-sm mt-1">
              Phased, structured 16-week timeline to systematically bridge gaps and maximize placement readiness.
            </p>
          </div>

          <div className="space-y-6">
            {data.learning_roadmap.map((phase, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white">{phase.phase}</h3>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-blue-300 font-medium self-start md:self-auto">
                    {phase.timeframe}
                  </span>
                </div>

                <p className="text-sm text-slate-300 mt-3 font-medium">
                  Objective: <span className="text-slate-400 font-normal">{phase.objective}</span>
                </p>

                <div className="mt-4 space-y-2">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Key Milestones:</p>
                  {phase.milestones.map((milestone, mIdx) => (
                    <div key={mIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{milestone}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400">Expected Deliverable:</span>
                  <span className="text-xs text-slate-300">{phase.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Placement Alignment */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Placement Alignment</h2>
            <p className="text-slate-400 text-sm mt-1">
              Real-time alignment between your student profile and campus recruitment benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Preparation Scores */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-base mb-4 text-white">Interview Domain Readiness</h3>
              <div className="space-y-4">
                {Object.entries(placement_alignment.preparation_scores).map(([domain, score]) => (
                  <div key={domain}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">{domain}</span>
                      <span className="text-blue-400 font-semibold">{score}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier Standing & Pipeline */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-base mb-3 text-white">Company Tier Standing</h3>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 font-medium">Tier-1 Product Companies:</p>
                    <p className="text-white mt-0.5">{placement_alignment.tier_1_product_readiness}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 font-medium">Tier-2 IT Leaders:</p>
                    <p className="text-white mt-0.5">{placement_alignment.tier_2_services_readiness}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Application Funnel:</span>
                <span className="text-slate-300 font-medium">
                  {placement_alignment.funnel_summary.applications} Applied • {placement_alignment.funnel_summary.shortlisted} Shortlisted • {placement_alignment.funnel_summary.interviews} Interviewed
                </span>
              </div>
            </div>

          </div>

          {/* Strategic Note */}
          <div className="mt-5 p-4 rounded-xl bg-blue-950/20 border border-blue-800/30">
            <p className="text-xs font-semibold text-blue-400 mb-1">Strategic Placement Advice:</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {placement_alignment.strategic_alignment_note}
            </p>
          </div>
        </div>

        {/* 9. Personalized Career Advice */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <h2 className="text-2xl font-bold text-white mb-2">Personalized Career Advice</h2>
          <p className="text-slate-400 text-sm mb-6">
            Strategic guidance synthesized specifically for your academic and recruitment trajectory.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.personalized_advice.map((adv, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex items-start gap-3.5"
              >
                <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-slate-200 text-sm leading-relaxed">{adv}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 10. Next Career Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <h2 className="text-2xl font-bold text-purple-400 mb-2">Next Career Actions (Next 30 Days)</h2>
          <p className="text-slate-400 text-sm mb-6">
            Concrete action items to implement immediately to accelerate your career trajectory.
          </p>

          <div className="space-y-3">
            {data.next_actions.map((act, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start gap-3.5"
              >
                <span className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  →
                </span>
                <p className="text-slate-200 text-sm leading-snug">{act}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
