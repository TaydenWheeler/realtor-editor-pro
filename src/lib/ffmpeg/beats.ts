import { execSync } from "child_process"
import path from "path"
import fs from "fs"
import { FFMPEG_PATH, FFPROBE_PATH, DIRS } from "./config"

/**
 * Detect beat timestamps in a music track using FFmpeg's onset detection.
 *
 * Uses a spectral flux onset detector to find transient peaks (beats).
 * Returns an array of timestamps (in seconds) where beats occur.
 */
export function detectBeats(musicPath: string): number[] {
  const tmpDir = path.join(DIRS.temp, "beats")
  fs.mkdirSync(tmpDir, { recursive: true })

  // Step 1: Extract onset strength using FFmpeg's ebur128 and spectral analysis
  // We use a bandpass filter focused on kick/snare range (60-200Hz)
  // then detect amplitude peaks
  const rawPath = path.join(tmpDir, `onset_${Date.now()}.raw`)

  // Extract audio as raw mono PCM at 44100Hz
  const extractCmd = [
    `"${FFMPEG_PATH}"`,
    `-y`,
    `-i "${musicPath}"`,
    `-ac 1`,
    `-ar 44100`,
    `-f f32le`,
    `"${rawPath}"`,
  ].join(" ")

  execSync(extractCmd, { stdio: "pipe" })

  // Read raw PCM data and do energy-based onset detection
  const buffer = fs.readFileSync(rawPath)
  const samples = new Float32Array(buffer.buffer, buffer.byteOffset, buffer.length / 4)

  // Clean up temp file
  fs.unlinkSync(rawPath)

  return findBeatsFromSamples(samples, 44100)
}

/**
 * Energy-based beat detection from raw audio samples.
 *
 * Algorithm:
 * 1. Compute energy in overlapping windows
 * 2. Compute spectral flux (energy difference between consecutive windows)
 * 3. Apply adaptive threshold to find peaks
 * 4. Filter peaks that are too close together (< min beat interval)
 */
function findBeatsFromSamples(samples: Float32Array, sampleRate: number): number[] {
  const windowSize = Math.floor(sampleRate * 0.02) // 20ms windows
  const hopSize = Math.floor(windowSize / 2)        // 50% overlap
  const numWindows = Math.floor((samples.length - windowSize) / hopSize)

  // Step 1: Compute energy per window
  const energies: number[] = []
  for (let i = 0; i < numWindows; i++) {
    const start = i * hopSize
    let energy = 0
    for (let j = 0; j < windowSize; j++) {
      energy += samples[start + j] * samples[start + j]
    }
    energies.push(energy / windowSize)
  }

  // Step 2: Compute spectral flux (positive differences only)
  const flux: number[] = [0]
  for (let i = 1; i < energies.length; i++) {
    const diff = energies[i] - energies[i - 1]
    flux.push(diff > 0 ? diff : 0)
  }

  // Step 3: Adaptive threshold — mean + stddev of local neighborhood
  const neighborhoodSize = 40 // ~0.4 seconds of context
  const beats: number[] = []
  const minBeatInterval = 0.25 // minimum 250ms between beats (240 BPM max)

  for (let i = neighborhoodSize; i < flux.length - neighborhoodSize; i++) {
    // Compute local mean and stddev
    let sum = 0
    let sumSq = 0
    for (let j = i - neighborhoodSize; j <= i + neighborhoodSize; j++) {
      sum += flux[j]
      sumSq += flux[j] * flux[j]
    }
    const n = 2 * neighborhoodSize + 1
    const mean = sum / n
    const variance = sumSq / n - mean * mean
    const stddev = Math.sqrt(Math.max(0, variance))

    // Threshold: mean + 1.5 * stddev
    const threshold = mean + 1.5 * stddev

    // Check if this is a peak above threshold
    if (
      flux[i] > threshold &&
      flux[i] > flux[i - 1] &&
      flux[i] > flux[i + 1]
    ) {
      const timeSeconds = (i * hopSize) / sampleRate
      // Enforce minimum interval
      if (beats.length === 0 || timeSeconds - beats[beats.length - 1] >= minBeatInterval) {
        beats.push(timeSeconds)
      }
    }
  }

  return beats
}

/**
 * Given beat timestamps and a desired number of clips,
 * return beat-aligned durations for each clip.
 *
 * Strategy:
 * - Target clip duration is 2.5-4s (the sweet spot from example videos)
 * - Each clip duration must end exactly on a beat boundary
 * - We pick the number of beats per clip that gets closest to ~3s
 *
 * @param beats Array of beat timestamps in seconds
 * @param numClips How many clips to fit
 * @param startOffset Where in the song to start (seconds, default 0)
 */
export function assignClipsToBeatIntervals(
  beats: number[],
  numClips: number,
  startOffset: number = 0
): { start: number; end: number; duration: number }[] {
  // Filter beats to those after startOffset
  const usableBeats = beats.filter((b) => b >= startOffset)

  if (usableBeats.length < 2) {
    console.warn(`[beats] Not enough beats found. Falling back to even spacing.`)
    return evenlySpacedIntervals(numClips, startOffset)
  }

  // Calculate average beat interval
  const beatIntervals = usableBeats.slice(1).map((b, i) => b - usableBeats[i])
  const avgBeatInterval = beatIntervals.reduce((a, b) => a + b, 0) / beatIntervals.length

  // Target ~3 seconds per clip. Calculate how many beats that is.
  const targetDuration = 3.0 // seconds
  const beatsPerClip = Math.max(1, Math.round(targetDuration / avgBeatInterval))

  const intervals: { start: number; end: number; duration: number }[] = []
  let beatIdx = 0

  for (let i = 0; i < numClips; i++) {
    const nextBeatIdx = beatIdx + beatsPerClip

    if (nextBeatIdx >= usableBeats.length) {
      // Not enough beats left — use whatever remains
      const lastBeat = usableBeats[usableBeats.length - 1]
      const start = usableBeats[beatIdx] || lastBeat
      intervals.push({
        start,
        end: start + targetDuration,
        duration: targetDuration,
      })
    } else {
      const start = usableBeats[beatIdx]
      const end = usableBeats[nextBeatIdx]
      intervals.push({
        start,
        end,
        duration: end - start,
      })
    }

    beatIdx = beatIdx + beatsPerClip
  }

  return intervals
}

/**
 * Fallback: evenly spaced intervals when beat detection doesn't find enough beats
 */
function evenlySpacedIntervals(
  numClips: number,
  startOffset: number,
  clipDuration: number = 3
): { start: number; end: number; duration: number }[] {
  const intervals: { start: number; end: number; duration: number }[] = []
  for (let i = 0; i < numClips; i++) {
    const start = startOffset + i * clipDuration
    intervals.push({
      start,
      end: start + clipDuration,
      duration: clipDuration,
    })
  }
  return intervals
}

/**
 * Get the duration of an audio file in seconds.
 */
export function getAudioDuration(audioPath: string): number {
  const cmd = `"${FFPROBE_PATH}" -v quiet -show_entries format=duration -of csv=p=0 "${audioPath}"`
  return parseFloat(execSync(cmd, { encoding: "utf-8" }).trim())
}
