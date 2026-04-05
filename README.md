# Boneyard Skeleton Playground

Interactive web playground for generating skeleton loading screens from HTML/JSX. Inspired by [0xGF/boneyard](https://github.com/0xGF/boneyard).

## Live

https://mvp.trollefsen.com/2026-04-05-boneyard/

## What it does

Paste any HTML or JSX into the left panel and instantly see a live skeleton preview on the right. The playground parses your HTML structure and replaces content with animated placeholder elements that match the original layout.

**Features:**
- Live skeleton preview rendered in an iframe
- Paste any HTML/JSX — skeleton generates in real time
- 5 built-in preset examples to get started fast
- 3 animation styles: Shimmer, Pulse, Wave
- Customizable base color, highlight color, and border radius
- Copy generated CSS or skeleton HTML with one click
- Export the full self-contained HTML

## Tech

Vite + React + TypeScript + Tailwind CSS v4

## How the skeleton generator works

The generator parses input HTML via `DOMParser`, then walks the DOM tree replacing:
- Text nodes with inline gray bars sized proportionally to text length
- `img`/`svg`/media with solid gray blocks matching declared dimensions
- `h1`-`h6` with full-width bars at appropriate heading heights
- `p` with multiple lines (last line shorter for natural paragraph feel)
- `button`/`input` with appropriately shaped blocks
- Container elements recursed, preserving layout structure

Animations are pure CSS: shimmer uses a gradient sweep, pulse uses opacity keyframes, wave uses a sliding overlay.

## Build date

2026-04-05
