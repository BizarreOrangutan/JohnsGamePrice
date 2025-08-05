import { Box, Typography, Avatar } from '@mui/material';
import type { GameSearchResult } from '../utils/gameSearchService';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

interface GameSearchOptionProps {
  game: GameSearchResult;
  isHighlighted?: boolean;
}

const GameSearchOption = ({ game, isHighlighted }: GameSearchOptionProps) => {
  const gameImage = game.assets?.boxart || game.assets?.banner || game.assets?.logo;
  const gameName = game.title || game.plain;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1,
        backgroundColor: isHighlighted ? 'action.hover' : 'transparent',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <Avatar
        src={gameImage}
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {!gameImage && <VideogameAssetIcon />}
      </Avatar>
      
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: isHighlighted ? 'bold' : 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {gameName}
        </Typography>
        
        {game.type && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              textTransform: 'capitalize',
            }}
          >
            {game.type}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default GameSearchOption;