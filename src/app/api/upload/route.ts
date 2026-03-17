import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const UPLOADS_DIR = path.join(process.cwd(), "uploads")

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const projectId = formData.get("projectId") as string

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 })
    }

    const projectDir = path.join(UPLOADS_DIR, projectId)
    fs.mkdirSync(projectDir, { recursive: true })

    const files = formData.getAll("files") as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    const savedFiles: { name: string; path: string; size: number }[] = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const filePath = path.join(projectDir, file.name)
      fs.writeFileSync(filePath, buffer)
      savedFiles.push({
        name: file.name,
        path: filePath,
        size: buffer.length,
      })
    }

    return NextResponse.json({
      projectId,
      files: savedFiles,
      count: savedFiles.length,
    })
  } catch (err: any) {
    console.error("[Upload API] Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
