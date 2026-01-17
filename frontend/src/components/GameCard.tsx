import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import type { GameSearchResultItem } from '../types/api'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'

interface GameCardProps {
  game: GameSearchResultItem
  onClick?: (id: string) => void
  disabled?: boolean
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  onClick,
  disabled = false,
}) => {
  const hasImage = Boolean(game.assets.boxart)
  return (
    <Card
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardActionArea
        onClick={() => !disabled && onClick && onClick(game.id)}
        sx={{ height: '100%' }}
        disabled={disabled}
      >
        {hasImage ? (
          <CardMedia
            component="img"
            image={game.assets.boxart}
            alt={game.title}
            sx={{ width: '100%', aspectRatio: '2/3' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              aspectRatio: '2/3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f5f5f5',
            }}
          >
            <ImageNotSupportedIcon sx={{ fontSize: 48, color: 'grey.500' }} />
          </div>
        )}
        <CardContent>
          <Typography variant="h6" noWrap>
            {game.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default GameCard
