import { List, ListItem, ListItemButton } from '@mui/material';
import GameSearchOption from './GameSearchOption';
import type { GameSearchResult } from '../utils/gameSearchService';

interface GameSearchListProps {
  games: GameSearchResult[];
  onGameClick: (id: string) => void;
}

const GameSearchList = ({ games, onGameClick }: GameSearchListProps) => (
  <List>
    {games.map(game => (
      <ListItem key={game.id} disablePadding>
        <ListItemButton onClick={() => game.id && onGameClick(game.id)}>
          <GameSearchOption game={game} />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
);

export default GameSearchList;