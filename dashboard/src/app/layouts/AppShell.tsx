import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import { PreviewNotice } from '@/features/auth/PreviewNotice'
import { MobileNav } from './MobileNav'
import { NavContent } from './Navigation'

/**
 * The frame around every signed-in page: a persistent sidebar on large
 * screens, a top bar with a drawer on smaller ones.
 */
export function AppShell() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const isFirstRender = useRef(true)

  // After navigating, move focus to the page so keyboard and screen reader
  // users start at the top of the new content, not on the link they clicked.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    mainRef.current?.focus()
  }, [pathname])

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-dvh overflow-y-auto border-r border-line bg-panel lg:block">
        <NavContent />
      </aside>

      <div className="min-w-0">
        <MobileNav />
        <main id="main" ref={mainRef} tabIndex={-1} className="max-w-3xl px-4 py-6 outline-none sm:px-8 sm:py-10">
          <PreviewNotice />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
