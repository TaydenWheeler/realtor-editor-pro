import path from "path"

// FFmpeg binary paths
export const FFMPEG_PATH = path.join(process.env.HOME || "", "bin", "ffmpeg")
export const FFPROBE_PATH = path.join(process.env.HOME || "", "bin", "ffprobe")

// Output specs for all videos
export const VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
  codec: "libx264",
  audioCodec: "aac",
  audioBitrate: "192k",
  crf: 18, // quality: lower = better, 18 is visually lossless
  preset: "medium",
  format: "9:16", // vertical
}

// Clip duration targets (seconds) for Videos 1 & 2
export const CLIP_DURATIONS = {
  exterior: 4.5,
  hook: 4,
  kitchen: 3.5,
  living: 3.5,
  bedroom: 3,
  bathroom: 3,
  detail: 2.5,
}

// Project directories
export const DIRS = {
  testFootage: path.join(process.cwd(), "test-footage"),
  uploads: path.join(process.cwd(), "uploads"),
  output: path.join(process.cwd(), "output"),
  music: path.join(process.cwd(), "public", "music"),
  temp: path.join(process.cwd(), ".tmp"),
}
