import pytest
from app.models.schemas import JudgeScoreEntry
from app.algorithms.normalization import compute_normalization

def test_normalization_worked_example():
    """
    Test normalization with tough judge (Judge A: 4.0 avg) and lenient judge (Judge B: 8.5 avg)
    """
    scores = [
        # Judge A (Tough)
        JudgeScoreEntry(judge_id="judge_a", submission_id="proj_1", raw_score=5.0),
        JudgeScoreEntry(judge_id="judge_a", submission_id="proj_2", raw_score=3.0),
        JudgeScoreEntry(judge_id="judge_a", submission_id="proj_3", raw_score=4.0),
        JudgeScoreEntry(judge_id="judge_a", submission_id="proj_4", raw_score=4.0),
        JudgeScoreEntry(judge_id="judge_a", submission_id="proj_5", raw_score=4.0),
        
        # Judge B (Lenient)
        JudgeScoreEntry(judge_id="judge_b", submission_id="proj_1", raw_score=9.0),
        JudgeScoreEntry(judge_id="judge_b", submission_id="proj_2", raw_score=8.0),
        JudgeScoreEntry(judge_id="judge_b", submission_id="proj_3", raw_score=8.5),
        JudgeScoreEntry(judge_id="judge_b", submission_id="proj_4", raw_score=8.5),
        JudgeScoreEntry(judge_id="judge_b", submission_id="proj_5", raw_score=8.5),
    ]

    result = compute_normalization(scores)
    assert result.status == "success"
    assert result.total_submissions == 5
    assert len(result.standings) == 5

    # Project 1 was highest rated by both judges (5.0 by Judge A, 9.0 by Judge B)
    assert result.standings[0].submission_id == "proj_1"
    assert result.standings[0].rank == 1

    # Project 2 was lowest rated by both judges (3.0 by Judge A, 8.0 by Judge B)
    assert result.standings[-1].submission_id == "proj_2"
    assert result.standings[-1].rank == 5
