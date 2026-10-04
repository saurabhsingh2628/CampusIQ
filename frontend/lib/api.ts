const API_URL = "http://127.0.0.1:8000";

export async function getStudentAnalytics(studentId: string) {
  const response = await fetch(
    `${API_URL}/students/${studentId}/analytics`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch student analytics");
  }

  return response.json();
}

export async function getStudentCareerAdvisor(studentId: string) {
  const response = await fetch(
    `${API_URL}/students/${studentId}/career-advisor`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch career advisor data");
  }

  return response.json();
}

export async function getStudentSkillGapAnalysis(studentId: string) {
  const response = await fetch(
    `${API_URL}/students/${studentId}/skill-gap-analysis`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch skill gap analysis data");
  }

  return response.json();
}
