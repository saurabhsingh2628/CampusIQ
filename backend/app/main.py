import os

from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client

# Load environment variables from .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Create Supabase client
supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


# Create FastAPI application
app = FastAPI(
    title="CampusIQ API",
    description="AI-Powered Student Intelligence and Career Management System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Welcome to CampusIQ API",
        "status": "running",
    }


# Health check
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CampusIQ Backend",
    }

@app.get("/students")
def get_students():
    response = supabase.table("student_profiles").select("*").execute()
    return response.data

@app.get("/attendance")
def get_attendance():
    response = supabase.table("attendance").select("*").execute()
    return response.data

@app.get("/academic-records")
def get_academic_records():
    response = supabase.table("academic_records").select("*").execute()
    return response.data

@app.get("/students/{student_id}/attendance")
def get_student_attendance(student_id: str):

    response = (
        supabase
        .table("attendance")
        .select("*, subjects(subject_code, subject_name, credits)")
        .eq("student_id", student_id)
        .execute()
    )

    return response.data

@app.get("/students/{student_id}/academic")
def get_student_academic(student_id: str):

    response = (
        supabase
        .table("academic_records")
        .select("*, subjects(subject_code, subject_name, credits)")
        .eq("student_id", student_id)
        .execute()
    )

    return response.data

@app.get("/students/{student_id}/dashboard")
def get_student_dashboard(student_id: str):

    # Get student profile
    student = (
        supabase
        .table("student_profiles")
        .select("*")
        .eq("id", student_id)
        .single()
        .execute()
    )

    # Get academic records
    academics = (
        supabase
        .table("academic_records")
        .select("*")
        .eq("student_id", student_id)
        .execute()
    )

    # Get attendance
    attendance = (
        supabase
        .table("attendance")
        .select("*")
        .eq("student_id", student_id)
        .execute()
    )

    return {
        "student": student.data,
        "academic_records": academics.data,
        "attendance": attendance.data
    }

@app.get("/students/{student_id}/analytics")
def get_student_analytics(student_id: str):

    # Get student profile
    student = (
        supabase
        .table("student_profiles")
        .select("*")
        .eq("id", student_id)
        .single()
        .execute()
    )

    # Get academic records
    academics = (
        supabase
        .table("academic_records")
        .select("*")
        .eq("student_id", student_id)
        .execute()
    )

    # Get attendance
    attendance = (
        supabase
        .table("attendance")
        .select("*")
        .eq("student_id", student_id)
        .execute()
    )

    academic_data = academics.data
    attendance_data = attendance.data

    # Calculate average marks
    if academic_data:
        average_marks = sum(
            float(record["marks"])
            for record in academic_data
            if record["marks"] is not None
        ) / len(academic_data)
    else:
        average_marks = 0

    # Calculate average attendance
    if attendance_data:
        average_attendance = sum(
            float(record["attendance_percentage"])
            for record in attendance_data
            if record["attendance_percentage"] is not None
        ) / len(attendance_data)
    else:
        average_attendance = 0

    return {
        "student": {
            "id": student.data["id"],
            "name": f"{student.data['first_name']} {student.data['last_name']}",
            "branch": student.data["branch"],
            "semester": student.data["semester"],
            "cgpa": student.data["cgpa"]
        },
        "analytics": {
            "cgpa": student.data["cgpa"],
            "average_marks": round(average_marks, 2),
            "average_attendance": round(average_attendance, 2),
            "subjects_count": len(academic_data),
            "academic_status": (
                "Excellent"
                if student.data["cgpa"] >= 8.5
                else "Good"
                if student.data["cgpa"] >= 7
                else "Needs Improvement"
            ),
            "attendance_status": (
                "Good"
                if average_attendance >= 75
                else "Low Attendance"
            )
        }
    }

# ================================
# Career Intelligence
# ================================

@app.get("/students/{student_id}/career")
def get_student_career(student_id: str):

    # Get student profile
    student_response = (
        supabase
        .table("student_profiles")
        .select("*")
        .eq("id", student_id)
        .single()
        .execute()
    )

    student = student_response.data

    if not student:
        return {
            "error": "Student not found"
        }

    # Get academic records
    academic_response = (
        supabase
        .table("academic_records")
        .select("*")
        .eq("student_id", student_id)
        .execute()
    )

    academic_data = academic_response.data or []

    # Calculate average marks
    if academic_data:
        average_marks = sum(
            float(record["marks"])
            for record in academic_data
            if record.get("marks") is not None
        ) / len(academic_data)
    else:
        average_marks = 0

    # Career profile strength
    cgpa = float(student.get("cgpa") or 0)

    career_strength = min(
        round((cgpa / 10) * 100),
        100
    )

    # Current skills
    skills = [
        "C++",
        "Python",
        "JavaScript",
        "React",
        "Next.js",
        "SQL",
        "Git & GitHub"
    ]

    # Target career roles
    target_roles = [
        "Full Stack Developer",
        "Software Developer",
        "Data Analyst"
    ]

    # Recommended roles
    recommended_roles = [
        "Full Stack Developer",
        "Frontend Developer",
        "Software Engineer"
    ]

    # Skill gaps
    skill_gaps = [
        "System Design",
        "Docker",
        "AWS"
    ]

    return {
        "student": {
            "id": student.get("id"),
            "name": f"{student.get('first_name', '')} {student.get('last_name', '')}".strip(),
            "branch": student.get("branch"),
            "semester": student.get("semester"),
            "cgpa": cgpa
        },
        "career_strength": career_strength,
        "average_marks": round(average_marks, 2),
        "skills": skills,
        "target_roles": target_roles,
        "recommended_roles": recommended_roles,
        "skill_gaps": skill_gaps
    }

# ============================================================
# PLACEMENT INTELLIGENCE
# ============================================================

@app.get("/students/{student_id}/placement")
def get_student_placement(student_id: str):

    # Get student profile
    student_response = (
        supabase
        .table("student_profiles")
        .select("*")
        .eq("id", student_id)
        .single()
        .execute()
    )

    student = student_response.data

    if not student:
        return {
            "error": "Student not found",
            "student_id": student_id
        }

    # Get academic records
    academic_response = (
        supabase
        .table("academic_records")
        .select("*")
        .eq("student_id", student_id)
        .execute()
    )

    academic_data = academic_response.data or []

    # Calculate average marks
    if academic_data:
        marks = [
            float(record["marks"])
            for record in academic_data
            if record.get("marks") is not None
        ]

        average_marks = (
            sum(marks) / len(marks)
            if marks
            else 0
        )
    else:
        average_marks = 0

    # Student CGPA
    cgpa = float(student.get("cgpa") or 0)

    # --------------------------------------------------------
    # Placement readiness calculation
    # --------------------------------------------------------

    placement_readiness = min(
        round(
            (cgpa / 10) * 50
            + min(average_marks / 100, 1) * 30
            + 20,
            2
        ),
        100
    )

    # --------------------------------------------------------
    # Eligible companies
    # --------------------------------------------------------

    eligible_companies = [
        "TCS",
        "Infosys",
        "Accenture",
        "Deloitte",
        "Cognizant"
    ]

    # --------------------------------------------------------
    # Placement preparation
    # --------------------------------------------------------

    preparation = {
        "DSA": 78,
        "Aptitude": 85,
        "Communication": 72,
        "Resume": 90
    }

    # --------------------------------------------------------
    # Placement skill gaps
    # --------------------------------------------------------

    skill_gaps = [
        "System Design",
        "Advanced DSA",
        "Cloud Computing"
    ]

    # --------------------------------------------------------
    # Return placement intelligence
    # --------------------------------------------------------

    return {
        "student": {
            "id": student.get("id"),
            "name": f"{student.get('first_name', '')} {student.get('last_name', '')}".strip(),
            "branch": student.get("branch"),
            "semester": student.get("semester"),
            "cgpa": cgpa
        },

        "placement_readiness": placement_readiness,

        "eligible_companies": eligible_companies,

        "applications": 3,

        "shortlisted": 2,

        "interviews": 1,

        "offers": 0,

        "preparation": preparation,

        "skill_gaps": skill_gaps
    }

# ============================================================
# AI PERFORMANCE ANALYSIS (Deterministic / Rule-based)
# ============================================================

@app.get("/students/{student_id}/performance-analysis")
def get_student_performance_analysis(student_id: str):

    # 1. Fetch student profile
    student_response = (
        supabase
        .table("student_profiles")
        .select("*")
        .eq("id", student_id)
        .single()
        .execute()
    )

    student = student_response.data

    if not student:
        return {
            "error": "Student not found",
            "student_id": student_id
        }

    # 2. Fetch academic records with subject details
    academic_response = (
        supabase
        .table("academic_records")
        .select("*, subjects(subject_code, subject_name, credits)")
        .eq("student_id", student_id)
        .execute()
    )
    academic_data = academic_response.data or []

    # 3. Fetch attendance records with subject details
    attendance_response = (
        supabase
        .table("attendance")
        .select("*, subjects(subject_code, subject_name, credits)")
        .eq("student_id", student_id)
        .execute()
    )
    attendance_data = attendance_response.data or []

    # Metrics calculation
    cgpa = float(student.get("cgpa") or 0.0)

    # Average marks
    if academic_data:
        valid_marks = [
            float(r["marks"])
            for r in academic_data
            if r.get("marks") is not None
        ]
        average_marks = sum(valid_marks) / len(valid_marks) if valid_marks else 0.0
    else:
        average_marks = 0.0

    # Average attendance
    if attendance_data:
        valid_attendance = [
            float(r["attendance_percentage"])
            for r in attendance_data
            if r.get("attendance_percentage") is not None
        ]
        average_attendance = sum(valid_attendance) / len(valid_attendance) if valid_attendance else 0.0
    else:
        average_attendance = 0.0

    # 1. Overall Performance Score (0 - 100)
    # Balanced multi-factor weighting: 45% CGPA, 35% Marks, 20% Attendance
    cgpa_score = (min(cgpa, 10.0) / 10.0) * 45.0
    marks_score = (min(average_marks, 100.0) / 100.0) * 35.0
    attendance_score = (min(average_attendance, 100.0) / 100.0) * 20.0
    overall_performance_score = round(min(cgpa_score + marks_score + attendance_score, 100.0), 1)

    # 2. Academic Performance Assessment
    if cgpa >= 8.5:
        academic_assessment = (
            f"Outstanding academic mastery with a CGPA of {cgpa:.2f}. "
            f"Demonstrates consistent depth of understanding across all coursework evaluations."
        )
    elif cgpa >= 7.5:
        academic_assessment = (
            f"Strong academic foundation with a CGPA of {cgpa:.2f}. "
            f"Maintains dependable performance with consistent subject understanding."
        )
    elif cgpa >= 6.5:
        academic_assessment = (
            f"Satisfactory academic performance with a CGPA of {cgpa:.2f}. "
            f"Core concepts are understood, but targeted revision is required in demanding subjects."
        )
    else:
        academic_assessment = (
            f"Academic performance requires urgent intervention (CGPA: {cgpa:.2f}). "
            f"Coursework mastery is significantly below standard expectations."
        )

    # 3. Attendance Assessment
    if average_attendance >= 85.0:
        attendance_assessment = (
            f"Excellent attendance record of {average_attendance:.1f}%. "
            f"Consistent lecture and lab attendance strongly correlates with academic retention."
        )
    elif average_attendance >= 75.0:
        attendance_assessment = (
            f"Satisfactory attendance of {average_attendance:.1f}%. "
            f"Complies with the 75% institutional threshold, though additional buffer is advised."
        )
    else:
        attendance_assessment = (
            f"Critical attendance warning: {average_attendance:.1f}% is below the mandatory 75% minimum. "
            f"Immediate remedial attendance required to prevent exam eligibility debarment."
        )

    # 4. Overall Status
    if overall_performance_score >= 85.0:
        overall_status = "Distinction"
    elif overall_performance_score >= 70.0:
        overall_status = "Good Standing"
    elif overall_performance_score >= 55.0:
        overall_status = "Needs Improvement"
    else:
        overall_status = "Critical Risk"

    # 5. Risk Level
    if average_attendance < 75.0 or cgpa < 6.0:
        risk_level = "High"
    elif average_attendance < 80.0 or cgpa < 7.0:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    # 6. Strengths
    strengths = []
    if cgpa >= 8.0:
        strengths.append(f"Cumulative CGPA of {cgpa:.2f} demonstrates exceptional academic excellence.")
    if average_attendance >= 85.0:
        strengths.append(f"Consistent classroom presence with {average_attendance:.1f}% attendance.")
    if average_marks >= 80.0:
        strengths.append(f"High evaluation test performance averaging {average_marks:.1f}%.")

    for rec in academic_data:
        marks_val = float(rec.get("marks") or 0)
        subj = rec.get("subjects") or {}
        subj_name = subj.get("subject_name") or "Subject"
        if marks_val >= 80.0:
            strengths.append(
                f"Subject proficiency in {subj_name} with {marks_val:.1f}% marks (Grade {rec.get('grade', 'N/A')})."
            )

    if not strengths:
        strengths.append("Foundational course engagement and steady participation in semester modules.")

    # 7. Weaknesses
    weaknesses = []
    if average_attendance < 75.0:
        weaknesses.append(f"Attendance is critically below the institutional 75% mandate ({average_attendance:.1f}%).")
    elif average_attendance < 80.0:
        weaknesses.append(f"Limited attendance buffer at {average_attendance:.1f}%; leaves little margin for emergencies.")

    if cgpa < 7.0:
        weaknesses.append("Cumulative CGPA is below the competitive benchmark (7.0+) required for top placement drives.")

    for rec in academic_data:
        marks_val = float(rec.get("marks") or 0)
        subj = rec.get("subjects") or {}
        subj_name = subj.get("subject_name") or "Subject"
        if marks_val < 70.0:
            weaknesses.append(
                f"Sub-optimal score in {subj_name} ({marks_val:.1f}%); indicates comprehension gaps."
            )

    if not weaknesses:
        weaknesses.append("Minimal score margin in theoretical assessments; opportunity to push toward 90%+ in future terms.")

    # 8. Key Insights
    key_insights = [
        f"Overall multi-factor performance index is {overall_performance_score}/100, placing the student in '{overall_status}'.",
        f"Registered for {len(academic_data)} course module(s) in Semester {student.get('semester', 'N/A')} ({student.get('branch', 'N/A')}).",
    ]
    if average_attendance >= 80.0 and cgpa >= 7.5:
        key_insights.append("Sustained lecture attendance directly fuels higher scores in semester evaluations.")
    else:
        key_insights.append("Improving lecture consistency will produce rapid improvements in continuous assessment marks.")

    if overall_performance_score >= 80.0:
        key_insights.append("Academic profile is favorably positioned for tier-1 campus recruitment drives.")
    else:
        key_insights.append("Focusing on weakest subject modules will provide the fastest boost to overall performance.")

    # 9. Personalized Recommendations
    recommendations = []
    if average_attendance < 80.0:
        recommendations.append("Ensure attendance across the next 10 consecutive lectures to safely exceed the 80% benchmark.")
    else:
        recommendations.append("Sustain current attendance momentum and leverage office hours for advanced subject topics.")

    if academic_data:
        lowest_rec = min(academic_data, key=lambda x: float(x.get("marks") or 0))
        subj = lowest_rec.get("subjects") or {}
        subj_name = subj.get("subject_name") or "core subjects"
        recommendations.append(f"Dedicate 4 to 5 structured revision hours weekly to reinforce mastery in {subj_name}.")

    recommendations.append("Conduct regular mock tests and self-assessments 2 weeks ahead of semester examinations.")
    recommendations.append("Leverage CampusIQ Career and Placement modules to map coursework strengths to target job profiles.")

    # 10. Suggested Next Actions
    suggested_next_actions = [
        "Review module-wise syllabus breakdown and schedule a quick check-in with your faculty advisor.",
        "Set weekly milestones for problem-solving and assignment submissions.",
        "Check CampusIQ Career Intelligence to evaluate how current course mastery aligns with industry roles.",
        "Maintain proactive tracking of upcoming class schedules to preserve high attendance standing."
    ]

    return {
        "student": {
            "id": student.get("id"),
            "name": f"{student.get('first_name', '')} {student.get('last_name', '')}".strip(),
            "branch": student.get("branch"),
            "semester": student.get("semester"),
            "cgpa": cgpa,
            "enrollment_number": student.get("enrollment_number")
        },
        "overall_performance_score": overall_performance_score,
        "academic_assessment": academic_assessment,
        "attendance_assessment": attendance_assessment,
        "overall_status": overall_status,
        "risk_level": risk_level,
        "metrics": {
            "cgpa": cgpa,
            "average_marks": round(average_marks, 2),
            "average_attendance": round(average_attendance, 2),
            "subjects_count": len(academic_data)
        },
        "strengths": strengths,
        "weaknesses": weaknesses,
        "key_insights": key_insights,
        "recommendations": recommendations,
        "suggested_next_actions": suggested_next_actions
    }