// src/app/App.tsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

import { LeftSidebar } from '../modules/library/LeftSidebar'
import { RightSidebar } from '../modules/actions/RightSidebar'
import Toolbar from '../modules/toolbar/Toolbar'
import CanvasArea from '../canvas/CanvasArea'
import { OverlayTheme } from '../modules/ui/PopUpOverlays'

import InfoDialog from '../modules/ui/InfoDialog'
import HelpDialog from '../modules/ui/HelpDialog'
import ContactDialog from '../modules/ui/ContactDialog'

// Intro
import Intro from '../modules/intro/Intro'

// Theme helpers (Bootstrap ist in main.tsx)
import {
  applyTheme,
  storeTheme,
  isTheme,
  type Theme,
} from '../modules/ui/theme'

// Touch-Gestures
import { useSwipeToClose } from '../hooks/useSwipeToClose'

type ThemeEvtDetail = { theme?: Theme; source?: 'bootstrap' | 'user' | 'system' }

const INTRO_KEY = 'introSeen_session_v1'

export default function App() {
  // Modals
  const [infoOpen, setInfoOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  // Mobile Drawer-State
const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
const [rightDrawerOpen, setRightDrawerOpen] = useState(false)

  // Intro-Flag
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('intro') === '1') return true
      return sessionStorage.getItem(INTRO_KEY) !== '1'
    } catch {
      return true
    }
  })
  const finishIntro = () => {
    try { sessionStorage.setItem(INTRO_KEY, '1') } catch { /* noop */ }
    setShowIntro(false)
  }

  // Mobile Drawer-Funktionen
const toggleLeftDrawer = () => {
  setLeftDrawerOpen((prev) => !prev)
  if (rightDrawerOpen) setRightDrawerOpen(false) // Nur ein Drawer gleichzeitig
}

const toggleRightDrawer = () => {
  setRightDrawerOpen((prev) => !prev)
  if (leftDrawerOpen) setLeftDrawerOpen(false) // Nur ein Drawer gleichzeitig
}

const closeDrawers = () => {
  setLeftDrawerOpen(false)
  setRightDrawerOpen(false)
}

  // Theme-Events
  useEffect(() => {
    const onSet = (e: Event): void => {
      const detail = (e as CustomEvent<ThemeEvtDetail>).detail
      const next = detail?.theme
      if (isTheme(next)) {
        applyTheme(next, 'user')
        storeTheme(next)
      }
    }
    window.addEventListener('app:set-theme', onSet as EventListener)
    return () => window.removeEventListener('app:set-theme', onSet as EventListener)
  }, [])

  // Mobile: Drawers bei Escape schließen
useEffect(() => {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && (leftDrawerOpen || rightDrawerOpen)) {
      closeDrawers()
    }
  }
  window.addEventListener('keydown', onKeyDown)
  return () => window.removeEventListener('keydown', onKeyDown)
}, [leftDrawerOpen, rightDrawerOpen])

// Mobile: Swipe-to-Close für Drawers
useSwipeToClose({
  onSwipe: closeDrawers,
  direction: 'left',
  threshold: 100,
  enabled: leftDrawerOpen,
})

useSwipeToClose({
  onSwipe: closeDrawers,
  direction: 'right',
  threshold: 100,
  enabled: rightDrawerOpen,
})

// Global-Event-Bridge (Modals + Drawers)
useEffect(() => {
  const onInfo = () => setInfoOpen(true)
  const onHelp = () => setHelpOpen(true)
  const onContact = () => setContactOpen(true)
  const onCloseDrawers = () => closeDrawers()
  
  window.addEventListener('app:open-info', onInfo)
  window.addEventListener('app:open-help', onHelp)
  window.addEventListener('app:open-contact', onContact)
  window.addEventListener('app:close-mobile-drawers', onCloseDrawers)
  
  return () => {
    window.removeEventListener('app:open-info', onInfo)
    window.removeEventListener('app:open-help', onHelp)
    window.removeEventListener('app:open-contact', onContact)
    window.removeEventListener('app:close-mobile-drawers', onCloseDrawers)
  }
}, [])

// Touch-Detection
const isTouchDevice = (): boolean => {
  if ('ontouchstart' in window) return true
  if (navigator.maxTouchPoints > 0) return true
  
  // Legacy IE/Edge Support
  const nav = navigator as Navigator & { msMaxTouchPoints?: number }
  if (nav.msMaxTouchPoints && nav.msMaxTouchPoints > 0) return true
  
  return false
}

  // ===== Stabiler Viewport: --dvh gegen Minimize/Fullscreen-Bugs =====
  useLayoutEffect(() => {
    const setDVH = () => {
      const h = window.innerHeight
      document.documentElement.style.setProperty('--dvh', `${h}px`)
    }
    setDVH()

    // sauber typisierte Event-Listen
    const winEvents: Array<'resize' | 'orientationchange' | 'pageshow'> = [
      'resize',
      'orientationchange',
      'pageshow',
    ]
    const docEvents: Array<'visibilitychange' | 'fullscreenchange'> = [
      'visibilitychange',
      'fullscreenchange',
    ]

    const onWin = () => setDVH()
    const onDoc = () => setDVH()

    winEvents.forEach((ev) => window.addEventListener(ev, onWin))
    docEvents.forEach((ev) => document.addEventListener(ev, onDoc))

    return () => {
      winEvents.forEach((ev) => window.removeEventListener(ev, onWin))
      docEvents.forEach((ev) => document.removeEventListener(ev, onDoc))
    }
  }, [])

  // ===== Toolbar-Position & -Skalierung (rein visuell) =====
  const mainRef = useRef<HTMLElement | null>(null)
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const [toolbarTop, setToolbarTop] = useState<number>(24) // Fallback

  useLayoutEffect(() => {
    const mainEl = mainRef.current
    const barEl = toolbarRef.current
    if (!mainEl || !barEl) return

    let raf = 0
    const compute = () => {
      const canvasContainer =
        (mainEl.querySelector('.canvas-container') as HTMLElement | null) ||
        (mainEl.querySelector('canvas') as HTMLCanvasElement | null)

      const mainRect = mainEl.getBoundingClientRect()
      const gap = 12

      if (canvasContainer) {
        const r = canvasContainer.getBoundingClientRect()
        let nextTop = r.bottom - mainRect.top + gap
        const barH = (barEl.firstElementChild as HTMLElement | null)?.getBoundingClientRect().height ?? 56
        const maxTop = mainEl.clientHeight - barH - 8
        nextTop = Math.min(Math.max(8, nextTop), maxTop)
        setToolbarTop(nextTop)
      } else {
        setToolbarTop(Math.max(8, mainEl.clientHeight - 64))
      }

      const rawWidth = (barEl.firstElementChild as HTMLElement | null)?.scrollWidth ?? barEl.scrollWidth
      const avail = mainEl.clientWidth - 16
      const dyn = Math.min(1, Math.max(0.65, avail / Math.max(1, rawWidth)))
      barEl.style.setProperty('--toolbar-scale-dyn', String(dyn))
      barEl.style.setProperty('--toolbar-scale', String(dyn))
    }

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    })
    ro.observe(mainEl)
    const canvasContainer =
      (mainEl.querySelector('.canvas-container') as HTMLElement | null) ||
      (mainEl.querySelector('canvas') as HTMLCanvasElement | null)
    if (canvasContainer) ro.observe(canvasContainer)

    const onWin = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }

      window.dispatchEvent(new CustomEvent('app:toolbar-moved'));

    window.addEventListener('resize', onWin)
    window.addEventListener('orientationchange', onWin)
    window.addEventListener('pageshow', onWin)
    document.addEventListener('visibilitychange', onWin)
    document.addEventListener('fullscreenchange', onWin)

    raf = requestAnimationFrame(() => {
      compute()
      raf = requestAnimationFrame(compute)
    })

    return () => {
      window.removeEventListener('resize', onWin)
      window.removeEventListener('orientationchange', onWin)
      window.removeEventListener('pageshow', onWin)
      document.removeEventListener('visibilitychange', onWin)
      document.removeEventListener('fullscreenchange', onWin)
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
      <OverlayTheme vars={{ radius: '14px', shadow: '0 12px 28px rgba(0,0,0,.2)' }}>
        <div
          className="w-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors-quick"
          data-app-root
          style={{ height: 'var(--dvh)' }}
        >
          {/* Intro-Overlay */}
          <Intro show={showIntro} onDone={finishIntro} />

<div className="grid h-full w-full overflow-hidden app-grid">
  {/* Mobile Backdrop */}
  <div 
    className="drawer-backdrop"
    data-visible={leftDrawerOpen || rightDrawerOpen}
    onClick={closeDrawers}
    aria-hidden="true"
  />

  {/* Mobile Toggle-Buttons */}
  <button
    className="drawer-toggle drawer-toggle-left"
    onClick={toggleLeftDrawer}
    data-active={leftDrawerOpen}
    aria-label="Elemente-Bibliothek"
    type="button"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  </button>

  <button
    className="drawer-toggle drawer-toggle-right"
    onClick={toggleRightDrawer}
    data-active={rightDrawerOpen}
    aria-label="Ebenen & Aktionen"
    type="button"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3h18v18H3z" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
    </svg>
  </button>

  {/* Linke Sidebar */}
  <aside 
    className="app-sidebar col-start-1 row-start-1 h-full overflow-y-auto overflow-x-hidden bg-[var(--panel)] border-r border-[var(--border)]"
    data-drawer-open={leftDrawerOpen}
  >
    <LeftSidebar />
  </aside>

  {/* Bühne/Mitte */}
  <main
    ref={mainRef}
    className="col-start-2 row-start-1 relative h-full min-w-0 bg-[var(--bg)] stage-vignette"
  >
    <CanvasArea />

    {/* Toolbar: zentriert, unter dem Canvas, skaliert dynamisch */}
    <div
      ref={toolbarRef}
      data-app-toolbar
      className="absolute left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
      style={{ top: toolbarTop }}
    >
      <div className="pointer-events-auto toolbar-scale">
        <div className="toolbar-scroll">
          <Toolbar />
        </div>
      </div>
    </div>
  </main>

  {/* Rechte Sidebar */}
  <aside 
    className="app-sidebar col-start-3 row-start-1 h-full overflow-y-auto overflow-x-hidden bg-[var(--panel)] border-l border-[var(--border)]"
    data-drawer-open={rightDrawerOpen}
  >
    <RightSidebar />
  </aside>
</div>

          {/* Versions-Badge */}
          <div
            className="fixed right-1 bottom-1 z-[80] text-[11px] text-[--text-muted] select-none pointer-events-none rounded-md border border-[--border] bg-[--panel] px-2 py-1 shadow-sm hidden sm:block"
            aria-label="App-Version"
          >
            033-Skizze – Version: 0.8
          </div>
        </div>

        {/* Modals */}
        <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
        <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
        <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
      </OverlayTheme>
    </DndProvider>
  )
}
