import fs from "fs"
import path from "path"
import { DIRS } from "./config"
import { normalizeClip, trimClip } from "./normalize"
import { concatClips } from "./concat"
import { mixMusic } from "./audio"
import { detectBeats, assignClipsToBeatIntervals } from "./beats"

export interface RenderVideo1Input {
  projectId: string
  clips: {
    exterior: string
    kitchen: string
    dining?: string
    living: string
    bedroom: string
    bathroom: string
    detail?: string
  }
  homeInfo: {
    price: string
    beds: string
    baths: string
    sqft: string
    location: string
    state: string
  }
  musicPath: string
}

/**
 * Render Video 1 — Text Hook
 *
 * Flow:
 *   1. Detect beats in music track
 *   2. Normalize each B-roll clip
 *   3. Trim each clip to match beat intervals (cuts land on beats)
 *   4. Concat all clips in order
 *   5. Apply text overlay to the ENTIRE concatenated video
 *   6. Mix background music at -16.6dB
 *   7. Export final MP4
 *
 * Clip order: exterior → kitchen → dining → living → bathroom → bedroom → details
 */
export function renderVideo1(input: RenderVideo1Input): string {
  const { projectId, clips, homeInfo, musicPath } = input

  const tmpDir = path.join(DIRS.temp, projectId, "v1")
  const outputDir = path.join(DIRS.output, projectId)
  fs.mkdirSync(tmpDir, { recursive: true })
  fs.mkdirSync(outputDir, { recursive: true })

  console.log(`[Video 1] Starting render for project ${projectId}`)

  // Step 1: Detect beats in the music
  console.log("[Video 1] Detecting beats in music...")
  const beats = detectBeats(musicPath)
  console.log(`[Video 1] Found ${beats.length} beats`)

  // Step 2: Build clip list in correct order
  const clipOrder: { name: string; file: string }[] = [
    { name: "exterior", file: clips.exterior },
    { name: "kitchen", file: clips.kitchen },
  ]
  if (clips.dining) clipOrder.push({ name: "dining", file: clips.dining })
  clipOrder.push(
    { name: "living", file: clips.living },
    { name: "bathroom", file: clips.bathroom },
    { name: "bedroom", file: clips.bedroom },
  )
  if (clips.detail) clipOrder.push({ name: "detail", file: clips.detail })

  // Step 3: Get beat intervals for each clip
  const intervals = assignClipsToBeatIntervals(beats, clipOrder.length)
  console.log(
    "[Video 1] Beat intervals:",
    intervals.map((iv) => `${iv.duration.toFixed(2)}s`)
  )

  // Step 4: Normalize + trim each clip to its beat interval duration
  const trimmedClips: string[] = []
  for (let i = 0; i < clipOrder.length; i++) {
    const { name, file } = clipOrder[i]
    const duration = intervals[i]?.duration || 3 // fallback 3s
    console.log(`[Video 1] Normalizing + trimming ${name} (${duration.toFixed(2)}s)...`)

    const normalized = normalizeClip(
      file,
      path.join(tmpDir, `norm_${name}.mp4`)
    )
    const trimmed = trimClip(
      normalized,
      path.join(tmpDir, `trim_${name}.mp4`),
      duration
    )
    trimmedClips.push(trimmed)
  }

  // Step 5: Concat all clips
  console.log("[Video 1] Concatenating clips...")
  const concatPath = path.join(tmpDir, "concat.mp4")
  concatClips(trimmedClips, concatPath)

  // Step 6: Apply text overlay to the ENTIRE concatenated video
  console.log("[Video 1] Applying text overlay to full video...")
  const overlayPath = path.join(tmpDir, "overlay.mp4")
  applyFullVideoTextOverlay(concatPath, overlayPath, homeInfo)

  // Step 7: Mix background music at -16.6dB (≈ volume 0.148)
  // -16.6dB = 10^(-16.6/20) ≈ 0.148
  console.log("[Video 1] Mixing music at -16.6dB...")
  const finalPath = path.join(outputDir, "video1_text_hook.mp4")
  mixMusic(overlayPath, musicPath, finalPath, 0.148)

  console.log(`[Video 1] Done! Output: ${finalPath}`)
  return finalPath
}

/**
 * Apply text overlay to the entire video (not just first clip).
 * Text stays on screen the whole time — price on top, beds/baths below.
 */
function applyFullVideoTextOverlay(
  inputPath: string,
  outputPath: string,
  homeInfo: {
    price: string
    beds: string
    baths: string
    sqft: string
    location: string
    state: string
  }
): string {
  const { execSync } = require("child_process")
  const { FFMPEG_PATH, VIDEO_CONFIG } = require("./config")

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  const priceText = `\\$${homeInfo.price}`
  const detailsText = `${homeInfo.beds} bed   ${homeInfo.baths} bath   ${homeInfo.sqft} sqft`
  const locationText = `${homeInfo.location}  ·  ${homeInfo.state}`

  // White text, centered, clean look — stays on entire video
  const filters = [
    `drawtext=text='${priceText}':fontsize=72:fontcolor=white:fontfile=/System/Library/Fonts/Helvetica.ttc:x=(w-tw)/2:y=h*0.72:shadowcolor=black@0.5:shadowx=2:shadowy=2`,
    `drawtext=text='${detailsText}':fontsize=36:fontcolor=white@0.85:fontfile=/System/Library/Fonts/Helvetica.ttc:x=(w-tw)/2:y=h*0.72+85:shadowcolor=black@0.4:shadowx=1:shadowy=1`,
    `drawtext=text='${locationText}':fontsize=34:fontcolor=white@0.7:fontfile=/System/Library/Fonts/Helvetica.ttc:x=(w-tw)/2:y=h*0.72+130:shadowcolor=black@0.4:shadowx=1:shadowy=1`,
  ].join(",")

  const cmd = [
    `"${FFMPEG_PATH}"`,
    `-y`,
    `-i "${inputPath}"`,
    `-vf "${filters}"`,
    `-c:v ${VIDEO_CONFIG.codec}`,
    `-crf ${VIDEO_CONFIG.crf}`,
    `-preset ${VIDEO_CONFIG.preset}`,
    `-an`,
    `-movflags +faststart`,
    `"${outputPath}"`,
  ].join(" ")

  execSync(cmd, { stdio: "pipe" })
  return outputPath
}
