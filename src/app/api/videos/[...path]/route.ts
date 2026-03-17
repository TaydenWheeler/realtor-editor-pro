import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const OUTPUT_DIR = path.join(process.cwd(), "output")

// GET /api/videos/[projectId]/[filename] — serve a rendered video file
export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filePath = path.join(OUTPUT_DIR, ...params.path)

  // Security: ensure we're not serving files outside output dir
  if (!filePath.startsWith(OUTPUT_DIR)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 403 })
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  const stat = fs.statSync(filePath)
  const stream = fs.readFileSync(filePath)

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": stat.size.toString(),
      "Content-Disposition": `inline; filename="${path.basename(filePath)}"`,
    },
  })
}
