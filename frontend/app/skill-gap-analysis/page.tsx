"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";
const STUDENT_ID = "7579270a-4747-4073-9d3f-15516f05f00c";

interface MatchedSkillItem {
  skill: string;
  category: string;
  context: string;
}

interface MissingSkillItem {
  skill: string;
  priority: "Critical" | "High" | "Medium";
  category: string;
  target_roles: string[];
  career_impact: string;
  why_needed: string;
  readiness_boost: string;
}

interface RoleBreakdownItem {
  role: string;
  description: string;
  required_skills: string[];
  total_required: number;
  total_matched: number;
  total_missing: number;
  match_percentage: number;
  gap_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
}

interface LearningOrderStep {
  step: number;
  skill: string;
  priority: string;
  estimated_timeframe: string;
  prerequisites: string;
  rationale: string;
}

interface LearningActionItem {
  title: string;
  action: string;
  target_skill: string;
  deliverable: string;
}

interface CareerReadinessImprovement {
  current_skill_match_score: number;
  projected_skill_match_score: number;
  current_placement_readiness: number;
  projected_placement_readiness: number;
  net_readiness_gain: string;
  current_target_tier: string;
  projected_target_tier: string;
  summary: string;
}

interface SkillGapData {
  student: {
    id: string;
    name: string;
    branch: string;
    semester: number;
    cgpa: number;
    enrollment_number?: string;
  };
  target_career: string;
  target_career_roles: string[];
  overall_skill_match_score: number;
  skill_gap_percentage: number;
  current_skills: string[];
  matched_skills: MatchedSkillItem[];
  missing_skills: MissingSkillItem[];
  role_breakdown: RoleBreakdownItem[];
  priority_gaps: {
    critical: MissingSkillItem[];
    high: MissingSkillItem[];
    medium: MissingSkillItem[];
  };
  recommended_learning_order: LearningOrderStep[];
  recommended_learning_actions: LearningActionItem[];
  career_readiness_improvement: CareerReadinessImprovement;
}

export default function SkillGapAnalysisPage() {
  const [data, setData] = useState<SkillGapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("Full Stack Developer");

  useEffect(() => {
    async function loadSkillGaps() {
      try {
        const response = await fetch(
          `${API_URL}/students/${STUDENT_ID}/skill-gap-analysis`
        );

        if (!response.ok) {
          throw new Error("Failed to load skill gap data");
        }

        const result: SkillGapData = await response.json();
        setData(result);
        if (result.target_career) {
          setSelectedRole(result.target_career);
        }
      } catch (err) {
        console.error("Skill Gap error:", err);
        setError("Unable to load skill gap analysis.");
      } finally {
        setLoading(false);
      }
    }

    loadSkillGaps();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg text-slate-300">Loading AI Skill Gap Analyzer...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">{error || "Unable to load skill gap analysis."}</p>
      </main>
    );
  }

  const { student, career_readiness_improvement } = data;
  const currentRoleBreakdown =
    data.role_breakdown.find((r) => r.role === selectedRole) ||
    data.role_breakdown[0];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* 1. Header */}
        <div>
          <div className="inline-block rounded-full border border-blue-400/20 bg-blue-400/10 px-3.5 py-1 text-xs font-medium text-blue-300">
            AI-Powered Student Intelligence Platform
          </div>

          <h1 className="text-4xl font-bold mt-3">
            AI Skill Gap Analyzer
          </h1>

          <p className="text-slate-400 mt-2">
            Precision benchmark comparing verified student competencies against target engineering roles to pinpoint missing proficiencies and career impact.
          </p>
        </div>

        {/* 2. Student & Target Career Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-slate-400 mt-1">
                {student.branch} • Semester {student.semester} • CGPA {student.cgpa.toFixed(2)}
                {student.enrollment_number ? ` • Enrollment: ${student.enrollment_number}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Primary Target:</span>
              <div className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold">
                {data.target_career}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Skill Gap Overview Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <p className="text-sm font-medium text-blue-400">Diagnostic Overview</p>
              <h2 className="text-2xl font-bold mt-1">Overall Skill Match & Gap Index</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Synthesized across industry benchmark requirements for {data.target_career} and core software tracks.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-slate-950 border border-slate-800 px-5 py-3.5 rounded-xl text-center">
                <span className="text-xs text-slate-400 block mb-1">Match Score</span>
                <span className="text-4xl font-extrabold text-emerald-400">
                  {data.overall_skill_match_score}%
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800 px-5 py-3.5 rounded-xl text-center">
                <span className="text-xs text-slate-400 block mb-1">Skill Gap</span>
                <span className="text-4xl font-extrabold text-amber-400">
                  {data.skill_gap_percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Visual Dual-Tone Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-emerald-400 font-semibold">
                Matched Coverage: {data.overall_skill_match_score}%
              </span>
              <span className="text-amber-400 font-semibold">
                Missing Gap: {data.skill_gap_percentage}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3.5 flex overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-700"
                style={{ width: `${data.overall_skill_match_score}%` }}
              />
              <div
                className="bg-amber-500/80 h-full transition-all duration-700"
                style={{ width: `${data.skill_gap_percentage}%` }}
              />
            </div>
          </div>

          {/* Fast KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400">Current Skills</p>
              <p className="text-2xl font-bold text-white mt-1">{data.current_skills.length}</p>
              <p className="text-xs text-slate-500 mt-1">Logged in profile</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400">Matched Competencies</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{data.matched_skills.length}</p>
              <p className="text-xs text-slate-500 mt-1">Verified industry overlap</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400">Missing Gaps</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{data.missing_skills.length}</p>
              <p className="text-xs text-slate-500 mt-1">{data.priority_gaps.critical.length} Critical Priority</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400">Projected Gain</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{career_readiness_improvement.net_readiness_gain}</p>
              <p className="text-xs text-slate-500 mt-1">Readiness upon gap closure</p>
            </div>
          </div>
        </div>

        {/* 4. Target Career Role Breakdown (Role Tabs / Comparer) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Target Career Roles Breakdown</h2>
            <p className="text-slate-400 text-sm mt-1">
              Select a target role to inspect required competencies, matched coverage, and specific gaps.
            </p>

            {/* Role Buttons */}
            <div className="flex flex-wrap gap-2.5 mt-4">
              {data.role_breakdown.map((r) => {
                const isSelected = selectedRole === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => setSelectedRole(r.role)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    {r.role} • {r.match_percentage}% Match
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Selected Role Card */}
          {currentRoleBreakdown && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-bold text-white">{currentRoleBreakdown.role}</h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    {currentRoleBreakdown.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-start md:self-auto">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Match Score</span>
                    <span className="text-2xl font-bold text-emerald-400">
                      {currentRoleBreakdown.match_percentage}%
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Gap</span>
                    <span className="text-2xl font-bold text-amber-400">
                      {currentRoleBreakdown.gap_percentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-slate-800 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${currentRoleBreakdown.match_percentage}%` }}
                  />
                </div>
              </div>

              {/* Role Matched vs Missing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2.5">
                    Matched Skills ({currentRoleBreakdown.total_matched}/{currentRoleBreakdown.total_required})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentRoleBreakdown.matched_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2.5">
                    Missing Skills ({currentRoleBreakdown.total_missing})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentRoleBreakdown.missing_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300"
                      >
                        ! {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Current Verified Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Current Verified Skills</h2>
            <p className="text-slate-400 text-sm mt-1">
              Technical proficiencies confirmed through coursework evaluation and active project repositories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.matched_skills.map((item) => (
              <div
                key={item.skill}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-base">{item.skill}</span>
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs">
                      ✓
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-blue-400 border border-slate-800">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {item.context}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Missing Skills & Priority / Severity Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Missing Skills & Career Impact Analysis</h2>
            <p className="text-slate-400 text-sm mt-1">
              Detailed assessment of gaps categorized by priority, business need, and prospective recruitment impact.
            </p>
          </div>

          <div className="space-y-4">
            {data.missing_skills.map((gap) => {
              const priorityStyle =
                gap.priority === "Critical"
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : gap.priority === "High"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  : "border-blue-500/30 bg-blue-500/10 text-blue-400";

              return (
                <div
                  key={gap.skill}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-5 transition hover:border-slate-700"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{gap.skill}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityStyle}`}>
                        {gap.priority} Priority
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {gap.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Impact Gain:</span>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        {gap.readiness_boost}
                      </span>
                    </div>
                  </div>

                  {/* Career Impact & Why Needed */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Career Impact:
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {gap.career_impact}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Why Industry Requires This:
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {gap.why_needed}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <span>Impacts Target Roles:</span>
                    <span className="text-slate-300 font-medium">
                      {gap.target_roles.join(", ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. Recommended Learning Order */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Recommended Learning Order</h2>
            <p className="text-slate-400 text-sm mt-1">
              Sequenced roadmap ordered by dependency hierarchy and ROI on interview clearance.
            </p>
          </div>

          <div className="space-y-4">
            {data.recommended_learning_order.map((step) => (
              <div
                key={step.step}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <span className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    #{step.step}
                  </span>

                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-bold text-white">{step.skill}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                        {step.estimated_timeframe}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {step.rationale}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Prerequisites: <span className="text-slate-400">{step.prerequisites}</span>
                    </p>
                  </div>
                </div>

                <div className="self-end md:self-center">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      step.priority === "Critical"
                        ? "text-red-400 border-red-500/30 bg-red-500/10"
                        : step.priority === "High"
                        ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                        : "text-blue-400 border-blue-500/30 bg-blue-500/10"
                    }`}
                  >
                    {step.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Learning Actions & Project Tasks */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Practical Learning Actions</h2>
            <p className="text-slate-400 text-sm mt-1">
              Project-oriented action items providing tangible deliverables to demonstrate closed skill gaps.
            </p>
          </div>

          <div className="space-y-4">
            {data.recommended_learning_actions.map((act, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-white text-base">{act.title}</h3>
                  </div>

                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950/40 border border-blue-800/40 text-blue-300 font-medium self-start md:self-auto">
                    Target: {act.target_skill}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  {act.action}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400">Deliverable:</span>
                  <span className="text-xs text-slate-300">{act.deliverable}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 9. Career Readiness Improvement Projection */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Career Readiness Improvement Projection</h2>
            <p className="text-slate-400 text-sm mt-1">
              Projected outcomes upon executing the recommended learning order and resolving priority gaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Skill Match Jump */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <span className="text-xs text-slate-400 block mb-1">Skill Match Score</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-slate-400 line-through">
                  {career_readiness_improvement.current_skill_match_score}%
                </span>
                <span className="text-xs text-slate-500">→</span>
                <span className="text-3xl font-extrabold text-emerald-400">
                  {career_readiness_improvement.projected_skill_match_score}%
                </span>
              </div>
              <p className="text-xs text-emerald-400 mt-2 font-medium">+26.2% Net Competency Match</p>
            </div>

            {/* Placement Readiness Jump */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <span className="text-xs text-slate-400 block mb-1">Placement Readiness</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-slate-400 line-through">
                  {career_readiness_improvement.current_placement_readiness}%
                </span>
                <span className="text-xs text-slate-500">→</span>
                <span className="text-3xl font-extrabold text-blue-400">
                  {career_readiness_improvement.projected_placement_readiness}%
                </span>
              </div>
              <p className="text-xs text-blue-400 mt-2 font-medium">{career_readiness_improvement.net_readiness_gain} Composite Gain</p>
            </div>

            {/* Target Tier Progression */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <span className="text-xs text-slate-400 block mb-1">Recruitment Tier Transition</span>
              <p className="text-xs text-slate-400 mt-1 line-through">
                {career_readiness_improvement.current_target_tier}
              </p>
              <p className="text-sm font-bold text-emerald-400 mt-1">
                {career_readiness_improvement.projected_target_tier}
              </p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-blue-400">Summary: </span>
              {career_readiness_improvement.summary}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
