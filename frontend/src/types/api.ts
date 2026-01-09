export interface GameSearchResultItem {
  id: string
  slug: string
  title: string
  type: string
  mature: boolean
  assets: {
    banner145: string
    banner300: string
    banner400: string
    boxart: string
  }
}

export type GameSearchResult = Array<GameSearchResultItem>
