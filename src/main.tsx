import { StrictMode, type ReactNode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReleaseIndexPage } from './components/ReleaseIndexPage.tsx'
import { ReleasePage } from './components/ReleasePage.tsx'
import { printConsoleSignature } from './lib/consoleSignature.ts'
import { RELEASES_BASE, releaseFromPath } from './lib/releaseUrl.ts'

printConsoleSignature()

/**
 * Which page the prerender put in this HTML. There is no router: every page is
 * its own static document, so the pathname alone decides what to hydrate, and
 * it must resolve to exactly what entry-server.tsx rendered for that path.
 */
function pageFor(pathname: string): ReactNode {
  const release = releaseFromPath(pathname)
  if (release) return <ReleasePage release={release} />

  if (pathname === `${RELEASES_BASE}/` || pathname === RELEASES_BASE) {
    return <ReleaseIndexPage />
  }

  return <App />
}

const container = document.getElementById('root')!
const tree = <StrictMode>{pageFor(window.location.pathname)}</StrictMode>

// Production HTML arrives prerendered (see scripts/prerender.ts), so we hydrate
// the existing markup. The dev server serves an empty shell — mount from scratch.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
