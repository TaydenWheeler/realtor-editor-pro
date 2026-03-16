import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Nav — Apple-style glass */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-black/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-fun flex items-center justify-center">
                <span className="text-white font-bold text-[11px]">RE</span>
              </div>
              <span className="text-[15px] font-semibold text-[#1d1d1f]">Realtor Editor Pro</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-[13px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">
                Dashboard
              </Link>
              <Link
                href="/projects/new"
                className="rounded-full bg-gradient-fun px-5 py-1.5 text-[13px] font-medium text-white hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-white shadow-apple px-4 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[13px] text-[#6e6e73]">Powered by Agent Obvious</span>
          </div>

          <h1 className="text-[56px] sm:text-[72px] font-bold tracking-tight leading-[1.05] text-[#1d1d1f]">
            Film the home.
            <br />
            <span className="text-gradient">We handle the rest.</span>
          </h1>

          <p className="mt-6 text-[19px] text-[#6e6e73] leading-relaxed max-w-2xl mx-auto">
            Upload your raw footage, enter the home details, and grab a coffee.
            Three scroll-stopping videos — text hook, talking head, and full walkthrough —
            delivered back to you, ready to post.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/projects/new"
              className="group rounded-full bg-gradient-fun px-8 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300"
            >
              Upload Your First Home
              <span className="inline-block ml-1 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-white px-8 py-3.5 text-[15px] font-semibold text-[#1d1d1f] shadow-apple hover:shadow-apple-lg hover:scale-[1.02] transition-all duration-300"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof / Stat Bar */}
      <section className="py-12 border-y border-black/5 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-[32px] font-bold text-gradient">3</p>
              <p className="text-[13px] text-[#6e6e73] mt-1">Videos per home</p>
            </div>
            <div>
              <p className="text-[32px] font-bold text-gradient">~15 min</p>
              <p className="text-[13px] text-[#6e6e73] mt-1">Average turnaround</p>
            </div>
            <div>
              <p className="text-[32px] font-bold text-gradient">0</p>
              <p className="text-[13px] text-[#6e6e73] mt-1">Editing skills needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-[13px] font-semibold text-brand-500 uppercase tracking-wider mb-3">Dead simple</p>
            <h2 className="text-[40px] font-bold text-[#1d1d1f] tracking-tight">
              Three steps. That&apos;s literally it.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard
              step="01"
              title="Film & upload"
              description="Follow the Agent Obvious filming system. Exterior, kitchen, living space, bedrooms, bathrooms — you know the drill. Upload everything."
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              }
            />
            <StepCard
              step="02"
              title="AI does its thing"
              description="Our AI figures out which clip is which room, picks the best angles, scores quality, and assembles everything in the right order."
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              }
            />
            <StepCard
              step="03"
              title="Download & post"
              description="Grab your three finished videos — text hook, talking head hook, and full walkthrough. Drop them on Instagram and TikTok. Done."
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* The 3 Videos */}
      <section className="py-24 px-6 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-[13px] font-semibold text-brand-500 uppercase tracking-wider mb-3">The lineup</p>
            <h2 className="text-[40px] font-bold text-[#1d1d1f] tracking-tight">
              One shoot. Three bangers.
            </h2>
            <p className="text-[17px] text-[#6e6e73] mt-4 max-w-xl mx-auto">
              Every home you film turns into three unique pieces of content.
              Same footage, maximum reach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VideoCard
              number="01"
              title="Text Hook"
              time="20–26s"
              description="Exterior with price overlay, then cinematic push-in shots through the home. Music only, no talking. Clean and dreamy."
              tags={["Price overlay", "B-roll sequence", "Background music"]}
              gradient="from-purple-500 to-pink-500"
            />
            <VideoCard
              number="02"
              title="Talking Head"
              time="20–26s"
              description='You in front of the house: "This is what $18k down gets you in Utah." Then the same fire B-roll. Connection + eye candy.'
              tags={["Your hook", "Same B-roll", "Trust builder"]}
              gradient="from-pink-500 to-orange-400"
              featured
            />
            <VideoCard
              number="03"
              title="Full Walkthrough"
              time="No limit"
              description="POV tour through the whole home. Slow parts sped up, B-roll overlaid, CTA at the end. The long-form money maker."
              tags={["POV tour", "Auto speed-up", "B-roll overlay"]}
              gradient="from-orange-400 to-yellow-400"
            />
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-semibold text-brand-500 uppercase tracking-wider mb-3">The math</p>
          <h2 className="text-[40px] font-bold text-[#1d1d1f] tracking-tight">
            5 homes = 15 videos = posting every day
          </h2>
          <p className="text-[17px] text-[#6e6e73] mt-6 leading-relaxed max-w-2xl mx-auto">
            Film five homes twice a month. That&apos;s 30 videos. Enough to post daily without
            ever running out of content. And the best part? 90% of the people seeing your
            videos don&apos;t even follow you yet.
          </p>
          <div className="mt-12">
            <Link
              href="/projects/new"
              className="group inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-8 py-3.5 text-[15px] font-semibold text-white hover:bg-[#333] transition-colors"
            >
              Start creating
              <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-md bg-gradient-fun flex items-center justify-center">
                <span className="text-white font-bold text-[9px]">RE</span>
              </div>
              <span className="text-[13px] text-[#6e6e73]">Realtor Editor Pro by Agent Obvious</span>
            </div>
            <p className="text-[13px] text-[#86868b]">
              Built for realtors who actually post.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StepCard({
  step,
  title,
  description,
  icon,
}: {
  step: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="group rounded-3xl bg-white shadow-apple p-8 hover-lift cursor-default">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-2xl bg-gradient-fun flex items-center justify-center text-white">
          {icon}
        </div>
        <span className="text-[13px] font-mono text-[#86868b]">{step}</span>
      </div>
      <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-2">{title}</h3>
      <p className="text-[15px] text-[#6e6e73] leading-relaxed">{description}</p>
    </div>
  )
}

function VideoCard({
  number,
  title,
  time,
  description,
  tags,
  gradient,
  featured = false,
}: {
  number: string
  title: string
  time: string
  description: string
  tags: string[]
  gradient: string
  featured?: boolean
}) {
  return (
    <div className={`group rounded-3xl overflow-hidden hover-lift ${featured ? "shadow-apple-lg" : "shadow-apple"}`}>
      {/* Gradient header simulating a phone screen */}
      <div className={`bg-gradient-to-br ${gradient} p-6 pb-10 relative`}>
        <div className="flex items-center justify-between mb-8">
          <span className="text-white/60 text-[13px] font-mono">{number}</span>
          <span className="rounded-full bg-white/20 px-3 py-0.5 text-[11px] text-white font-medium backdrop-blur-sm">
            {time}
          </span>
        </div>
        {/* Fake phone frame */}
        <div className="mx-auto w-16 h-28 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
          <svg className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6">
        <h3 className="text-[18px] font-semibold text-[#1d1d1f] mb-2">{title}</h3>
        <p className="text-[14px] text-[#6e6e73] leading-relaxed mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#f5f5f7] px-3 py-1 text-[12px] text-[#6e6e73]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
