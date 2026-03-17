import { execSync } from "child_process"
import path from "path"
import fs from "fs"
import { FFMPEG_PATH, FFPROBE_PATH, VIDEO_CONFIG, DIRS } from "./config"

/**
 * Get clip info (duration, width, height, has audio)
 */
export function getClipInfo(inputPath: string) {
  const cmd = `"${FFPROBE_PATH}" -v quiet -print_format json -show_format -show_streams "${inputPath}"`
  const result = JSON.parse(execSync(cmd, { encoding: "utf-8" }))

  const videoStream = result.streams?.find((s: any) => s.codec_type === "video")
  const audioStream = result.streams?.find((s: any) => s.codec_type === "audio")

  return {
    duration: parseFloat(result.format?.duration || "0"),
    width: videoStream?.width || 0,
    height: videoStream?.height || 0,
    hasAudio: !!audioStream,
    fps: eval(videoStream?.r_frame_rate || "30") as number,
  }
}

/**
 * Normalize a clip to 1080x1920 (9:16), 30fps, H.264
 * Handles any input resolution/orientation
 */
export function normalizeClip(inputPath: string, outputPath: string): string {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  const { width, height } = VIDEO_CONFIG

  // Scale + pad to exact 1080x1920, maintaining aspect ratio
  // crop from center if needed, then scale
  const filterComplex = [
    `scale=${width}:${height}:force_original_aspect_ratio=increase`,
    `crop=${width}:${height}`,
    `fps=${VIDEO_CONFIG.fps}`,
    `format=yuv420p`,
  ].join(",")

  const cmd = [
    `"${FFMPEG_PATH}"`,
    `-y`, // overwrite
    `-i "${inputPath}"`,
    `-vf "${filterComplex}"`,
    `-c:v ${VIDEO_CONFIG.codec}`,
    `-crf ${VIDEO_CONFIG.crf}`,
    `-preset ${VIDEO_CONFIG.preset}`,
    `-an`, // strip audio for b-roll clips (we add music later)
    `-movflags +faststart`,
    `"${outputPath}"`,
  ].join(" ")

  execSync(cmd, { stdio: "pipe" })
  return outputPath
}

/**
 * Normalize a clip but KEEP its original audio (for hook/walkthrough clips)
 */
export function normalizeClipWithAudio(inputPath: string, outputPath: string): string {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  const { width, height } = VIDEO_CONFIG

  const filterComplex = [
    `scale=${width}:${height}:force_original_aspect_ratio=increase`,
    `crop=${width}:${height}`,
    `fps=${VIDEO_CONFIG.fps}`,
    `format=yuv420p`,
  ].join(",")

  const cmd = [
    `"${FFMPEG_PATH}"`,
    `-y`,
    `-i "${inputPath}"`,
    `-vf "${filterComplex}"`,
    `-c:v ${VIDEO_CONFIG.codec}`,
    `-crf ${VIDEO_CONFIG.crf}`,
    `-preset ${VIDEO_CONFIG.preset}`,
    `-c:a ${VIDEO_CONFIG.audioCodec}`,
    `-b:a ${VIDEO_CONFIG.audioBitrate}`,
    `-movflags +faststart`,
    `"${outputPath}"`,
  ].join(" ")

  execSync(cmd, { stdio: "pipe" })
  return outputPath
}

/**
 * Trim a clip to a specific duration (from the start)
 */
export function trimClip(inputPath: string, outputPath: string, durationSec: number): string {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  const cmd = [
    `"${FFMPEG_PATH}"`,
    `-y`,
    `-i "${inputPath}"`,
    `-t ${durationSec}`,
    `-c copy`,
    `"${outputPath}"`,
  ].join(" ")

  execSync(cmd, { stdio: "pipe" })
  return outputPath
}
