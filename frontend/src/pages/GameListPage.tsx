import GameCard from '../components/GameCard'
import { useContext } from 'react'
import { AppContext } from '../AppContext'
import { useNavigate } from 'react-router-dom'
import { getGamePrices } from '../services/api'

const GameListPage = () => {
  const navigate = useNavigate()

  const { gamesList } = useContext(AppContext)

  const handleGameClick = (id: string) => {
    console.log('Game clicked:', id)
    const response = getGamePrices(id)
    if (response !== null) {
      navigate('/game/' + id)
    }
    console.warn('Game Details Response:', response)
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
