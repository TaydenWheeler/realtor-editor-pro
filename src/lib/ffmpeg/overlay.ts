import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import { FFMPEG_PATH, DIRS, VIDEO_CONFIG } from "./config"

/**
 * Generate a text overlay PNG for Video 1 (Text Hook)
 * Uses FFmpeg's drawtext filter to create the overlay directly
 *
 * Text format:
 *   $604,990
 *   3 bed  2.5 bath  3,434 sqft
 *   Saratoga Springs · Utah
 */
export function createTextOverlayVideo(
  inputClip: string,
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
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  const priceText = `\\$${homeInfo.price}`
  const detailsText = `${homeInfo.beds} bed   ${homeInfo.baths} bath   ${homeInfo.sqft} sqft`
  const locationText = `${homeInfo.location}  ·  ${homeInfo.state}`

  // Position text in the lower-center area of the frame
  // Using drawtext filter with a semi-transparent background box
  const filters = [
    // Price — large, bold, white, center
    `drawtext=text='${priceText}':fontsize=72:fontcolor=white:fontfile=/System/Library/Fonts/Helvetica.ttc:x=(w-tw)/2:y=h*0.72:shadowcolor=black@0.5:shadowx=2:shadowy=2`,
    // Details — medium, light gray
    `drawtext=text='${detailsText}':fontsize=36:fontcolor=white@0.85:fontfile=/System/Library/Fonts/Helvetica.ttc:x=(w-tw)/2:y=h*0.72+85:shadowcolor=black@0.4:shadowx=1:shadowy=1`,
    // Location — medium, lighter gray
    `drawtext=text='${locationText}':fontsize=34:fontcolor=white@0.7:fontfile=/System/Library/Fonts/Helvetica.ttc:x=(w-tw)/2:y=h*0.72+130:shadowcolor=black@0.4:shadowx=1:shadowy=1`,
  ].join(",")

  const cmd = [
    `"${FFMPEG_PATH}"`,
    `-y`,
    `-i "${inputClip}"`,
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
