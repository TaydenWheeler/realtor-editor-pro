"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

interface Project {
  id: string
  title: string
  price: string
  beds: string
  baths: string
  sqft: string
  location: string
  state: string
  agentName: string
  status: string
  createdAt: string
  files: string[]
  clips: Record<string, string>
  videos: Record<string, string>
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/projects/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Project not found")
        return res.json()
      })
      .then(setProject)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Nav />
        <div className="flex items-center justify-center py-32">
          <Spinner />
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Nav />
        <div className="mx-auto max-w-lg px-6 py-32 text-center">
          <p className="text-[17px] text-red-500 mb-4">{error || "Project not found"}</p>
          <Link href="/dashboard" className="text-[14px] text-brand-500 hover:text-brand-600">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const downPayment = project.price
    ? (Number(project.price.replace(/,/g, "")) * 0.03).toLocaleString(undefined, { maximumFractionDigits: 0 })
    : null

  const videoEntries = Object.entries(project.videos || {})
  const clipEntries = Object.entries(project.clips || {})

  const VIDEO_META: Record<string, { label: string; gradient: string }> = {
    video1: { label: "Text Hook", gradient: "from-purple-500 to-pink-500" },
    video2: { label: "Talking Head", gradient: "from-pink-500 to-orange-400" },
    video3: { label: "Walkthrough", gradient: "from-orange-400 to-yellow-400" },
  }

  const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
    uploading: { label: "Uploading", color: "bg-[#f5f5f7] text-[#86868b]", dot: "bg-gray-400" },
    analyzing: { label: "Analyzing", color: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
    processing: { label: "Rendering", color: "bg-blue-50 text-blue-700", dot: "bg-blue-400 animate-pulse" },
    complete: { label: "Ready", color: "bg-green-50 text-green-700", dot: "bg-green-400" },
    failed: { label: "Failed", color: "bg-red-50 text-red-700", dot: "bg-red-400" },
  }

  const statusInfo = STATUS_CONFIG[project.status] || STATUS_CONFIG.uploading

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Nav />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-[13px] text-brand-500 hover:text-brand-600 transition-colors mb-8">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight">{project.title}</h1>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${statusInfo.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`}></span>
                {statusInfo.label}
              </span>
            </div>
            <p className="text-[15px] text-[#86868b]">
              ${Number(project.price).toLocaleString()} &middot; {project.beds}/{project.baths} bd/ba &middot; {Number(project.sqft).toLocaleString()} sqft &middot; {project.location}, {project.state}
            </p>
            <p className="text-[13px] text-[#c7c7cc] mt-1">
              {project.agentName} &middot; {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Hook */}
        {downPayment && project.state && (
          <div className="rounded-3xl bg-gradient-fun p-[1px] mb-8">
            <div className="rounded-3xl bg-white px-6 py-4">
              <p className="text-[12px] font-semibold text-brand-500 uppercase tracking-wider mb-1">Hook</p>
              <p className="text-[17px] text-[#1d1d1f]">
                &ldquo;This is what ${downPayment} down can get you in {project.state}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Rendered Videos */}
        {videoEntries.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[15px] font-semibold text-[#1d1d1f] mb-4">Your videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoEntries.map(([key, videoPath]) => {
                const meta = VIDEO_META[key] || { label: key, gradient: "from-gray-400 to-gray-500" }
                const filename = (videoPath as string).split("/").pop() || ""
                const videoUrl = `/api/videos/${project.id}/${filename}`

                return (
                  <div key={key} className="rounded-3xl bg-white shadow-apple overflow-hidden">
                    <div className={`bg-gradient-to-br ${meta.gradient} px-5 pt-4 pb-3`}>
                      <span className="text-[13px] font-medium text-white/80">{meta.label}</span>
                    </div>
                    <div className="p-4">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full rounded-xl bg-black mb-3"
                        preload="metadata"
                      />
                      <a
                        href={videoUrl}
                        download={`${project.location}_${meta.label.replace(/\s/g, "_")}.mp4`}
                        className="block w-full rounded-xl bg-[#1d1d1f] px-4 py-2.5 text-[13px] font-medium text-white text-center hover:bg-[#333] transition-colors"
                      >
                        Download {meta.label}
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* No videos yet */}
        {videoEntries.length === 0 && (
          <div className="bg-white rounded-3xl shadow-apple p-10 text-center mb-10">
            {project.status === "processing" ? (
              <>
                <Spinner />
                <p className="text-[15px] text-[#6e6e73] mt-4">Rendering your videos...</p>
              </>
            ) : project.status === "failed" ? (
              <>
                <p className="text-[17px] font-medium text-[#1d1d1f] mb-2">Render failed</p>
                <p className="text-[14px] text-[#86868b]">Check the server logs for details.</p>
              </>
            ) : (
              <>
                <p className="text-[17px] font-medium text-[#1d1d1f] mb-2">No videos yet</p>
                <p className="text-[14px] text-[#86868b]">Videos will appear here once rendering is complete.</p>
              </>
            )}
          </div>
        )}

        {/* Clips used */}
        {clipEntries.length > 0 && (
          <div className="bg-white rounded-3xl shadow-apple p-7">
            <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-1">Clips used</h2>
            <p className="text-[13px] text-[#86868b] mb-5">{clipEntries.length} clips assigned to this project</p>
            <div className="space-y-2">
              {clipEntries.map(([role, filename]) => {
                const ROLE_COLORS: Record<string, string> = {
                  exterior: "bg-blue-50 text-blue-600",
                  hook: "bg-pink-50 text-pink-600",
                  kitchen: "bg-orange-50 text-orange-600",
                  living: "bg-green-50 text-green-600",
                  bedroom: "bg-purple-50 text-purple-600",
                  bathroom: "bg-cyan-50 text-cyan-600",
                  dining: "bg-amber-50 text-amber-600",
                  detail: "bg-gray-50 text-gray-600",
                }
                return (
                  <div key={role} className="flex items-center justify-between rounded-xl bg-[#f5f5f7] px-4 py-3">
                    <span className="text-[14px] text-[#1d1d1f] truncate">{filename as string}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${ROLE_COLORS[role] || "bg-gray-50 text-gray-600"}`}>
                      {role}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-8 w-8 text-brand-500" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}

function Nav() {
  return (
    <nav className="glass border-b border-black/5 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-gradient-fun flex items-center justify-center">
              <span className="text-white font-bold text-[11px]">RE</span>
            </div>
            <span className="text-[15px] font-semibold text-[#1d1d1f]">Realtor Editor Pro</span>
          </Link>
          <Link href="/dashboard" className="text-[13px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  )
}
