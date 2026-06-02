import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { analyticsLogEvent } from '../../lib/firebaseClient'

// Scrolls window to the top on every route (pathname/search) change
const ScrollToTop = () => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    // Use auto to avoid jarring animation when navigating
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    try { void analyticsLogEvent('page_view', { page_location: window.location.href, page_path: pathname }) } catch {}
  }, [pathname, search])

  return null
}

export default ScrollToTop
