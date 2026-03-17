import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import { FFMPEG_PATH, FFPROBE_PATH, VIDEO_CONFIG } from "./config"

/**
 * Mix a background music track into a video (replacing any existing audio)
 * - Fades music in over 0.5s
 * - Fades music out over last 1.5s
 * - Trims music to match video length
 */
export function mixMusic(
  videoPath: string,
  musicPath: string,
  outputPath: string,
  musicVolume: number = 0.7
): string {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  // Get video duration
  const durationCmd = `"${FFPROBE_PATH}" -v quiet -show_entries format=duration -of csv=p=0 "${videoPath}"`
  const duration = parseFloat(execSync(durationCmd, { encoding: "utf-8" }).trim())

  const fadeOutStart = Math.max(0, duration - 1.5)

  const audioFilter = [
    `volume=${musicVolume}`,
    `afade=t=in:st=0:d=0.5`,
    `afade=t=out:st=${fadeOutStart}:d=1.5`,
  ].join(",")

  const cmd = [
    `"${FFMPEG_PATH}"`,
    `-y`,
    `-i "${videoPath}"`,
    `-i "${musicPath}"`,
    `-filter_complex "[1:a]${audioFilter}[music];[music]atrim=0:${duration}[trimmed]"`,
    `-map 0:v`,
    `-map "[trimmed]"`,
    `-c:v copy`,
    `-c:a ${VIDEO_CONFIG.audioCodec}`,
    `-b:a ${VIDEO_CONFIG.audioBitrate}`,
    `-shortest`,
    `-movflags +faststart`,
    `"${outputPath}"`,
  ].join(" ")

  execSync(cmd, { stdio: "pipe" })
  return outputPath
}

/**
 * Mix music under existing voice audio (for walkthrough videos)
 * Music plays at a lower volume so voice is clear
 */
export function mixMusicUnderVoice(
  videoPath: string,
  musicPath: string,
  outputPath: string,
  musicVolume: number = 0.15
): string {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  const durationCmd = `"${FFPROBE_PATH}" -v quiet -show_entries format=duration -of csv=p=0 "${videoPath}"`
  const duration = parseFloat(execSync(durationCmd, { encoding: "utf-8" }).trim())

  const fadeOutStart = Math.max(0, duration - 2)

  const cmd = [
    `"${FFMPEG_PATH}"`,
    `-y`,
    `-i "${videoPath}"`,
    `-i "${musicPath}"`,
    `-filter_complex`,
    `"[1:a]volume=${musicVolume},afade=t=in:st=0:d=1,afade=t=out:st=${fadeOutStart}:d=2,atrim=0:${duration}[music];[0:a][music]amix=inputs=2:duration=first:dropout_transition=2[aout]"`,
    `-map 0:v`,
    `-map "[aout]"`,
    `-c:v copy`,
    `-c:a ${VIDEO_CONFIG.audioCodec}`,
    `-b:a ${VIDEO_CONFIG.audioBitrate}`,
    `-movflags +faststart`,
    `"${outputPath}"`,
  ].join(" ")

  execSync(cmd, { stdio: "pipe" })
  return outputPath
}
