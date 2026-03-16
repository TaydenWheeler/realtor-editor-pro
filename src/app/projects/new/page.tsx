"use client"

import Link from "next/link"
import { useState } from "react"

export default function NewProjectPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [formData, setFormData] = useState({
    price: "",
    beds: "",
    baths: "",
    sqft: "",
    location: "",
    state: "",
    agentName: "",
    ctaScript: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) setFiles(Array.from(e.dataTransfer.files))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 2000))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  const downPayment = formData.price
    ? (Number(formData.price.replace(/,/g, "")) * 0.03).toLocaleString(undefined, { maximumFractionDigits: 0 })
    : null

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Nav />
        <div className="mx-auto max-w-lg px-6 py-32 text-center animate-fade-in">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-fun flex items-center justify-center mb-8 shadow-lg shadow-purple-500/25">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-3">
            You&apos;re all set!
          </h1>
          <p className="text-[17px] text-[#6e6e73] leading-relaxed mb-2">
            {files.length} clips uploaded and being analyzed right now.
          </p>
          <p className="text-[15px] text-[#86868b] mb-10">
            We&apos;ll have your 3 videos ready in about 15 minutes. Go grab that coffee.
          </p>
          <Link
            href="/dashboard"
            className="rounded-full bg-[#1d1d1f] px-8 py-3.5 text-[15px] font-semibold text-white hover:bg-[#333] transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Nav />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-[13px] text-brand-500 hover:text-brand-600 transition-colors mb-8">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Dashboard
        </Link>

        <div className="mb-10">
          <h1 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight">New project</h1>
          <p className="text-[15px] text-[#6e6e73] mt-2">
            Drop in the details, upload the footage, and let the robots do the boring stuff.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Home Details */}
          <div className="bg-white rounded-3xl shadow-apple p-7">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
              <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Home details</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Price" placeholder="604,990" prefix="$" value={formData.price} onChange={(v) => setFormData({ ...formData, price: v })} required />
              <Input label="Square footage" placeholder="3,434" value={formData.sqft} onChange={(v) => setFormData({ ...formData, sqft: v })} required />
              <Input label="Bedrooms" placeholder="3" value={formData.beds} onChange={(v) => setFormData({ ...formData, beds: v })} required />
              <Input label="Bathrooms" placeholder="2.5" value={formData.baths} onChange={(v) => setFormData({ ...formData, baths: v })} required />
              <Input label="City" placeholder="Saratoga Springs" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} required />
              <Input label="State" placeholder="Utah" value={formData.state} onChange={(v) => setFormData({ ...formData, state: v })} required />
            </div>
          </div>

          {/* Agent Info */}
          <div className="bg-white rounded-3xl shadow-apple p-7">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h2 className="text-[17px] font-semibold text-[#1d1d1f]">About you</h2>
            </div>
            <div className="space-y-4">
              <Input label="Your name" placeholder="Kell Wheeler" value={formData.agentName} onChange={(v) => setFormData({ ...formData, agentName: v })} required fullWidth />
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                  CTA script <span className="text-[#86868b] font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="e.g. Comment the word 'ready' and let's make it happen!"
                  rows={2}
                  value={formData.ctaScript}
                  onChange={(e) => setFormData({ ...formData, ctaScript: e.target.value })}
                  className="w-full rounded-xl border border-[#d2d2d7] bg-[#fafafa] px-4 py-3 text-[15px] text-[#1d1d1f] placeholder:text-[#c7c7cc] focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none resize-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Upload */}
          <div className="bg-white rounded-3xl shadow-apple p-7">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Footage</h2>
            </div>
            <p className="text-[13px] text-[#86868b] mb-5 ml-10">
              All clips from this shoot — exterior, hook, kitchen, living space, bedrooms, bathrooms, walkthrough, the works.
            </p>

            <label
              className="block cursor-pointer"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 ${
                isDragging
                  ? "border-brand-400 bg-brand-50/50 scale-[1.01]"
                  : "border-[#d2d2d7] hover:border-brand-300 hover:bg-[#fafafa]"
              }`}>
                <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-fun flex items-center justify-center mb-4 shadow-lg shadow-purple-500/15">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-[15px] font-medium text-[#1d1d1f]">
                  Drop your clips here
                </p>
                <p className="text-[13px] text-[#86868b] mt-1">
                  or click to browse &middot; MP4, MOV, MKV
                </p>
              </div>
              <input type="file" multiple accept="video/*" onChange={handleFileChange} className="hidden" />
            </label>

            {files.length > 0 && (
              <div className="mt-4 rounded-2xl bg-[#f5f5f7] p-4">
                <p className="text-[13px] font-medium text-[#1d1d1f] mb-3">
                  {files.length} clip{files.length !== 1 ? "s" : ""} ready to go
                </p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 shadow-sm">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-7 w-7 rounded-lg bg-gradient-fun/10 flex items-center justify-center flex-shrink-0">
                          <svg className="h-3.5 w-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        </div>
                        <span className="text-[13px] text-[#1d1d1f] truncate">{file.name}</span>
                      </div>
                      <span className="text-[12px] text-[#86868b] flex-shrink-0 ml-2">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hook Preview */}
          {downPayment && formData.state && (
            <div className="rounded-3xl bg-gradient-fun p-[1px]">
              <div className="rounded-3xl bg-white p-6">
                <p className="text-[12px] font-semibold text-brand-500 uppercase tracking-wider mb-2">Auto-generated hook</p>
                <p className="text-[19px] font-medium text-[#1d1d1f]">
                  &ldquo;This is what ${downPayment} down can get you in {formData.state}&rdquo;
                </p>
                <p className="text-[13px] text-[#86868b] mt-3">
                  Text overlay for Video 1. Film yourself saying this for Video 2.
                </p>
              </div>
            </div>
          )}

          {/* Text Overlay Preview */}
          {formData.price && formData.beds && formData.baths && formData.sqft && formData.location && formData.state && (
            <div className="rounded-3xl bg-[#1d1d1f] p-8 text-center shadow-apple-lg">
              <p className="text-[11px] font-medium text-white/30 uppercase tracking-widest mb-5">Video 1 — Text Overlay Preview</p>
              <p className="text-[36px] font-bold text-white tracking-tight">${formData.price}</p>
              <p className="text-[17px] text-white/70 mt-1">
                {formData.beds} bed &nbsp;&middot;&nbsp; {formData.baths} bath &nbsp;&middot;&nbsp; {formData.sqft} sqft
              </p>
              <p className="text-[17px] text-white/50 mt-0.5">
                {formData.location} &middot; {formData.state}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || files.length === 0}
            className="w-full rounded-2xl bg-gradient-fun px-6 py-4 text-[17px] font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 hover:scale-[1.01] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Uploading & analyzing...
              </span>
            ) : files.length > 0 ? (
              `Let's go — ${files.length} clip${files.length !== 1 ? "s" : ""} ready`
            ) : (
              "Add some clips first"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

function Input({
  label,
  placeholder,
  prefix,
  value,
  onChange,
  required,
  fullWidth,
}: {
  label: string
  placeholder: string
  prefix?: string
  value: string
  onChange: (val: string) => void
  required?: boolean
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#86868b]">{prefix}</span>
        )}
        <input
          type="text"
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border border-[#d2d2d7] bg-[#fafafa] ${prefix ? "pl-8" : "pl-4"} pr-4 py-3 text-[15px] text-[#1d1d1f] placeholder:text-[#c7c7cc] focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:bg-white outline-none transition-all`}
        />
      </div>
    </div>
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
