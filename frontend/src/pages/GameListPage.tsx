import GameCard from '../components/GameCard'
import { useContext } from 'react'
import { AppContext } from '../AppContext'
import { useNavigate } from 'react-router-dom'
import { getGameHistory, getGamePrices } from '../services/api'

const GameListPage = () => {
  const navigate = useNavigate()

  const { gamesList, setPricesList, setHistoryList } = useContext(AppContext)

  const handleGameClick = async (id: string) => {
    console.log('Handling game clicked:', id)
    const priceResponse = await getGamePrices(id)
    setPricesList(priceResponse)
    const historyResponse = await getGameHistory(id)
    setHistoryList(historyResponse)

    if (priceResponse !== null && historyResponse !== null) {
      navigate('/game/' + id)
    }
    console.warn('Game Details Response:', priceResponse)
  }

  return (
    <div>
      {gamesList ? (
        <div className="game-list grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gamesList.map((game) => (
            <GameCard key={game.id} game={game} onClick={handleGameClick} />
          ))}
        </div>
      ) : (
        <p>No games found.</p>
      )}
    </div>
  )
}

export default GameListPage
