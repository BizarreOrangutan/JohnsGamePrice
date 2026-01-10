export type GameSearchResult = Array<GameSearchResultItem>
export type GameHistoryList = Array<GameHistoryItem>
export type GamePricesList = Array<GamePricesItem>

// https://docs.isthereanydeal.com/#tag/Game/operation/games-search-v1
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

// https://docs.isthereanydeal.com/#tag/History/operation/games-history-v2
export interface GameHistoryItem {
  timestamp: string
  shop: Shop
  deal: HistoryDeal
}

// https://docs.isthereanydeal.com/#tag/Prices/operation/games-prices-v3
export interface GamePricesItem {
  id: string
  historyLow: HistoryLow
  deals: PriceDeals
}

export interface Shop {
  id: number
  name: string
}

export interface Price {
  amount: number
  amountInt: number
  currency: string
}

export interface Platform {
  id: number
  name: string
}

export interface DrmEntry {
  id: number
  name: string
}

export type PriceDeals = Array<PriceDeal>

export interface PriceDeal {
  shop: Shop
  price: Price
  regular: Price
  cut: number
  voucher: null | string
  storeLow: Price
  flag: null | string
  drm: DrmEntry[]
  platforms: Platform[]
  timestamp: string
  expiry: null | string
  url: string
}

export interface HistoryLow {
  all: Price
  y1: Price
  m3: Price
}

export interface HistoryDeal {
  price: Price
  regular: Price
  cut: number
}

export interface BadRequest {
  status: 0
  reason_phrase: 'string'
}
