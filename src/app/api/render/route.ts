import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { renderVideo1 } from "@/lib/ffmpeg/render-video1"
import { renderVideo2 } from "@/lib/ffmpeg/render-video2"

const DATA_DIR = path.join(process.cwd(), "data")
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json")
const UPLOADS_DIR = path.join(process.cwd(), "uploads")
const MUSIC_DIR = path.join(process.cwd(), "public", "music")

function readProjects(): any[] {
  if (!fs.existsSync(PROJECTS_FILE)) return []
  return JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8"))
}

function writeProjects(projects: any[]) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2))
}

// POST /api/render — render videos for a project
export async function POST(req: NextRequest) {
  try {
    const { projectId, clips } = await req.json()

    if (!projectId || !clips) {
      return NextResponse.json(
        { error: "projectId and clips are required" },
        { status: 400 }
      )
    }

    // Load project
    const projects = readProjects()
    const idx = projects.findIndex((p: any) => p.id === projectId)
    if (idx === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[idx]

    // Update status to processing
    project.status = "processing"
    project.clips = clips
    writeProjects(projects)

    // Resolve clip paths — clips object maps role to filename
    const projectUploads = path.join(UPLOADS_DIR, projectId)
    const resolvedClips: Record<string, string> = {}
    for (const [role, filename] of Object.entries(clips)) {
      if (filename) {
        resolvedClips[role] = path.join(projectUploads, filename as string)
      }
    }

    // Pick a music track (first MP3 in the music dir)
    const musicFiles = fs.readdirSync(MUSIC_DIR).filter((f) => f.endsWith(".mp3"))
    if (musicFiles.length === 0) {
      project.status = "failed"
      writeProjects(projects)
      return NextResponse.json({ error: "No music tracks found" }, { status: 500 })
    }
    const musicPath = path.join(MUSIC_DIR, musicFiles[0])

    const results: Record<string, string> = {}

    // Render Video 1 — Text Hook (needs exterior + B-roll)
    if (resolvedClips.exterior && resolvedClips.kitchen) {
      try {
        console.log("[Render API] Starting Video 1...")
        const v1 = renderVideo1({
          projectId,
          clips: {
            exterior: resolvedClips.exterior,
            kitchen: resolvedClips.kitchen,
            dining: resolvedClips.dining,
            living: resolvedClips.living || resolvedClips.kitchen,
            bedroom: resolvedClips.bedroom || resolvedClips.kitchen,
            bathroom: resolvedClips.bathroom || resolvedClips.kitchen,
            detail: resolvedClips.detail,
          },
          homeInfo: {
            price: project.price,
            beds: project.beds,
            baths: project.baths,
            sqft: project.sqft,
            location: project.location,
            state: project.state,
          },
          musicPath,
        })
        results.video1 = v1
      } catch (err: any) {
        console.error("[Render API] Video 1 failed:", err.message)
      }
    }

    // Render Video 2 — Talking Head (needs hook + B-roll)
    if (resolvedClips.hook && resolvedClips.kitchen) {
      try {
        console.log("[Render API] Starting Video 2...")
        const v2 = renderVideo2({
          projectId,
          clips: {
            hook: resolvedClips.hook,
            exterior: resolvedClips.exterior,
            kitchen: resolvedClips.kitchen,
            dining: resolvedClips.dining,
            living: resolvedClips.living || resolvedClips.kitchen,
            bedroom: resolvedClips.bedroom || resolvedClips.kitchen,
            bathroom: resolvedClips.bathroom || resolvedClips.kitchen,
            detail: resolvedClips.detail,
          },
          musicPath,
        })
        results.video2 = v2
      } catch (err: any) {
        console.error("[Render API] Video 2 failed:", err.message)
      }
    }

    // Update project with results
    project.status = Object.keys(results).length > 0 ? "complete" : "failed"
    project.videos = results
    writeProjects(projects)

    return NextResponse.json({
      projectId,
      status: project.status,
      videos: results,
    })
  } catch (err: any) {
    console.error("[Render API] Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
