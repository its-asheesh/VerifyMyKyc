import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrolls window to the top on every route (pathname/search) change
const ScrollToTop = () => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    // Use auto to avoid jarring animation when navigating
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}

export default ScrollToTop
