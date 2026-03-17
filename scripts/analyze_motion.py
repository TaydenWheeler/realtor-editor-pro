"""
Optical flow-based camera motion analysis for real estate video clips.

Detects when a forward-moving camera reverses direction (pulls backward)
by computing dense optical flow and measuring the expansion/contraction
pattern of the flow field.

Forward motion → flow vectors radiate outward from center (expansion)
Backward motion → flow vectors converge toward center (contraction)

Usage: python analyze_motion.py <video_path> [--analysis-fps 10] [--threshold 0.15] [--debug]
Output: JSON with cutTimestamp and analysis details
"""

import cv2
import numpy as np
import json
import sys
import argparse


def compute_expansion_score(flow, h, w, cx, cy, outward_x, outward_y, mask):
    """
    Compute how much the optical flow aligns with the outward radial direction.
    Positive = expansion (forward), Negative = contraction (backward).
    Only considers pixels outside a small center dead zone.
    """
    flow_x = flow[:, :, 0]
    flow_y = flow[:, :, 1]

    dot_product = flow_x * outward_x + flow_y * outward_y
    return float(np.mean(dot_product[mask]))


def analyze_motion(video_path, analysis_fps=10, threshold=0.15, debug=False):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"error": f"Could not open video: {video_path}"}

    video_fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    total_duration = total_frames / video_fps if video_fps > 0 else 0

    if total_duration < 0.5:
        cap.release()
        return {
            "cutTimestamp": total_duration,
            "totalDuration": total_duration,
            "analysis": "Video too short to analyze.",
            "wasTrimmed": False,
        }

    frame_skip = max(1, int(video_fps / analysis_fps))

    ret, first_frame = cap.read()
    if not ret:
        cap.release()
        return {"error": "Could not read first frame"}

    # Downscale for faster processing — motion direction doesn't need full res
    target_width = 480
    orig_h, orig_w = first_frame.shape[:2]
    scale = target_width / orig_w
    new_w = target_width
    new_h = int(orig_h * scale)
    first_frame = cv2.resize(first_frame, (new_w, new_h))

    prev_gray = cv2.cvtColor(first_frame, cv2.COLOR_BGR2GRAY)
    prev_gray = cv2.GaussianBlur(prev_gray, (5, 5), 0)
    h, w = prev_gray.shape

    y_coords, x_coords = np.mgrid[0:h, 0:w]
    cx, cy = w / 2.0, h / 2.0
    dx = (x_coords - cx).astype(np.float32)
    dy = (y_coords - cy).astype(np.float32)
    dist = np.sqrt(dx ** 2 + dy ** 2) + 1e-6
    outward_x = dx / dist
    outward_y = dy / dist

    # Ignore a dead zone in the very center and the extreme edges
    center_radius = min(h, w) * 0.05
    edge_margin = min(h, w) * 0.05
    mask = (dist > center_radius) & \
           (x_coords > edge_margin) & (x_coords < w - edge_margin) & \
           (y_coords > edge_margin) & (y_coords < h - edge_margin)

    scores = []
    frame_idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_idx += 1

        if frame_idx % frame_skip != 0:
            continue

        frame = cv2.resize(frame, (new_w, new_h))
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (5, 5), 0)

        flow = cv2.calcOpticalFlowFarneback(
            prev_gray, gray, None,
            pyr_scale=0.5, levels=3, winsize=15,
            iterations=3, poly_n=5, poly_sigma=1.2, flags=0
        )

        expansion = compute_expansion_score(flow, h, w, cx, cy, outward_x, outward_y, mask)
        timestamp = frame_idx / video_fps

        scores.append({
            "frame": frame_idx,
            "timestamp": round(timestamp, 3),
            "expansion": round(expansion, 5),
        })

        prev_gray = gray

    cap.release()

    if len(scores) < 3:
        return {
            "cutTimestamp": total_duration,
            "totalDuration": round(total_duration, 3),
            "analysis": "Too few analyzable frames.",
            "wasTrimmed": False,
        }

    # Smooth the expansion scores to reduce noise from handheld shake
    raw = [s["expansion"] for s in scores]
    window = max(3, len(raw) // 8)
    if window % 2 == 0:
        window += 1
    smoothed = []
    for i in range(len(raw)):
        start = max(0, i - window // 2)
        end = min(len(raw), i + window // 2 + 1)
        smoothed.append(float(np.mean(raw[start:end])))

    # Detect the first sustained transition from forward to backward.
    # Require at least `min_forward_duration` seconds of forward motion
    # before we start watching for a reversal — prevents false triggers
    # from initial camera shake or a brief starting adjustment.
    min_forward_duration = 1.0
    cut_timestamp = total_duration
    forward_start = None
    forward_confirmed = False

    for i, score in enumerate(smoothed):
        ts = scores[i]["timestamp"]

        if score > threshold:
            if forward_start is None:
                forward_start = ts
            if ts - forward_start >= min_forward_duration:
                forward_confirmed = True
        else:
            if not forward_confirmed:
                forward_start = None

        if forward_confirmed and score < -threshold * 0.3:
            look_back = i
            while look_back > 0 and smoothed[look_back] < threshold * 0.5:
                look_back -= 1
            cut_timestamp = scores[look_back]["timestamp"]
            break

    was_trimmed = cut_timestamp < total_duration - 0.2

    raw_min = min(raw)
    raw_max = max(raw)

    analysis_parts = []
    if was_trimmed:
        analysis_parts.append(
            f"Forward motion detected from start to ~{cut_timestamp:.1f}s, "
            f"then camera reverses direction."
        )
    else:
        analysis_parts.append("Camera moves forward throughout the entire clip.")
    analysis_parts.append(
        f"Expansion scores ranged from {raw_min:.4f} to {raw_max:.4f} "
        f"(threshold: {threshold})."
    )

    result = {
        "cutTimestamp": round(cut_timestamp, 2),
        "totalDuration": round(total_duration, 3),
        "analysis": " ".join(analysis_parts),
        "wasTrimmed": was_trimmed,
    }

    if debug:
        result["scores"] = scores
        result["smoothed"] = [
            {"timestamp": scores[i]["timestamp"], "smoothed": round(s, 5)}
            for i, s in enumerate(smoothed)
        ]

    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Analyze camera motion in video clips")
    parser.add_argument("video_path", help="Path to video file")
    parser.add_argument("--analysis-fps", type=int, default=10,
                        help="Frames per second to analyze (default: 10)")
    parser.add_argument("--threshold", type=float, default=0.15,
                        help="Expansion score threshold for forward motion (default: 0.15)")
    parser.add_argument("--debug", action="store_true",
                        help="Include per-frame scores in output")
    args = parser.parse_args()

    result = analyze_motion(args.video_path, args.analysis_fps, args.threshold, args.debug)
    print(json.dumps(result))
