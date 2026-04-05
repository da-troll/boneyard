export interface SkeletonOptions {
  baseColor: string
  highlightColor: string
  borderRadius: number
  animation: 'shimmer' | 'pulse' | 'wave'
}

const DEFAULT_OPTIONS: SkeletonOptions = {
  baseColor: '#2d3748',
  highlightColor: '#4a5568',
  borderRadius: 4,
  animation: 'shimmer',
}

function parseHtml(html: string): Document {
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
}

function getTagCategory(tag: string): string {
  const lower = tag.toLowerCase()
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(lower)) return 'heading'
  if (['p', 'span', 'label', 'li', 'td', 'th'].includes(lower)) return 'text'
  if (['img', 'image', 'svg', 'video', 'canvas', 'figure'].includes(lower)) return 'media'
  if (['button', 'a'].includes(lower)) return 'button'
  if (['input', 'textarea', 'select'].includes(lower)) return 'input'
  if (['ul', 'ol'].includes(lower)) return 'list'
  return 'block'
}

function skeletonForElement(el: Element, opts: SkeletonOptions): string {
  const tag = el.tagName?.toLowerCase() || 'div'
  const category = getTagCategory(tag)
  const r = opts.borderRadius
  const animClass = `skel-${opts.animation}`

  // Skip script/style/meta elements
  if (['script', 'style', 'meta', 'link', 'head'].includes(tag)) return ''

  switch (category) {
    case 'heading': {
      const widths = { h1: '70%', h2: '60%', h3: '55%', h4: '50%', h5: '45%', h6: '40%' }
      const heights = { h1: '32px', h2: '28px', h3: '24px', h4: '20px', h5: '18px', h6: '16px' }
      const w = widths[tag as keyof typeof widths] || '60%'
      const h = heights[tag as keyof typeof heights] || '20px'
      return `<div class="skel-block ${animClass}" style="width:${w};height:${h};border-radius:${r}px;margin-bottom:8px;"></div>`
    }

    case 'text': {
      // Multi-line for <p>, single for others
      if (tag === 'p') {
        return `
<div style="margin-bottom:12px;">
  <div class="skel-block ${animClass}" style="width:100%;height:14px;border-radius:${r}px;margin-bottom:6px;"></div>
  <div class="skel-block ${animClass}" style="width:97%;height:14px;border-radius:${r}px;margin-bottom:6px;"></div>
  <div class="skel-block ${animClass}" style="width:65%;height:14px;border-radius:${r}px;"></div>
</div>`
      }
      return `<div class="skel-block ${animClass}" style="width:80%;height:14px;border-radius:${r}px;display:inline-block;"></div>`
    }

    case 'media': {
      return `<div class="skel-block ${animClass}" style="width:100%;padding-top:56.25%;border-radius:${r}px;position:relative;"></div>`
    }

    case 'button': {
      return `<div class="skel-block ${animClass}" style="width:100px;height:36px;border-radius:${r}px;display:inline-block;"></div>`
    }

    case 'input': {
      return `<div class="skel-block ${animClass}" style="width:100%;height:40px;border-radius:${r}px;"></div>`
    }

    case 'list': {
      const items = el.querySelectorAll('li')
      const count = Math.min(Math.max(items.length, 3), 6)
      let html = `<div style="display:flex;flex-direction:column;gap:8px;">`
      for (let i = 0; i < count; i++) {
        const w = i === count - 1 ? '70%' : '100%'
        html += `<div class="skel-block ${animClass}" style="width:${w};height:16px;border-radius:${r}px;"></div>`
      }
      html += `</div>`
      return html
    }

    default: {
      // For block elements, recurse into children
      const children = Array.from(el.children)
      if (children.length === 0) {
        // Leaf block — render a placeholder
        const computedTag = el.tagName?.toLowerCase()
        if (!computedTag || computedTag === 'html' || computedTag === 'body') return ''
        return `<div class="skel-block ${animClass}" style="width:100%;height:20px;border-radius:${r}px;"></div>`
      }
      const childHtml = children.map(child => skeletonForElement(child, opts)).filter(Boolean).join('\n')
      if (!childHtml) return ''

      // Detect flex/grid from class names (rough heuristic)
      const cls = el.getAttribute('class') || ''
      let display = 'block'
      let gap = '8px'
      if (cls.includes('flex') || cls.includes('row')) {
        display = 'flex'
        gap = '12px'
      } else if (cls.includes('grid')) {
        display = 'grid'
        gap = '12px'
      }

      return `<div style="display:${display};${display !== 'block' ? `gap:${gap};` : ''}padding:4px 0;">\n${childHtml}\n</div>`
    }
  }
}

export function generateSkeleton(html: string, opts: Partial<SkeletonOptions> = {}): {
  skeletonHtml: string
  css: string
  fullHtml: string
} {
  const options = { ...DEFAULT_OPTIONS, ...opts }
  const doc = parseHtml(html)
  const body = doc.body

  // Get direct children of body, or the whole body if it's simple
  const rootChildren = Array.from(body.children)
  let skeletonBody: string

  if (rootChildren.length === 0) {
    skeletonBody = `<div class="skel-block skel-${options.animation}" style="width:100%;height:100px;border-radius:${options.borderRadius}px;"></div>`
  } else {
    skeletonBody = rootChildren.map(el => skeletonForElement(el, options)).filter(Boolean).join('\n')
  }

  const css = generateCss(options)

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Skeleton Loading</title>
<style>
${css}
</style>
</head>
<body style="margin:0;padding:16px;background:#fff;">
${skeletonBody}
</body>
</html>`

  return { skeletonHtml: skeletonBody, css, fullHtml }
}

export function generateCss(opts: SkeletonOptions): string {
  const { baseColor, highlightColor, borderRadius, animation } = opts

  const base = `
.skel-block {
  background: ${baseColor};
  border-radius: ${borderRadius}px;
  display: block;
}
`

  const shimmer = animation === 'shimmer' ? `
@keyframes skel-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skel-shimmer {
  background: linear-gradient(
    90deg,
    ${baseColor} 25%,
    ${highlightColor} 50%,
    ${baseColor} 75%
  );
  background-size: 200% 100%;
  animation: skel-shimmer 1.5s infinite linear;
}
` : ''

  const pulse = animation === 'pulse' ? `
@keyframes skel-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.skel-pulse {
  background: ${baseColor};
  animation: skel-pulse 1.5s ease-in-out infinite;
}
` : ''

  const wave = animation === 'wave' ? `
@keyframes skel-wave {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.skel-wave {
  background: ${baseColor};
  position: relative;
  overflow: hidden;
}
.skel-wave::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(90deg, transparent, ${highlightColor}, transparent);
  animation: skel-wave 1.5s infinite linear;
}
` : ''

  return [base, shimmer, pulse, wave].filter(Boolean).join('\n')
}
