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