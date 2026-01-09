import { useState, createContext, useEffect } from 'react'
import type { GameSearchResult } from './types/api'

enum State {
  SEARCH,
  SELECTION,
  DETAILS,
}

interface AppContextType {
  appState: State
  setAppState: (state: State) => void
  query: string
  setQuery: (query: string) => void
  gamesList: GameSearchResult | null
  setGamesList: (gamesList: GameSearchResult | null) => void
  gameId: string | null
  setGameId: (id: string | null) => void
  details: any
  setDetails: (details: any) => void
}

const AppContext = createContext<AppContextType>({
  appState: State.SEARCH,
  setAppState: () => {},
  query: '',
  setQuery: () => {},
  gamesList: null,
  setGamesList: () => {},
  gameId: null,
  setGameId: () => {},
  details: null,
  setDetails: () => {},
})

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appState, setAppState] = useState<State>(State.SEARCH)
  const [query, setQuery] = useState<string>('')
  const [gamesList, setGamesList] = useState<GameSearchResult | null>(null)
  const [gameId, setGameId] = useState<string | null>(null)
  const [details, setDetails] = useState<any>(null)

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
        details,
        setDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppContext, AppContextProvider, State }
