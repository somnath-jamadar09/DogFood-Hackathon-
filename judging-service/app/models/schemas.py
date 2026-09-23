from pydantic import BaseModel, Field
from typing import List, Optional

class JudgeScoreEntry(BaseModel):
    score_id: Optional[str] = Field(None, description="Score record ID")
    judge_id: str = Field(..., description="Unique judge identifier")
    submission_id: str = Field(..., description="Unique project submission identifier")
    raw_score: float = Field(..., ge=1.0, le=10.0, description="Raw weighted score")

class NormalizationRequest(BaseModel):
    event_id: Optional[str] = "hackathon-raptors-2026"
    scores: List[JudgeScoreEntry]
    bayesian_prior_k: float = Field(default=3.0, ge=1.0, le=10.0)

class ProjectStanding(BaseModel):
    submission_id: str
    raw_mean: float
    normalized_score: float = Field(..., ge=0.0, le=100.0)
    z_score_mean: float
    ballot_count: int
    rank: int

class JudgeCalibrationMetric(BaseModel):
    judge_id: str
    sample_size: int
    raw_mean: float
    raw_std: float
    bayesian_shrunk_mean: float

class NormalizedScoreEntry(BaseModel):
    score_id: Optional[str] = None
    submission_id: str
    judge_id: str
    normalized_score: float

class NormalizationResponse(BaseModel):
    status: str = "success"
    algorithm: str = "Z-Score + Empirical Bayesian Shrinkage"
    total_submissions: int
    total_scores_processed: int
    judge_calibrations: List[JudgeCalibrationMetric]
    standings: List[ProjectStanding]
    normalized_scores: List[NormalizedScoreEntry]

class PairwiseComparison(BaseModel):
    submission_a: str
    submission_b: str
    winner: str # submission_a or submission_b

class PairwiseRankRequest(BaseModel):
    comparisons: List[PairwiseComparison]
    max_iterations: int = 100
    tolerance: float = 1e-6

class PairwiseRankResponse(BaseModel):
    status: str = "success"
    standings: List[dict] # { submission_id, latent_score, rank }
