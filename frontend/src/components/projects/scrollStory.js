import { useEffect, useRef } from 'react'

// Scroll progress shared by the projects page copy (CSS variables) and the WebGL scene.
// --p runs 0 → 1 while a section's sticky stage is pinned; --e runs 0 → 1 as the section scrolls into view.
const sections = new Map()
const listeners = new Map()
let frame = 0
let resizeObserver

const clamp01 = value => (value < 0 ? 0 : value > 1 ? 1 : value)

function measure() {
  frame = 0
  const viewport = window.innerHeight || 1
  sections.forEach((state, id) => {
    const rect = state.el.getBoundingClientRect()
    const p = clamp01(-rect.top / Math.max(1, rect.height - viewport))
    const e = clamp01(1 - rect.top / viewport)
    state.visible = rect.bottom > 0 && rect.top < viewport
    if (p === state.p && e === state.e) return
    if (p !== state.p) state.el.style.setProperty('--p', p.toFixed(4))
    if (e !== state.e) state.el.style.setProperty('--e', e.toFixed(4))
    state.p = p
    state.e = e
    listeners.get(id)?.forEach(listener => listener(state))
  })
}

export function requestMeasure() {
  if (!frame) frame = requestAnimationFrame(measure)
}

function attach() {
  window.addEventListener('scroll', requestMeasure, { passive: true })
  window.addEventListener('resize', requestMeasure)
  resizeObserver = new ResizeObserver(requestMeasure)
  resizeObserver.observe(document.body)
}

function detach() {
  window.removeEventListener('scroll', requestMeasure)
  window.removeEventListener('resize', requestMeasure)
  resizeObserver?.disconnect()
  cancelAnimationFrame(frame)
  frame = 0
}

export function registerSection(id, el) {
  if (!sections.size) attach()
  const state = { el, p: -1, e: -1, visible: false }
  sections.set(id, state)
  requestMeasure()
  return () => {
    if (sections.get(id) === state) sections.delete(id)
    if (!sections.size) detach()
  }
}

export function getSection(id) {
  return sections.get(id)
}

export function subscribe(id, listener) {
  if (!listeners.has(id)) listeners.set(id, new Set())
  listeners.get(id).add(listener)
  const state = sections.get(id)
  if (state && state.p >= 0) listener(state)
  return () => listeners.get(id)?.delete(listener)
}

export function useStorySection(id) {
  const ref = useRef(null)
  useEffect(() => registerSection(id, ref.current), [id])
  return ref
}

export function useSectionProgress(id, listener) {
  const latest = useRef(listener)
  latest.current = listener
  useEffect(() => subscribe(id, state => latest.current(state)), [id])
}
