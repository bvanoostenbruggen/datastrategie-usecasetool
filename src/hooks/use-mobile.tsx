
import * as React from "react"

// Breakpoints
const MOBILE_BREAKPOINT = 768 // md breakpoint
const TABLET_BREAKPOINT = 1024 // lg breakpoint
const DESKTOP_BREAKPOINT = 1280 // xl breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Set initial value based on window width
    const checkMobile = () => window.innerWidth < MOBILE_BREAKPOINT
    setIsMobile(checkMobile())
    
    // Create handler for window resize with throttling for performance
    let resizeTimer: number
    const throttledResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        setIsMobile(checkMobile())
      }, 100)
    }
    
    window.addEventListener('resize', throttledResize)
    
    // Clean up
    return () => {
      window.removeEventListener('resize', throttledResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return isMobile
}

// Tablet breakpoint detection
export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth
      return width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT
    }
    
    // Initial check
    setIsTablet(checkTablet())
    
    // Throttled listener
    let resizeTimer: number
    const throttledResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        setIsTablet(checkTablet())
      }, 100)
    }
    
    window.addEventListener('resize', throttledResize)
    
    return () => {
      window.removeEventListener('resize', throttledResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return isTablet
}

// Desktop breakpoint detection
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkDesktop = () => window.innerWidth >= DESKTOP_BREAKPOINT
    
    // Initial check
    setIsDesktop(checkDesktop())
    
    // Throttled listener
    let resizeTimer: number
    const throttledResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        setIsDesktop(checkDesktop())
      }, 100)
    }
    
    window.addEventListener('resize', throttledResize)
    
    return () => {
      window.removeEventListener('resize', throttledResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return isDesktop
}

// Get viewport size category
export function useViewportSize() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()
  
  if (isDesktop) return 'desktop'
  if (isTablet) return 'tablet'
  return 'mobile'
}
