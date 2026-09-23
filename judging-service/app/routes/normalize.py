from fastapi import APIRouter, HTTPException
from ..models.schemas import NormalizationRequest, NormalizationResponse
from ..algorithms.normalization import compute_normalization

router = APIRouter(prefix="/api/v1", tags=["Normalization"])

@router.post("/normalize", response_model=NormalizationResponse)
def normalize_tournament_scores(request: NormalizationRequest):
    try:
        return compute_normalization(
            scores=request.scores, 
            bayesian_prior_k=request.bayesian_prior_k
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Normalization engine failed: {str(e)}")
