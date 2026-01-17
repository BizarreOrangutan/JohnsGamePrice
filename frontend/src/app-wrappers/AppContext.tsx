import { useState, createContext, useEffect } from 'react'
import type {
  GameHistoryList,
  GameSearchResult,
  GamePricesList,
} from '../types/api'

enum State {
  SEARCH,
  SELECTION,
  DETAILS,
}

interface AppContextType {
  region: string
  setRegion: (region: string) => void
  appState: State
  setAppState: (state: State) => void
  query: string
  setQuery: (query: string) => void
  gamesList: GameSearchResult | null
  setGamesList: (gamesList: GameSearchResult | null) => void
  gameId: string | null
  setGameId: (id: string | null) => void
  historyList: GameHistoryList | null
  setHistoryList: (historyList: GameHistoryList | null) => void
  pricesList: GamePricesList | null
  setPricesList: (pricesList: GamePricesList | null) => void
}

const AppContext = createContext<AppContextType>({
  region: '',
  setRegion: () => {},
  appState: State.SEARCH,
  setAppState: () => {},
  query: '',
  setQuery: () => {},
  gamesList: null,
  setGamesList: () => {},
  gameId: null,
  setGameId: () => {},
  historyList: null,
  setHistoryList: () => {},
  pricesList: null,
  setPricesList: () => {},
})

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appState, setAppState] = useState<State>(State.SEARCH)
  const [query, setQuery] = useState<string>('')
  const [gamesList, setGamesList] = useState<GameSearchResult | null>(null)
  const [gameId, setGameId] = useState<string | null>(null)
  const [historyList, setHistoryList] = useState<GameHistoryList | null>(null)
  const [pricesList, setPricesList] = useState<GamePricesList | null>(null)
  const [region, setRegion] = useState<string>('GB')

  useEffect(() => {
    console.log('App state changed to:', State[appState])
  }, [appState])

  useEffect(() => {
    console.log('Query updated to:', query)
  }, [query])

  useEffect(() => {
    console.log('resul updated to:', query)
  }, [query])

  return (
    <AppContext.Provider
      value={{
        appState,
        setAppState,
        query,
        setQuery,
        gamesList,
        setGamesList,
        gameId,
        setGameId,
        historyList,
        setHistoryList,
        pricesList,
        setPricesList,
        region,
        setRegion,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppContext, AppContextProvider, State }
