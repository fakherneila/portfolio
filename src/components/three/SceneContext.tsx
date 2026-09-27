import { createContext, useState, type ReactNode } from 'react'

type SceneContextValue = {
  heroVisible: boolean
  setHeroVisible: (visible: boolean) => void
}

export const SceneContext = createContext<SceneContextValue>({
  heroVisible: false,
  setHeroVisible: () => {},
})

export function SceneProvider({ children }: { children: ReactNode }) {
  const [heroVisible, setHeroVisible] = useState(false)

  return (
    <SceneContext.Provider value={{ heroVisible, setHeroVisible }}>
      {children}
    </SceneContext.Provider>
  )
}
