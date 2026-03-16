import Link from "next/link"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = {
    id: params.id,
    title: "The Saratoga Springs Beauty",
    price: 604990,
    beds: 4,
    baths: 2.5,
    sqft: 3434,
    location: "Saratoga Springs",
    state: "Utah",
    agentName: "Kell Wheeler",
    hookText: "This is what $18,150 down can get you in Utah",
    createdAt: "March 10, 2024",
    clips: [
      { name: "exterior_01.mp4", roomType: "Exterior", quality: 9.2, selected: true, duration: "8s" },
      { name: "hook_selfie.mp4", roomType: "Hook", quality: 8.5, selected: true, duration: "5s" },
      { name: "kitchen_01.mp4", roomType: "Kitchen", quality: 9.0, selected: true, duration: "6s" },
      { name: "kitchen_02.mp4", roomType: "Kitchen", quality: 7.8, selected: false, duration: "7s" },
      { name: "living_01.mp4", roomType: "Living", quality: 8.7, selected: true, duration: "5s" },
      { name: "living_02.mp4", roomType: "Living", quality: 8.1, selected: false, duration: "6s" },
      { name: "bedroom_01.mp4", roomType: "Bedroom", quality: 8.9, selected: true, duration: "5s" },
      { name: "bathroom_01.mp4", roomType: "Bathroom", quality: 8.6, selected: true, duration: "6s" },
      { name: "bathroom_02.mp4", roomType: "Bathroom", quality: 7.5, selected: false, duration: "5s" },
      { name: "detail_laundry.mp4", roomType: "Detail", quality: 8.3, selected: true, duration: "4s" },
      { name: "walkthrough.mp4", roomType: "Tour", quality: 8.0, selected: true, duration: "3m 12s" },
    ],
    videos: [
      { type: "Text Hook", duration: "24s", icon: "text" },
      { type: "Talking Head", duration: "23s", icon: "person" },
      { type: "Walkthrough", duration: "2m 45s", icon: "walk" },
    ],
  }

  const selectedClips = project.clips.filter((c) => c.selected)
  const skippedClips = project.clips.filter((c) => !c.selected)

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
            <Link href="/dashboard" className="text-[13px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[12px] font-medium text-green-700">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                Ready
              </span>
            </div>
            <p className="text-[15px] text-[#86868b]">
              ${project.price.toLocaleString()} &middot; {project.beds}/{project.baths} bd/ba &middot; {project.sqft.toLocaleString()} sqft &middot; {project.location}, {project.state}
            </p>
            <p className="text-[13px] text-[#c7c7cc] mt-1">
              {project.agentName} &middot; {project.createdAt}
            </p>
          </div>
        </div>

        {/* Hook */}
        <div className="rounded-3xl bg-gradient-fun p-[1px] mb-8">
          <div className="rounded-3xl bg-white px-6 py-4">
            <p className="text-[12px] font-semibold text-brand-500 uppercase tracking-wider mb-1">Hook</p>
            <p className="text-[17px] text-[#1d1d1f]">&ldquo;{project.hookText}&rdquo;</p>
          </div>
        </div>

        {/* Videos */}
        <div className="mb-10">
          <h2 className="text-[15px] font-semibold text-[#1d1d1f] mb-4">Your videos are ready</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.videos.map((video, i) => {
              const gradients = [
                "from-purple-500 to-pink-500",
                "from-pink-500 to-orange-400",
                "from-orange-400 to-yellow-400",
              ]
              return (
                <div key={video.type} className="group rounded-3xl bg-white shadow-apple overflow-hidden hover-lift">
                  <div className={`bg-gradient-to-br ${gradients[i]} p-5 aspect-[9/14] flex flex-col justify-between relative`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-white/60">{video.type}</span>
                      <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] text-white backdrop-blur-sm">{video.duration}</span>
                    </div>
                    <div className="flex justify-center items-center flex-1">
                      <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors cursor-pointer">
                        <svg className="h-6 w-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="p-4">
                    <button className="w-full rounded-xl bg-[#1d1d1f] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#333] transition-colors">
                      Download
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Clip Analysis */}
        <div className="bg-white rounded-3xl shadow-apple p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Clip analysis</h2>
              <p className="text-[13px] text-[#86868b] mt-0.5">
                AI picked {selectedClips.length} of {project.clips.length} clips for your videos
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-fun flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Selected */}
          <div className="mb-6">
            <p className="text-[12px] font-semibold text-green-600 uppercase tracking-wider mb-3">Selected</p>
            <div className="space-y-2">
              {selectedClips.map((clip) => (
                <ClipRow key={clip.name} clip={clip} selected />
              ))}
            </div>
          </div>

          {/* Skipped */}
          {skippedClips.length > 0 && (
            <div>
              <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-3">Not used</p>
              <div className="space-y-2">
                {skippedClips.map((clip) => (
                  <ClipRow key={clip.name} clip={clip} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ClipRow({ clip, selected = false }: { clip: { name: string; roomType: string; quality: number; duration: string }; selected?: boolean }) {
  const typeColors: Record<string, string> = {
    Exterior: "bg-blue-50 text-blue-600",
    Hook: "bg-pink-50 text-pink-600",
    Kitchen: "bg-orange-50 text-orange-600",
    Living: "bg-green-50 text-green-600",
    Bedroom: "bg-purple-50 text-purple-600",
    Bathroom: "bg-cyan-50 text-cyan-600",
    Detail: "bg-amber-50 text-amber-600",
    Tour: "bg-indigo-50 text-indigo-600",
  }

  return (
    <div className={`flex items-center justify-between rounded-2xl px-4 py-3 ${selected ? "bg-green-50/50" : "bg-[#f5f5f7]"}`}>
      <div className="flex items-center gap-3 min-w-0">
        {selected ? (
          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-[#d2d2d7] flex-shrink-0"></div>
        )}
        <span className="text-[14px] text-[#1d1d1f] font-mono truncate">{clip.name}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${typeColors[clip.roomType] || "bg-gray-50 text-gray-600"}`}>
          {clip.roomType}
        </span>
        <div className="flex items-center gap-1.5 w-20">
          <div className="flex-1 h-1 rounded-full bg-[#e8e8ed] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-fun"
              style={{ width: `${clip.quality * 10}%` }}
            />
          </div>
          <span className="text-[11px] text-[#86868b] w-6 text-right">{clip.quality}</span>
        </div>
        <span className="text-[12px] text-[#c7c7cc] w-12 text-right">{clip.duration}</span>
      </div>
    </div>
  )
}
