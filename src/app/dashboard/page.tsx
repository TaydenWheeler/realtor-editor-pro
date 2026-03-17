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

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  uploading: { label: "Uploading", color: "bg-[#f5f5f7] text-[#86868b]", dot: "bg-gray-400" },
  analyzing: { label: "Analyzing", color: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
  processing: { label: "Rendering", color: "bg-blue-50 text-blue-700", dot: "bg-blue-400 animate-pulse" },
  complete: { label: "Ready", color: "bg-green-50 text-green-700", dot: "bg-green-400" },
  failed: { label: "Failed", color: "bg-red-50 text-red-700", dot: "bg-red-400" },
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const totalProjects = projects.length
  const videosCreated = projects.reduce((sum, p) => sum + Object.keys(p.videos || {}).length, 0)
  const inProgress = projects.filter((p) => ["uploading", "analyzing", "processing"].includes(p.status)).length
  const thisMonth = projects.filter((p) => {
    const d = new Date(p.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const sorted = [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <nav className="glass border-b border-black/5 sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-fun flex items-center justify-center">
                <span className="text-white font-bold text-[11px]">RE</span>
              </div>
              <span className="text-[15px] font-semibold text-[#1d1d1f]">Realtor Editor Pro</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-gradient-fun flex items-center justify-center">
                  <span className="text-[12px] font-semibold text-white">KW</span>
                </div>
                <span className="text-[13px] text-[#6e6e73] hidden sm:block">Kell Wheeler</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[13px] text-[#86868b] mb-1">Good afternoon, Kell</p>
            <h1 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight">Your projects</h1>
          </div>
          <Link
            href="/projects/new"
            className="group rounded-full bg-gradient-fun px-6 py-2.5 text-[14px] font-medium text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Project
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total projects" value={String(totalProjects)} icon="house" />
          <StatCard label="Videos created" value={String(videosCreated)} icon="video" />
          <StatCard label="In progress" value={String(inProgress)} icon="clock" />
          <StatCard label="This month" value={String(thisMonth)} icon="calendar" />
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl shadow-apple p-10 text-center">
            <svg className="animate-spin h-8 w-8 text-brand-500 mx-auto" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : sorted.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-apple overflow-hidden">
            <div className="px-6 py-5 border-b border-black/5">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[#1d1d1f]">Recent</h2>
                <span className="text-[13px] text-[#86868b]">{sorted.length} home{sorted.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
            <div className="divide-y divide-black/5">
              {sorted.map((project) => {
                const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.uploading
                const videoCount = Object.keys(project.videos || {}).length
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between px-6 py-5 hover:bg-[#fafafa] transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-card border border-black/5 flex items-center justify-center flex-shrink-0">
                        <svg className="h-5 w-5 text-[#86868b]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-medium text-[#1d1d1f] truncate">{project.title}</p>
                        <p className="text-[13px] text-[#86868b] mt-0.5 truncate">
                          ${Number(project.price).toLocaleString()} &middot; {project.beds}/{project.baths} bd/ba &middot; {Number(project.sqft).toLocaleString()} sqft &middot; {project.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                      {videoCount > 0 && (
                        <span className="text-[13px] text-[#86868b]">{videoCount} video{videoCount !== 1 ? "s" : ""}</span>
                      )}
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${status.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`}></span>
                        {status.label}
                      </span>
                      <svg className="h-4 w-4 text-[#c7c7cc] group-hover:text-[#86868b] transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-apple p-16 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-[#f5f5f7] flex items-center justify-center mb-4">
              <svg className="h-7 w-7 text-[#c7c7cc]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <p className="text-[17px] font-medium text-[#1d1d1f] mb-2">No projects yet</p>
            <p className="text-[14px] text-[#86868b] mb-6">Film a home, upload the footage, let the magic happen.</p>
            <Link
              href="/projects/new"
              className="rounded-full bg-gradient-fun px-6 py-2.5 text-[14px] font-medium text-white hover:opacity-90 transition-opacity"
            >
              Create your first project
            </Link>
          </div>
        )}

        {sorted.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-[13px] text-[#c7c7cc]">
              Film a home, upload the footage, let the magic happen.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    house: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    video: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    clock: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    calendar: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  }

  return (
    <div className="rounded-2xl bg-white shadow-apple p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#86868b]">{icons[icon]}</span>
        <p className="text-[13px] text-[#86868b]">{label}</p>
      </div>
      <p className="text-[28px] font-bold text-[#1d1d1f] tracking-tight">{value}</p>
    </div>
  )
}
