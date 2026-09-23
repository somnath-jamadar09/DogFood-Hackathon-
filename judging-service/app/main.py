from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import health, normalize, pairwise

app = FastAPI(
    title="Dogfood 2026 Analytics & Normalization Engine",
    description="Statistical score normalization, Bradley-Terry ranking, and voting anomaly detection.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(normalize.router)
app.include_router(pairwise.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
