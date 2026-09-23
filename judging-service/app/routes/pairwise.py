from fastapi import APIRouter, HTTPException
from ..models.schemas import PairwiseRankRequest, PairwiseRankResponse
from ..algorithms.pairwise import solve_bradley_terry

router = APIRouter(prefix="/api/v1", tags=["Pairwise"])

@router.post("/pairwise-rank", response_model=PairwiseRankResponse)
def rank_pairwise_comparisons(request: PairwiseRankRequest):
    try:
        return solve_bradley_terry(
            comparisons=request.comparisons,
            max_iterations=request.max_iterations,
            tolerance=request.tolerance
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pairwise ranking failed: {str(e)}")
