import fs from "fs"
import path from "path"
import { DIRS } from "./config"
import { normalizeClip, normalizeClipWithAudio, trimClip } from "./normalize"
import { concatClips } from "./concat"
import { mixMusicUnderVoice } from "./audio"
import { detectBeats, assignClipsToBeatIntervals } from "./beats"

export interface RenderVideo2Input {
  projectId: string
  clips: {
    hook: string // selfie clip with talking
    exterior?: string
    kitchen: string
    dining?: string
    living: string
    bedroom: string
    bathroom: string
    detail?: string
  }
  musicPath: string
}

/**
 * Render Video 2 — Talking Head Hook
 *
 * Flow:
 *   1. Normalize hook clip WITH audio → trim tight (no dead air)
 *   2. Detect beats in music
 *   3. Normalize + trim each B-roll clip to beat intervals
 *   4. Add silent audio to B-roll for concat compatibility
 *   5. Concat hook + exterior + B-roll
 *   6. Mix music under voice at -16.6dB
 *   7. Export final MP4
 *
 * Clip order: hook → exterior → kitchen → dining → living → bathroom → bedroom → details
 */
export function renderVideo2(input: RenderVideo2Input): string {
  const { projectId, clips, musicPath } = input

  const tmpDir = path.join(DIRS.temp, projectId, "v2")
  const outputDir = path.join(DIRS.output, projectId)
  fs.mkdirSync(tmpDir, { recursive: true })
  fs.mkdirSync(outputDir, { recursive: true })

  console.log(`[Video 2] Starting render for project ${projectId}`)

  // Step 1: Normalize hook clip WITH audio (this has the realtor's voice)
  console.log("[Video 2] Normalizing hook clip (keeping audio)...")
  const normHook = normalizeClipWithAudio(
    clips.hook,
    path.join(tmpDir, "norm_hook.mp4")
  )

  // Trim hook to ~4s (tight, no dead air)
  console.log("[Video 2] Trimming hook...")
  const trimmedHook = trimClip(
    normHook,
    path.join(tmpDir, "trim_hook.mp4"),
    4
  )

  // Step 2: Detect beats in music
  console.log("[Video 2] Detecting beats in music...")
  const beats = detectBeats(musicPath)
  console.log(`[Video 2] Found ${beats.length} beats`)

  // Step 3: Build B-roll clip list in correct order
  // hook → exterior → kitchen → dining → living → bathroom → bedroom → details
  const brollOrder: { name: string; file: string }[] = []
  if (clips.exterior) brollOrder.push({ name: "exterior", file: clips.exterior })
  brollOrder.push({ name: "kitchen", file: clips.kitchen })
  if (clips.dining) brollOrder.push({ name: "dining", file: clips.dining })
  brollOrder.push(
    { name: "living", file: clips.living },
    { name: "bathroom", file: clips.bathroom },
    { name: "bedroom", file: clips.bedroom },
  )
  if (clips.detail) brollOrder.push({ name: "detail", file: clips.detail })

  // Step 4: Get beat intervals for B-roll clips
  const intervals = assignClipsToBeatIntervals(beats, brollOrder.length)
  console.log(
    "[Video 2] Beat intervals:",
    intervals.map((iv) => `${iv.duration.toFixed(2)}s`)
  )

  // Step 5: Normalize + trim each B-roll clip (no audio — music only)
  const trimmedBroll: string[] = []
  for (let i = 0; i < brollOrder.length; i++) {
    const { name, file } = brollOrder[i]
    const duration = intervals[i]?.duration || 3
    console.log(`[Video 2] Normalizing + trimming ${name} (${duration.toFixed(2)}s)...`)

    const normalized = normalizeClip(
      file,
      path.join(tmpDir, `norm_${name}.mp4`)
    )
    const trimmed = trimClip(
      normalized,
      path.join(tmpDir, `trim_${name}.mp4`),
      duration
    )
    trimmedBroll.push(trimmed)
  }

  // Step 6: Add silent audio to B-roll clips so concat works with hook's audio stream
  console.log("[Video 2] Adding silent audio to B-roll clips...")
  const brollWithSilence: string[] = []
  for (let i = 0; i < trimmedBroll.length; i++) {
    const silentPath = path.join(tmpDir, `silent_broll_${i}.mp4`)
    addSilentAudio(trimmedBroll[i], silentPath)
    brollWithSilence.push(silentPath)
  }

  // Step 7: Concat hook + B-roll
  console.log("[Video 2] Concatenating clips...")
  const concatPath = path.join(tmpDir, "concat.mp4")
  concatClips([trimmedHook, ...brollWithSilence], concatPath)

  // Step 8: Mix music under the voice at -16.6dB (≈ volume 0.148)
  // Music is subtle — voice stays clear during hook, then music fills B-roll
  console.log("[Video 2] Mixing music under voice at -16.6dB...")
  const finalPath = path.join(outputDir, "video2_talking_head.mp4")
  mixMusicUnderVoice(concatPath, musicPath, finalPath, 0.148)

  console.log(`[Video 2] Done! Output: ${finalPath}`)
  return finalPath
}

/**
 * Add a silent audio track to a video that has no audio.
 * This is needed so concat works when mixing clips with and without audio.
 */
function addSilentAudio(inputPath: string, outputPath: string): string {
  const { execSync } = require("child_process")
  const { FFMPEG_PATH, VIDEO_CONFIG } = require("./config")

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  const cmd = [
    `"${FFMPEG_PATH}"`,
    `-y`,
    `-i "${inputPath}"`,
    `-f lavfi -i anullsrc=r=44100:cl=stereo`,
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
