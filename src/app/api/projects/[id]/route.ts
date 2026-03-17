import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { Project } from "../route"

const DATA_DIR = path.join(process.cwd(), "data")
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json")

function readProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_FILE)) return []
  return JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8"))
}

function writeProjects(projects: Project[]) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2))
}

// GET /api/projects/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const projects = readProjects()
  const project = projects.find((p) => p.id === params.id)
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }
  return NextResponse.json(project)
}

// PATCH /api/projects/[id] — update project fields
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const projects = readProjects()
  const idx = projects.findIndex((p) => p.id === params.id)
  if (idx === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const updates = await req.json()
  projects[idx] = { ...projects[idx], ...updates }
  writeProjects(projects)

  return NextResponse.json(projects[idx])
}
