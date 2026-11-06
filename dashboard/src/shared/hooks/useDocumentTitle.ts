import { useEffect } from 'react'

const SUFFIX = 'Neptune'

/** Sets the browser tab title, which is also what screen readers announce on navigation. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} – ${SUFFIX}`
  }, [title])
}
