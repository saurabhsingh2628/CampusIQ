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


# ============================================================
# AI CAREER ADVISOR (Deterministic / Rule-based Guidance)
# ============================================================

@app.get("/students/{student_id}/career-advisor")
def get_student_career_advisor(student_id: str):

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
    branch = student.get("branch") or "CSE"
    semester = int(student.get("semester") or 1)

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

    # Align with existing Career Intelligence & Placement data
    career_strength = min(round((cgpa / 10.0) * 100), 100)
    placement_readiness = min(
        round(
            (cgpa / 10.0) * 50.0
            + min(average_marks / 100.0, 1.0) * 30.0
            + 20.0,
            2
        ),
        100.0
    )

    placement_preparation = {
        "DSA": 78,
        "Aptitude": 85,
        "Communication": 72,
        "Resume": 90
    }

    # 1. Career Readiness Score (0 - 100)
    # Balanced weighting:
    # 30% CGPA + 20% Marks + 25% Placement Readiness + 15% Career Strength + 10% Attendance
    cgpa_comp = (min(cgpa, 10.0) / 10.0) * 30.0
    marks_comp = (min(average_marks, 100.0) / 100.0) * 20.0
    placement_comp = (placement_readiness / 100.0) * 25.0
    career_comp = (career_strength / 100.0) * 15.0
    attendance_comp = (min(average_attendance, 100.0) / 100.0) * 10.0

    career_readiness_score = round(
        min(cgpa_comp + marks_comp + placement_comp + career_comp + attendance_comp, 100.0),
        1
    )

    if career_readiness_score >= 85.0:
        readiness_status = "Tier-1 / Market Ready"
        readiness_summary = "Outstanding career foundation with strong potential for Tier-1 product companies and top-flight recruitment drives."
    elif career_readiness_score >= 70.0:
        readiness_status = "Competitive / Good Standing"
        readiness_summary = "Well-rounded academic and coding profile. Strategic focus on advanced design and deployment will maximize offers."
    elif career_readiness_score >= 55.0:
        readiness_status = "Developing Competency"
        readiness_summary = "Solid core basics established. Requires disciplined execution of technical roadmap to elevate readiness."
    else:
        readiness_status = "Needs Acceleration"
        readiness_summary = "Immediate academic and skill acceleration required to meet campus placement benchmarks."

    # 2 & 3. Recommended Career Paths & Why Recommended
    recommended_career_paths = [
        {
            "id": "full-stack-engineer",
            "title": "Full Stack Software Engineer",
            "match_percentage": 92,
            "demand_level": "Very High",
            "industry": "Product & SaaS Enterprises",
            "why_recommended": (
                "Direct synergy with your React, Next.js, and JavaScript front-end skill set "
                "coupled with Python backend services and Grade A Data Structures fundamentals."
            ),
            "matched_skills": ["React", "Next.js", "JavaScript", "Python", "SQL", "Git & GitHub"],
            "target_roles": ["Full Stack Developer", "Frontend Engineer", "API Engineer"],
            "salary_range": "₹8 - ₹18 LPA"
        },
        {
            "id": "backend-cloud-engineer",
            "title": "Backend & Cloud Engineer",
            "match_percentage": 84,
            "demand_level": "High",
            "industry": "Enterprise Tech & Cloud Services",
            "why_recommended": (
                "Strong core algorithmic logic in C++ and Python alongside SQL database management. "
                "Adding Docker containerization and cloud basics will make you a prime candidate."
            ),
            "matched_skills": ["Python", "C++", "SQL", "Git & GitHub"],
            "target_roles": ["Backend Developer", "Systems Engineer", "Cloud Associate"],
            "salary_range": "₹7 - ₹16 LPA"
        },
        {
            "id": "data-analytics-engineer",
            "title": "Data Analytics & Engineering",
            "match_percentage": 78,
            "demand_level": "High",
            "industry": "FinTech, E-Commerce & Analytics",
            "why_recommended": (
                "High quantitative problem-solving ability (85% Aptitude score) combined with "
                "database manipulation skills in SQL and data processing in Python."
            ),
            "matched_skills": ["Python", "SQL", "Aptitude Assessment (85%)"],
            "target_roles": ["Data Analyst", "Associate Data Engineer", "BI Specialist"],
            "salary_range": "₹6 - ₹14 LPA"
        }
    ]

    # 4. Current Strengths
    strengths = []
    if cgpa >= 8.0:
        strengths.append(f"High cumulative CGPA ({cgpa:.2f}) easily satisfies eligibility cutoffs for over 95% of visiting companies.")
    if average_marks >= 80.0:
        strengths.append(f"Consistent examination mastery with an overall subject average of {average_marks:.1f}%.")
    if average_attendance >= 85.0:
        strengths.append(f"Exemplary attendance track record ({average_attendance:.1f}%) demonstrating reliability and professional discipline.")

    strengths.append("Versatile full-stack web skillset spanning React, Next.js, Python, and SQL.")
    strengths.append("High placement resume rating (90%) and strong quantitative problem-solving aptitude (85%).")

    for rec in academic_data:
        m = float(rec.get("marks") or 0)
        s = rec.get("subjects") or {}
        s_name = s.get("subject_name") or "Subject"
        if m >= 80.0:
            strengths.append(f"Subject proficiency in {s_name} with {m:.1f}% marks (Grade {rec.get('grade', 'A')}).")

    # 5. Skill Gaps
    skill_gaps = [
        {
            "skill": "System Design & Distributed Architecture",
            "severity": "Critical",
            "impact": "Crucial differentiator for clearing Tier-1 product company technical interviews and building scalable systems."
        },
        {
            "skill": "Docker & Containerization",
            "severity": "High",
            "impact": "Essential for containerizing microservices, setting up reproducible dev environments, and production CI/CD."
        },
        {
            "skill": "Cloud Infrastructure (AWS / GCP)",
            "severity": "Medium",
            "impact": "Vital for deploying cloud-native backends, managing remote databases, and serverless compute."
        },
        {
            "skill": "Advanced DSA (Graphs & Dynamic Programming)",
            "severity": "Medium",
            "impact": "Needed to boost DSA readiness from 78% to 85%+ to conquer competitive online coding assessments."
        }
    ]

    # 6. Priority Skills to Learn
    priority_skills = [
        {
            "rank": 1,
            "name": "System Design Fundamentals",
            "category": "Architecture",
            "urgency": "Urgent",
            "estimated_weeks": 4,
            "focus_areas": "Load balancers, caching strategies (Redis), database sharding, CAP theorem, and REST/GraphQL architecture."
        },
        {
            "rank": 2,
            "name": "Docker & Containerization",
            "category": "DevOps",
            "urgency": "High",
            "estimated_weeks": 2,
            "focus_areas": "Multi-stage Dockerfiles, Docker Compose multi-service coordination, volume persistence, and container networking."
        },
        {
            "rank": 3,
            "name": "AWS Cloud Foundations",
            "category": "Cloud Infrastructure",
            "urgency": "Medium",
            "estimated_weeks": 3,
            "focus_areas": "EC2 virtual instances, S3 storage, managed PostgreSQL RDS, IAM role policies, and serverless Lambda."
        },
        {
            "rank": 4,
            "name": "Advanced Graph & DP Algorithms",
            "category": "Problem Solving",
            "urgency": "Medium",
            "estimated_weeks": 4,
            "focus_areas": "Graph traversals (BFS, DFS, Dijkstra), 2D dynamic programming patterns, memoization, and time-space optimization."
        }
    ]

    # 7. Recommended Learning Roadmap
    learning_roadmap = [
        {
            "phase": "Phase 1: Advanced Algorithms & Architecture Foundations",
            "timeframe": "Weeks 1 - 4",
            "objective": "Solidify high-frequency coding patterns and grasp fundamental distributed system concepts.",
            "milestones": [
                "Solve 25 LeetCode Medium problems focusing on Graphs, Trees, and Dynamic Programming.",
                "Learn scalable system building blocks: Reverse proxy, CDN, Redis caching, and database read replicas.",
                "Review time and space complexity trade-offs for technical interview communication."
            ],
            "outcome": "Elevates DSA readiness score past 85% and provides confident system design vocabulary."
        },
        {
            "phase": "Phase 2: Containerization & Modern DevOps Workflows",
            "timeframe": "Weeks 5 - 8",
            "objective": "Package full-stack applications into standardized Docker containers with CI automation.",
            "milestones": [
                "Author optimized multi-stage Dockerfiles for Next.js frontend and FastAPI backend.",
                "Configure Docker Compose orchestration integrating backend, frontend, and PostgreSQL database.",
                "Set up automated build and lint checks using GitHub Actions workflows."
            ],
            "outcome": "Multi-container full-stack application repository ready to showcase on GitHub."
        },
        {
            "phase": "Phase 3: Cloud Deployment & Production Hardening",
            "timeframe": "Weeks 9 - 12",
            "objective": "Deploy scalable applications to cloud environments with automated security and monitoring.",
            "milestones": [
                "Deploy backend services to AWS ECS or Google Cloud Run container services.",
                "Implement Redis caching to optimize database response times under simulated load.",
                "Secure application with HTTPS, environment secrets management, and custom domain routing."
            ],
            "outcome": "Live public application link to prominently display on resume and LinkedIn."
        },
        {
            "phase": "Phase 4: Placement Simulation & Behavioral Mastery",
            "timeframe": "Weeks 13 - 16",
            "objective": "Simulate end-to-end interview rounds to convert candidate shortlists into top offers.",
            "milestones": [
                "Participate in 4 peer-led technical mock interviews covering live coding and architecture.",
                "Structure project explanations using the STAR (Situation, Task, Action, Result) methodology.",
                "Complete company-specific aptitude and rapid coding practice tests for target recruiters."
            ],
            "outcome": "Comprehensive readiness across technical, analytical, and HR placement rounds."
        }
    ]

    # 8. Placement Alignment
    placement_alignment = {
        "overall_placement_readiness": placement_readiness,
        "eligible_companies": [
            "TCS",
            "Infosys",
            "Accenture",
            "Deloitte",
            "Cognizant"
        ],
        "tier_1_product_readiness": "Eligible by CGPA; Requires System Design and 85%+ DSA readiness.",
        "tier_2_services_readiness": "Immediate Shortlist Standing across all criteria.",
        "preparation_scores": placement_preparation,
        "funnel_summary": {
            "applications": 3,
            "shortlisted": 2,
            "interviews": 1,
            "offers": 0,
            "conversion_rate": "66.7% Shortlist Rate"
        },
        "strategic_alignment_note": (
            "Your resume score (90%) and aptitude (85%) consistently secure initial interview invitations. "
            "Increasing DSA proficiency from 78% to 85% and practicing verbal technical explanations will "
            "directly turn interview rounds into confirmed offers."
        )
    }

    # 9. Personalized Career Advice
    personalized_career_advice = [
        f"Leverage your {cgpa:.2f} CGPA as your primary academic credential. It comfortably exceeds the 8.0 benchmark required by tier-1 recruiters and prevents cutoff eliminations.",
        "Bridge the gap between frontend familiarity and enterprise engineering: having React/Next.js experience is an advantage, but employers specifically look for candidates who understand full lifecycle deployment including Docker and databases.",
        "Focus on interview conversion efficiency: With 2 shortlists out of 3 applications, your resume is effective. Dedicate 60% of your prep time to technical problem solving and mock interview delivery to convert interviews into offers.",
        f"In Semester {semester}, timing is optimal: You are in an ideal semester window to execute the 12-week roadmap before mass placement drives accelerate."
    ]

    # 10. Next Career Actions
    next_career_actions = [
        "Containerize your CampusIQ or portfolio application with Docker Compose and push the configuration to GitHub.",
        "Commit to solving 2 LeetCode medium problems daily, emphasizing Graph traversals and Dynamic Programming.",
        "Draft a system architecture blueprint for a scalable service (e.g., Notification engine or URL Shortener).",
        "Conduct a 30-minute mock technical interview with a peer to practice articulating algorithm choices under pressure.",
        "Review upcoming company placement schedules and prepare company-specific test pattern strategies."
    ]

    return {
        "student": {
            "id": student.get("id"),
            "name": f"{student.get('first_name', '')} {student.get('last_name', '')}".strip(),
            "branch": branch,
            "semester": semester,
            "cgpa": cgpa,
            "enrollment_number": student.get("enrollment_number")
        },
        "career_readiness_score": career_readiness_score,
        "readiness_status": readiness_status,
        "readiness_summary": readiness_summary,
        "metrics": {
            "cgpa": cgpa,
            "average_marks": round(average_marks, 2),
            "average_attendance": round(average_attendance, 2),
            "career_strength": career_strength,
            "placement_readiness": placement_readiness
        },
        "recommended_career_paths": recommended_career_paths,
        "strengths": strengths,
        "skill_gaps": skill_gaps,
        "priority_skills": priority_skills,
        "learning_roadmap": learning_roadmap,
        "placement_alignment": placement_alignment,
        "personalized_advice": personalized_career_advice,
        "next_actions": next_career_actions
    }


# ============================================================
# AI SKILL GAP ANALYZER (Deterministic / Rule-based Analysis)
# ============================================================

@app.get("/students/{student_id}/skill-gap-analysis")
def get_student_skill_gap_analysis(student_id: str):

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

    # 2. Fetch academic and attendance records
    academic_response = (
        supabase
        .table("academic_records")
        .select("*, subjects(subject_code, subject_name, credits)")
        .eq("student_id", student_id)
        .execute()
    )
    academic_data = academic_response.data or []

    attendance_response = (
        supabase
        .table("attendance")
        .select("*, subjects(subject_code, subject_name, credits)")
        .eq("student_id", student_id)
        .execute()
    )
    attendance_data = attendance_response.data or []

    # Student metadata
    cgpa = float(student.get("cgpa") or 0.0)
    branch = student.get("branch") or "CSE"
    semester = int(student.get("semester") or 1)

    # 1. Current skills
    current_skills = [
        "C++",
        "Python",
        "JavaScript",
        "React",
        "Next.js",
        "SQL",
        "Git & GitHub"
    ]

    # 2. Target career roles
    target_roles = [
        "Full Stack Developer",
        "Software Developer",
        "Data Analyst"
    ]

    primary_target_role = "Full Stack Developer"

    # 3. Required skills for each target role
    role_skill_requirements = {
        "Full Stack Developer": {
            "required_skills": [
                "React",
                "Next.js",
                "JavaScript",
                "Python",
                "SQL",
                "Git & GitHub",
                "System Design & Architecture",
                "Docker & Containerization",
                "Cloud Infrastructure (AWS / GCP)",
                "REST & GraphQL APIs"
            ],
            "description": "Architects and implements end-to-end web applications with modern frontend, performant APIs, and containerized cloud hosting."
        },
        "Software Developer": {
            "required_skills": [
                "C++",
                "Python",
                "SQL",
                "Git & GitHub",
                "Data Structures & Algorithms",
                "Advanced DSA (Graphs & DP)",
                "System Design & Architecture",
                "Automated Testing & CI/CD"
            ],
            "description": "Engineers scalable, high-efficiency core backend systems, algorithmic pipelines, and robust enterprise services."
        },
        "Data Analyst": {
            "required_skills": [
                "Python",
                "SQL",
                "Git & GitHub",
                "Statistical Analysis",
                "Data Visualization (PowerBI / Tableau)",
                "Pandas & Data Modeling",
                "Aptitude & Quantitative Analysis"
            ],
            "description": "Extracts actionable business intelligence, builds predictive models, and delivers interactive analytics dashboards."
        }
    }

    # Verified proficiencies set
    student_skill_set = set(current_skills)
    student_skill_set.add("Data Structures & Algorithms")
    student_skill_set.add("Aptitude & Quantitative Analysis")
    student_skill_set.add("Statistical Analysis")

    role_analysis = []
    for role_name, req_info in role_skill_requirements.items():
        req_list = req_info["required_skills"]
        matched = [s for s in req_list if s in student_skill_set]
        missing = [s for s in req_list if s not in student_skill_set]
        match_pct = round((len(matched) / len(req_list)) * 100, 1)
        gap_pct = round(100.0 - match_pct, 1)

        role_analysis.append({
            "role": role_name,
            "description": req_info["description"],
            "required_skills": req_list,
            "total_required": len(req_list),
            "total_matched": len(matched),
            "total_missing": len(missing),
            "match_percentage": match_pct,
            "gap_percentage": gap_pct,
            "matched_skills": matched,
            "missing_skills": missing
        })

    # Overall Skill Match & Gap Scores (Composite across primary target path)
    primary_analysis = next((r for r in role_analysis if r["role"] == primary_target_role), role_analysis[0])
    overall_skill_match_score = 68.8
    skill_gap_percentage = round(100.0 - overall_skill_match_score, 1)

    # 4. Matched Skills Details
    matched_skills = [
        {"skill": "React", "category": "Frontend Framework", "context": "Extensively applied in CampusIQ dashboard components"},
        {"skill": "Next.js", "category": "Full Stack Framework", "context": "Active architecture across App Router pages"},
        {"skill": "JavaScript", "category": "Programming", "context": "Modern ES6+ frontend core scripting"},
        {"skill": "Python", "category": "Backend / Data", "context": "FastAPI backend services and algorithmic logic"},
        {"skill": "SQL", "category": "Database", "context": "Supabase PostgreSQL queries and schema joins"},
        {"skill": "Git & GitHub", "category": "Version Control", "context": "Repository management, branching, and commit history"},
        {"skill": "C++", "category": "Programming", "context": "High-performance object-oriented programming foundation"},
        {"skill": "Data Structures & Algorithms", "category": "Problem Solving", "context": "78% DSA placement preparation with Grade A coursework"}
    ]

    # 5, 7, 8. Missing Skills Details with Priority / Severity and Career Impact
    missing_skills_details = [
        {
            "skill": "System Design & Distributed Architecture",
            "priority": "Critical",
            "category": "System Architecture",
            "target_roles": ["Full Stack Developer", "Software Developer"],
            "career_impact": "Crucial differentiator for Tier-1 engineering interviews (FAANG, Unicorns). Lacking system design limits campus offers to Tier-2 service companies.",
            "why_needed": "Required to design scalable architectures, database sharding, caching layers (Redis), and handle high-concurrency traffic.",
            "readiness_boost": "+6.5% Readiness"
        },
        {
            "skill": "Docker & Containerization",
            "priority": "Critical",
            "category": "DevOps",
            "target_roles": ["Full Stack Developer"],
            "career_impact": "Industry baseline for modern microservices and full-stack software development. Prerequisite for automated CI/CD deployments.",
            "why_needed": "Ensures reproducible development environments and seamless cloud container hosting on AWS/GCP.",
            "readiness_boost": "+5.0% Readiness"
        },
        {
            "skill": "Cloud Infrastructure (AWS / GCP)",
            "priority": "High",
            "category": "Cloud Infrastructure",
            "target_roles": ["Full Stack Developer"],
            "career_impact": "Essential for hosting scalable production applications, cloud databases (RDS), and serverless architectures.",
            "why_needed": "Recruiters prioritize candidates with hands-on experience deploying live applications over localhost-only projects.",
            "readiness_boost": "+4.2% Readiness"
        },
        {
            "skill": "Advanced DSA (Graphs & Dynamic Programming)",
            "priority": "High",
            "category": "Algorithms",
            "target_roles": ["Software Developer"],
            "career_impact": "Needed to push placement DSA readiness from 78% to 90%+, bypassing competitive coding test cutoffs for ₹12+ LPA packages.",
            "why_needed": "Essential for clearing online assessment rounds (OA) at top product companies (Microsoft, Amazon, Atlassian).",
            "readiness_boost": "+3.8% Readiness"
        },
        {
            "skill": "REST & GraphQL API Optimization",
            "priority": "Medium",
            "category": "Backend",
            "target_roles": ["Full Stack Developer"],
            "career_impact": "Improves data transmission efficiency and elevates full-stack architecture maturity.",
            "why_needed": "Enables high-performance communication between React/Next.js frontend clients and FastAPI backend microservices.",
            "readiness_boost": "+2.5% Readiness"
        },
        {
            "skill": "Automated Testing & CI/CD Pipelines",
            "priority": "Medium",
            "category": "Software Quality",
            "target_roles": ["Software Developer"],
            "career_impact": "Proves production code quality and engineering discipline during technical evaluations.",
            "why_needed": "Writing unit and integration tests guarantees software resilience against regressions.",
            "readiness_boost": "+2.0% Readiness"
        },
        {
            "skill": "Data Visualization & Analytics (PowerBI / Tableau)",
            "priority": "Medium",
            "category": "Data Science",
            "target_roles": ["Data Analyst"],
            "career_impact": "Expands backup recruitment eligibility into analytics and business intelligence roles.",
            "why_needed": "Allows translating raw SQL queries into executive decision dashboards.",
            "readiness_boost": "+2.0% Readiness"
        }
    ]

    priority_gaps = {
        "critical": [s for s in missing_skills_details if s["priority"] == "Critical"],
        "high": [s for s in missing_skills_details if s["priority"] == "High"],
        "medium": [s for s in missing_skills_details if s["priority"] == "Medium"]
    }

    # 9. Recommended Learning Order
    recommended_learning_order = [
        {
            "step": 1,
            "skill": "Docker & Containerization",
            "priority": "Critical",
            "estimated_timeframe": "1 - 2 Weeks",
            "prerequisites": "Linux basics, Git",
            "rationale": "Immediate quick win. Packaging your existing Next.js and FastAPI projects instantly transforms your portfolio into production-grade artifacts."
        },
        {
            "step": 2,
            "skill": "System Design Fundamentals",
            "priority": "Critical",
            "estimated_timeframe": "3 - 4 Weeks",
            "prerequisites": "Web basics, Databases (SQL)",
            "rationale": "High-yield conceptual mastery. Essential for clearing Tier-1 architecture interview rounds and structuring scalable backends."
        },
        {
            "step": 3,
            "skill": "AWS Cloud Foundations",
            "priority": "High",
            "estimated_timeframe": "2 - 3 Weeks",
            "prerequisites": "Docker, System Design",
            "rationale": "Directly links your containerized applications to live cloud infrastructure (EC2, S3, RDS, ECS)."
        },
        {
            "step": 4,
            "skill": "Advanced DSA (Graphs & DP)",
            "priority": "High",
            "estimated_timeframe": "3 - 4 Weeks (Concurrent)",
            "prerequisites": "Basic DSA (Arrays, Trees)",
            "rationale": "Elevates your 78% DSA score to 90%+ to guarantee clearance of online coding assessment rounds."
        },
        {
            "step": 5,
            "skill": "CI/CD & Automated Testing",
            "priority": "Medium",
            "estimated_timeframe": "1 - 2 Weeks",
            "prerequisites": "Git & GitHub, Docker",
            "rationale": "Polishes your repositories with automated GitHub Actions testing, signaling senior engineering discipline to recruiters."
        }
    ]

    # 10. Recommended Learning Actions
    recommended_learning_actions = [
        {
            "title": "Containerize Full-Stack Application",
            "action": "Write a multi-stage Dockerfile for Next.js frontend and FastAPI backend, using docker-compose to orchestrate PostgreSQL.",
            "target_skill": "Docker & Containerization",
            "deliverable": "Multi-container GitHub repository with automated Docker build"
        },
        {
            "title": "Architect Scalable System Blueprint",
            "action": "Create an architecture diagram and technical spec for a distributed system (e.g., URL shortener with Redis caching and rate limiting).",
            "target_skill": "System Design & Architecture",
            "deliverable": "Comprehensive system architecture documentation on GitHub"
        },
        {
            "title": "Deploy to Cloud Container Service",
            "action": "Launch your containerized application to AWS ECS or GCP Cloud Run, connecting to a managed PostgreSQL RDS instance.",
            "target_skill": "Cloud Infrastructure (AWS / GCP)",
            "deliverable": "Live public HTTPS application URL on custom domain"
        },
        {
            "title": "Targeted Graph & Dynamic Programming Sprint",
            "action": "Solve 25 curated LeetCode Medium problems specifically covering Graph BFS/DFS, Dijkstra, and 2D Dynamic Programming.",
            "target_skill": "Advanced DSA",
            "deliverable": "Verified GitHub LeetCode tracker reaching 90%+ DSA accuracy"
        },
        {
            "title": "Set Up Automated CI/CD Pipeline",
            "action": "Configure GitHub Actions workflow to run ESLint, TypeScript check, and pytest suite on every pull request.",
            "target_skill": "CI/CD & Automated Testing",
            "deliverable": "Passing green CI build badge in repository README"
        }
    ]

    # Career Readiness Improvement
    career_readiness_improvement = {
        "current_skill_match_score": overall_skill_match_score,
        "projected_skill_match_score": 95.0,
        "current_placement_readiness": 88.0,
        "projected_placement_readiness": 96.5,
        "net_readiness_gain": "+8.5%",
        "current_target_tier": "Tier-2 IT Services (₹5 - ₹8 LPA)",
        "projected_target_tier": "Tier-1 Product Enterprises & High-Growth Startups (₹12 - ₹22 LPA)",
        "summary": "Closing the 4 priority gaps (System Design, Docker, Cloud, and Advanced DSA) directly bridges your current profile to Tier-1 product company requirements, boosting your skill match from 68.8% to 95.0%."
    }

    return {
        "student": {
            "id": student.get("id"),
            "name": f"{student.get('first_name', '')} {student.get('last_name', '')}".strip(),
            "branch": branch,
            "semester": semester,
            "cgpa": cgpa,
            "enrollment_number": student.get("enrollment_number")
        },
        "target_career": primary_target_role,
        "target_career_roles": target_roles,
        "overall_skill_match_score": overall_skill_match_score,
        "skill_gap_percentage": skill_gap_percentage,
        "current_skills": current_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills_details,
        "role_breakdown": role_analysis,
        "priority_gaps": priority_gaps,
        "recommended_learning_order": recommended_learning_order,
        "recommended_learning_actions": recommended_learning_actions,
        "career_readiness_improvement": career_readiness_improvement
    }
