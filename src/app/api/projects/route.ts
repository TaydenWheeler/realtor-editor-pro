import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json")

export interface Project {
  id: string
  title: string
  price: string
  beds: string
  baths: string
  sqft: string
  location: string
  state: string
  agentName: string
  ctaScript: string
  status: "uploading" | "analyzing" | "processing" | "review" | "complete" | "failed"
  createdAt: string
  files: string[]
  clips: Record<string, string>
  videos: {
    video1?: string
    video2?: string
    video3?: string
  }
}

function readProjects(): Project[] {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(PROJECTS_FILE)) return []
  return JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8"))
}

function writeProjects(projects: Project[]) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2))
}

// GET /api/projects — list all projects
export async function GET() {
  const projects = readProjects()
  return NextResponse.json(projects)
}

// POST /api/projects — create a new project
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { price, beds, baths, sqft, location, state, agentName, ctaScript, files } = body

    if (!price || !location || !state) {
      return NextResponse.json({ error: "price, location, and state are required" }, { status: 400 })
    }

    const id = `proj-${Date.now()}`
    const title = `${location}, ${state} — $${price}`

    const project: Project = {
      id,
      title,
      price,
      beds: beds || "",
      baths: baths || "",
      sqft: sqft || "",
      location,
      state,
      agentName: agentName || "",
      ctaScript: ctaScript || "",
      status: "uploading",
      createdAt: new Date().toISOString(),
      files: files || [],
      clips: {},
      videos: {},
    }

    const projects = readProjects()
    projects.push(project)
    writeProjects(projects)

    return NextResponse.json(project, { status: 201 })
  } catch (err: any) {
    console.error("[Projects API] Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
