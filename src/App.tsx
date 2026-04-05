import { useState, useCallback, useRef } from 'react'
import { generateSkeleton, generateCss } from './lib/skeletonGenerator'
import type { SkeletonOptions } from './lib/skeletonGenerator'
import { PRESETS } from './lib/presets'

const DEFAULT_HTML = PRESETS[0].html

type AnimationType = 'shimmer' | 'pulse' | 'wave'
type OutputTab = 'preview' | 'css' | 'html'

export default function App() {
  const [inputHtml, setInputHtml] = useState(DEFAULT_HTML)
  const [animation, setAnimation] = useState<AnimationType>('shimmer')
  const [baseColor, setBaseColor] = useState('#2d3748')
  const [highlightColor, setHighlightColor] = useState('#4a5568')
  const [borderRadius, setBorderRadius] = useState(4)
  const [outputTab, setOutputTab] = useState<OutputTab>('preview')
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const options: SkeletonOptions = { baseColor, highlightColor, borderRadius, animation }
  const { skeletonHtml, css } = generateSkeleton(inputHtml, options)

  const previewDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
body { margin: 0; padding: 16px; background: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
${generateCss(options)}
</style>
</head>
<body>
${skeletonHtml}
</body>
</html>`

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [])

  const copyTarget = outputTab === 'css' ? css : skeletonHtml

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] text-slate-200">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-3 border-b border-slate-700/60 shrink-0">
        <span className="text-2xl">🦴</span>
        <h1 className="text-lg font-bold text-white">Boneyard</h1>
        <span className="text-slate-400 text-sm">Skeleton Loading Playground</span>
        <a
          href="https://github.com/0xGF/boneyard"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          inspired by 0xGF/boneyard ↗
        </a>
      </header>

      {/* Controls */}
      <div className="flex items-center gap-4 px-5 py-2.5 border-b border-slate-700/40 bg-slate-900/40 shrink-0 flex-wrap">
        {/* Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Preset</span>
          <div className="flex gap-1">
            {PRESETS.map(p => (
              <button
                key={p.name}
                onClick={() => setInputHtml(p.html)}
                className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-5 bg-slate-700" />

        {/* Animation */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Animation</span>
          <div className="flex gap-1">
            {(['shimmer', 'pulse', 'wave'] as AnimationType[]).map(a => (
              <button
                key={a}
                onClick={() => setAnimation(a)}
                className={`px-2.5 py-1 text-xs rounded transition-colors capitalize ${
                  animation === a
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-5 bg-slate-700" />

        {/* Colors */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Base</span>
          <input
            type="color"
            value={baseColor}
            onChange={e => setBaseColor(e.target.value)}
            className="w-7 h-7 rounded cursor-pointer bg-transparent border border-slate-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Highlight</span>
          <input
            type="color"
            value={highlightColor}
            onChange={e => setHighlightColor(e.target.value)}
            className="w-7 h-7 rounded cursor-pointer bg-transparent border border-slate-600"
          />
        </div>

        <div className="w-px h-5 bg-slate-700" />

        {/* Border radius */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Radius</span>
          <input
            type="range"
            min={0}
            max={20}
            value={borderRadius}
            onChange={e => setBorderRadius(Number(e.target.value))}
            className="w-20 accent-indigo-500"
          />
          <span className="text-xs text-slate-400 w-6">{borderRadius}px</span>
        </div>
      </div>

      {/* Main split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Input */}
        <div className="flex flex-col w-1/2 border-r border-slate-700/60">
          <div className="px-4 py-2 text-xs text-slate-500 uppercase tracking-wide border-b border-slate-700/40 bg-slate-900/30 shrink-0">
            HTML / JSX Input
          </div>
          <textarea
            value={inputHtml}
            onChange={e => setInputHtml(e.target.value)}
            spellCheck={false}
            className="flex-1 p-4 bg-[#0d1117] text-slate-300 text-sm font-mono resize-none focus:outline-none leading-relaxed"
            placeholder="Paste your HTML or JSX here..."
          />
        </div>

        {/* Right: Output */}
        <div className="flex flex-col w-1/2">
          {/* Output tabs */}
          <div className="flex items-center border-b border-slate-700/40 bg-slate-900/30 shrink-0">
            {(['preview', 'css', 'html'] as OutputTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setOutputTab(tab)}
                className={`px-4 py-2 text-xs uppercase tracking-wide transition-colors capitalize ${
                  outputTab === tab
                    ? 'text-white border-b-2 border-indigo-500'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
            {outputTab !== 'preview' && (
              <button
                onClick={() => handleCopy(copyTarget)}
                className="ml-auto mr-3 px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-300 hover:text-white transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            )}
          </div>

          {/* Output content */}
          <div className="flex-1 overflow-hidden">
            {outputTab === 'preview' && (
              <iframe
                ref={iframeRef}
                srcDoc={previewDoc}
                sandbox="allow-scripts"
                className="w-full h-full border-0 bg-white"
                title="Skeleton preview"
              />
            )}
            {outputTab === 'css' && (
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-auto h-full bg-[#0d1117] whitespace-pre-wrap">
                {css}
              </pre>
            )}
            {outputTab === 'html' && (
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-auto h-full bg-[#0d1117] whitespace-pre-wrap">
                {skeletonHtml}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
