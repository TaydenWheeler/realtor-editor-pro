/**
 * Test script — renders Video 1 and Video 2 using real test footage.
 *
 * Run with: npx tsx scripts/test-render.ts
 *
 * Clip mapping (based on typical filming order):
 *   IMG_5545 → Exterior (12s)
 *   IMG_5546 → Hook selfie (22s)
 *   IMG_5548 → Kitchen (11s)
 *   IMG_5549 → Living room (7s)
 *   IMG_5550 → Bedroom (6s)
 *   IMG_5551 → Bathroom (5s)
 *   IMG_5552 → Detail (2s)
 */

import path from "path"
import { renderVideo1 } from "../src/lib/ffmpeg/render-video1"
import { renderVideo2 } from "../src/lib/ffmpeg/render-video2"

const BASE = path.join(process.cwd(), "test-footage")
const MUSIC = path.join(process.cwd(), "public", "music", "ReelAudio-21704.mp3")

const clips = {
  exterior: path.join(BASE, "IMG_5545.MOV"),
  hook: path.join(BASE, "IMG_5546.MOV"),
  kitchen: path.join(BASE, "IMG_5548.MOV"),
  living: path.join(BASE, "IMG_5549.MOV"),
  bedroom: path.join(BASE, "IMG_5550.MOV"),
  bathroom: path.join(BASE, "IMG_5551.MOV"),
  detail: path.join(BASE, "IMG_5552.MOV"),
}

const homeInfo = {
  price: "604,990",
  beds: "4",
  baths: "2.5",
  sqft: "3,434",
  location: "Saratoga Springs",
  state: "Utah",
}

async function main() {
  const start = Date.now()

  console.log("\n========================================")
  console.log("  RENDERING VIDEO 1 — TEXT HOOK")
  console.log("========================================\n")

  try {
    const v1 = renderVideo1({
      projectId: "test-001",
      clips: {
        exterior: clips.exterior,
        kitchen: clips.kitchen,
        living: clips.living,
        bedroom: clips.bedroom,
        bathroom: clips.bathroom,
        detail: clips.detail,
      },
      homeInfo,
      musicPath: MUSIC,
    })
    console.log(`\nVideo 1 saved to: ${v1}`)
  } catch (err) {
    console.error("\nVideo 1 FAILED:", err)
  }

  console.log("\n========================================")
  console.log("  RENDERING VIDEO 2 — TALKING HEAD")
  console.log("========================================\n")

  try {
    const v2 = renderVideo2({
      projectId: "test-001",
      clips: {
        hook: clips.hook,
        exterior: clips.exterior,
        kitchen: clips.kitchen,
        living: clips.living,
        bedroom: clips.bedroom,
        bathroom: clips.bathroom,
        detail: clips.detail,
      },
      musicPath: MUSIC,
    })
    console.log(`\nVideo 2 saved to: ${v2}`)
  } catch (err) {
    console.error("\nVideo 2 FAILED:", err)
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`\nTotal time: ${elapsed}s`)
}

main()
