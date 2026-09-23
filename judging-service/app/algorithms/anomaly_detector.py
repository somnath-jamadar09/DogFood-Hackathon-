import numpy as np
from typing import List, Dict

def detect_voting_anomalies(timestamps: List[float], max_velocity_per_minute: int = 15) -> Dict[str, any]:
    """
    Sliding window velocity spike detector for public community voting logs.
    """
    if not timestamps or len(timestamps) < 2:
        return {"anomaly_detected": False, "max_velocity": len(timestamps), "flagged_windows": 0}

    sorted_times = sorted(timestamps)
    window_seconds = 60.0
    flagged = 0
    max_count = 0

    left = 0
    for right in range(len(sorted_times)):
        while sorted_times[right] - sorted_times[left] > window_seconds:
            left += 1
        current_window_count = right - left + 1
        if current_window_count > max_count:
            max_count = current_window_count
        if current_window_count > max_velocity_per_minute:
            flagged += 1

    return {
        "anomaly_detected": max_count > max_velocity_per_minute,
        "max_velocity_per_minute": max_count,
        "flagged_windows": flagged
    }
