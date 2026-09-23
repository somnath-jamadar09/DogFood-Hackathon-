from fastapi import APIRouter
from datetime import datetime

router = APIRouter(tags=["Health"])

@router.get("/health")
def healthcheck():
    return {
        "status": "healthy",
        "service": "Dogfood 2026 Analytics Microservice",
        "timestamp": datetime.utcnow().isoformat()
    }
