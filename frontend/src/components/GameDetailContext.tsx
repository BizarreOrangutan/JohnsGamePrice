import { createContext, useContext } from 'react'
import type { GamePricesList, GameHistoryList } from '../types/api'

interface GameDetailContextType {
  pricesList: GamePricesList | null
  historyList: GameHistoryList | null
  region: string
  currency: string | null
}

export const GameDetailContext = createContext<
  GameDetailContextType | undefined
>(undefined)

export function useGameDetailContext() {
  const ctx = useContext(GameDetailContext)
  if (!ctx)
    throw new Error(
      'useGameDetailContext must be used within GameDetailContext.Provider'
    )
  return ctx
}
