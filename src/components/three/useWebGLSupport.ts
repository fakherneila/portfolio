import { useEffect, useState } from 'react'

// Runs client-side only. Returns false during SSR/initial render to avoid hydration mismatches.
export function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')
    setSupported(context !== null)
  }, [])

  return supported
}
