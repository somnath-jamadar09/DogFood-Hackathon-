import numpy as np
from typing import List, Dict
from ..models.schemas import (
    JudgeScoreEntry, 
    JudgeCalibrationMetric, 
    ProjectStanding, 
    NormalizedScoreEntry, 
    NormalizationResponse
)

def compute_normalization(scores: List[JudgeScoreEntry], bayesian_prior_k: float = 3.0) -> NormalizationResponse:
    if not scores:
        return NormalizationResponse(
            total_submissions=0,
            total_scores_processed=0,
            judge_calibrations=[],
            standings=[],
            normalized_scores=[]
        )

    # 1. Compute Global Population Mean
    all_raw_scores = [s.raw_score for s in scores]
    mu_global = float(np.mean(all_raw_scores))

    # 2. Group by Judge
    judge_data: Dict[str, List[float]] = {}
    for s in scores:
        judge_data.setdefault(s.judge_id, []).append(s.raw_score)

    judge_calibrations: List[JudgeCalibrationMetric] = []
    judge_stats: Dict[str, dict] = {}

    epsilon = 1e-6

    for judge_id, raw_vals in judge_data.items():
        n_j = len(raw_vals)
        mu_j = float(np.mean(raw_vals))
        sigma_j = float(np.std(raw_vals)) + epsilon

        # Empirical Bayesian Shrinkage when sample size n_j < 5
        if n_j < 5:
            weight_sample = n_j / (n_j + bayesian_prior_k)
            weight_prior = bayesian_prior_k / (n_j + bayesian_prior_k)
            mu_shrunk = (weight_sample * mu_j) + (weight_prior * mu_global)
        else:
            mu_shrunk = mu_j

        judge_stats[judge_id] = {
            "n_j": n_j,
            "mu_j": mu_j,
            "sigma_j": sigma_j,
            "mu_shrunk": mu_shrunk
        }

        judge_calibrations.append(JudgeCalibrationMetric(
            judge_id=judge_id,
            sample_size=n_j,
            raw_mean=round(mu_j, 2),
            raw_std=round(sigma_j, 2),
            bayesian_shrunk_mean=round(mu_shrunk, 2)
        ))

    # 3. Calculate Normalized Z-Scores per Score Record
    submission_z_scores: Dict[str, List[float]] = {}
    submission_raw_scores: Dict[str, List[float]] = {}
    normalized_entries: List[NormalizedScoreEntry] = []

    # Temporary list of raw Zs to compute min/max for scaling
    raw_z_records = []

    for s in scores:
        stats = judge_stats[s.judge_id]
        z_ij = (s.raw_score - stats["mu_shrunk"]) / stats["sigma_j"]
        raw_z_records.append((s, z_ij))

        submission_z_scores.setdefault(s.submission_id, []).append(z_ij)
        submission_raw_scores.setdefault(s.submission_id, []).append(s.raw_score)

    all_z = [item[1] for item in raw_z_records]
    min_z = float(np.min(all_z)) if all_z else 0.0
    max_z = float(np.max(all_z)) if all_z else 1.0
    z_range = (max_z - min_z) + epsilon

    for s, z_ij in raw_z_records:
        # Scale each individual score to 0 - 100
        scaled_score = 100.0 * ((z_ij - min_z) / z_range)
        normalized_entries.append(NormalizedScoreEntry(
            score_id=s.score_id,
            submission_id=s.submission_id,
            judge_id=s.judge_id,
            normalized_score=round(float(np.clip(scaled_score, 0.0, 100.0)), 2)
        ))

    # 4. Aggregate standings per project
    standings: List[ProjectStanding] = []
    project_scores_for_rescale = []

    for sub_id, z_list in submission_z_scores.items():
        mean_z = float(np.mean(z_list))
        raw_vals = submission_raw_scores[sub_id]
        raw_mean = float(np.mean(raw_vals))
        project_scores_for_rescale.append((sub_id, raw_mean, mean_z, len(z_list)))

    all_sub_z = [item[2] for item in project_scores_for_rescale]
    sub_min_z = float(np.min(all_sub_z)) if all_sub_z else 0.0
    sub_max_z = float(np.max(all_sub_z)) if all_sub_z else 1.0
    sub_range = (sub_max_z - sub_min_z) + epsilon

    for sub_id, raw_mean, mean_z, count in project_scores_for_rescale:
        final_100 = 100.0 * ((mean_z - sub_min_z) / sub_range)
        standings.append(ProjectStanding(
            submission_id=sub_id,
            raw_mean=round(raw_mean, 2),
            normalized_score=round(float(np.clip(final_100, 0.0, 100.0)), 2),
            z_score_mean=round(mean_z, 4),
            ballot_count=count,
            rank=0
        ))

    # Sort descending by normalized score and assign ranks
    standings.sort(key=lambda x: x.normalized_score, reverse=True)
    for idx, item in enumerate(standings):
        item.rank = idx + 1

    return NormalizationResponse(
        status="success",
        total_submissions=len(standings),
        total_scores_processed=len(scores),
        judge_calibrations=judge_calibrations,
        standings=standings,
        normalized_scores=normalized_entries
    )
