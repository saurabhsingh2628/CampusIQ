from fastapi import FastAPI

app = FastAPI(
    title="CampusIQ API",
    description="AI-Powered Student Intelligence and Career Management System",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "Welcome to CampusIQ API",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CampusIQ Backend",
    }