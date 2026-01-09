import type { GameSearchResultItem } from '../types/api'

interface GameCardProps {
  game: GameSearchResultItem
  onClick?: (id: string) => void
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  console.log(game)
  return (
    <button onClick={() => onClick && onClick(game.id)}>
      {game.title}
      <img src={game.assets.boxart} alt={'No image'} />
    </button>
  )
}

export default GameCard
