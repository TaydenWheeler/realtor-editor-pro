import { NextRequest, NextResponse } from "next/server"
import { execFile } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"

const execFileAsync = promisify(execFile)
const UPLOADS_DIR = path.join(process.cwd(), "uploads")
const VENV_PYTHON = path.join(process.cwd(), ".venv", "bin", "python")
const ANALYZE_SCRIPT = path.join(process.cwd(), "scripts", "analyze_motion.py")

interface AnalysisResult {
  cutTimestamp: number
  totalDuration: number
  analysis: string
  wasTrimmed: boolean
  error?: string
}

async function analyzeAndTrim(videoPath: string): Promise<AnalysisResult> {
  const { stdout, stderr } = await execFileAsync(VENV_PYTHON, [
    ANALYZE_SCRIPT,
    videoPath,
  ], { maxBuffer: 10 * 1024 * 1024, timeout: 120_000 })

  if (stderr) console.log("[smart-clip stderr]", stderr)

  const result: AnalysisResult = JSON.parse(stdout.trim())
  if (result.error) throw new Error(result.error)

  if (result.wasTrimmed && result.cutTimestamp < result.totalDuration - 0.1) {
    const ext = path.extname(videoPath)
    const trimmedPath = videoPath.replace(ext, `_trimmed${ext}`)

    await execFileAsync("/opt/homebrew/bin/ffmpeg", [
      "-i", videoPath,
      "-t", result.cutTimestamp.toFixed(2),
      "-c", "copy",
      "-avoid_negative_ts", "make_zero",
      "-y",
      trimmedPath,
    ])

    fs.renameSync(trimmedPath, videoPath)
    console.log(`[smart-clip] Trimmed ${path.basename(videoPath)} at ${result.cutTimestamp}s / ${result.totalDuration}s`)
  } else {
    console.log(`[smart-clip] ${path.basename(videoPath)} — no trim needed (full forward motion)`)
  }

  return result
}

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json()

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 })
    }

    const projectDir = path.join(UPLOADS_DIR, projectId)
    if (!fs.existsSync(projectDir)) {
      return NextResponse.json({ error: "Project uploads not found" }, { status: 404 })
    }

    const videoExts = [".mp4", ".mov", ".mkv", ".webm", ".avi"]
    const files = fs.readdirSync(projectDir)
      .filter((f) => videoExts.includes(path.extname(f).toLowerCase()))

    console.log(`[smart-clip] Processing ${files.length} clips for ${projectId}`)

    const results: Record<string, AnalysisResult> = {}

    for (const file of files) {
      const videoPath = path.join(projectDir, file)
      try {
        results[file] = await analyzeAndTrim(videoPath)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Analysis failed"
        console.error(`[smart-clip] Failed on ${file}:`, message)
        results[file] = {
          cutTimestamp: 0,
          totalDuration: 0,
          analysis: `Error: ${message}`,
          wasTrimmed: false,
          error: message,
        }
      }
    }

    const trimmedCount = Object.values(results).filter((r) => r.wasTrimmed).length

    return NextResponse.json({
      projectId,
      processed: files.length,
      trimmed: trimmedCount,
      results,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Smart clip failed"
    console.error("[smart-clip] Error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
