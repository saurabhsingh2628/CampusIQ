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