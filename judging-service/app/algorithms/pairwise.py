import numpy as np
from typing import List, Dict
from ..models.schemas import PairwiseComparison, PairwiseRankResponse

def solve_bradley_terry(
    comparisons: List[PairwiseComparison], 
    max_iterations: int = 100, 
    tolerance: float = 1e-6
) -> PairwiseRankResponse:
    """
    Minorize-Maximization (MM) algorithm for Bradley-Terry Pairwise Preference Estimation.
    """
    if not comparisons:
        return PairwiseRankResponse(status="empty", standings=[])

    # 1. Collect all distinct items
    items = set()
    for c in comparisons:
        items.add(c.submission_a)
        items.add(c.submission_b)
    
    item_list = sorted(list(items))
    n = len(item_list)
    idx_map = {item: i for i, item in enumerate(item_list)}

    # Win matrix W[i, j] = number of times item i beat item j
    W = np.zeros((n, n), dtype=float)
    wins = np.zeros(n, dtype=float)

    for c in comparisons:
        i = idx_map[c.submission_a]
        j = idx_map[c.submission_b]
        if c.winner == c.submission_a:
            W[i, j] += 1
            wins[i] += 1
        elif c.winner == c.submission_b:
            W[j, i] += 1
            wins[j] += 1

    # Total comparisons between i and j
    N = W + W.T

    # Initial latent skills p_i = 1.0 / n
    p = np.ones(n, dtype=float)

    # Iterative MM estimation
    for _ in range(max_iterations):
        p_old = p.copy()
        for i in range(n):
            denom = 0.0
            for j in range(n):
                if i != j and N[i, j] > 0:
                    denom += N[i, j] / (p_old[i] + p_old[j])
            
            p[i] = wins[i] / denom if denom > 0 else 0.0

        # Renormalize sum(p) = 1.0 to ensure numerical stability
        total_p = np.sum(p)
        if total_p > 0:
            p = p / total_p

        # Convergence test
        if np.max(np.abs(p - p_old)) < tolerance:
            break

    # Scale to 0-100 score
    max_p = np.max(p) if np.max(p) > 0 else 1.0
    scaled_scores = (p / max_p) * 100.0

    standings = []
    for i, item in enumerate(item_list):
        standings.append({
            "submission_id": item,
            "latent_skill": round(float(p[i]), 6),
            "score_100": round(float(scaled_scores[i]), 2)
        })

    standings.sort(key=lambda x: x["score_100"], reverse=True)
    for rank, entry in enumerate(standings, 1):
        entry["rank"] = rank

    return PairwiseRankResponse(status="success", standings=standings)
