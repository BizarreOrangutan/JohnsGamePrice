import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {
  ResponsiveContainer,
  Line,
  LineChart,
  Tooltip,
  Legend,
  YAxis,
  XAxis,
} from 'recharts'
import { useEffect, useMemo, useRef, useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useGameDetailContext } from './GameDetailContext'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'

const dateOptions = [
  { label: 'All Time', value: 'all' },
  { label: 'Past Year', value: 'year' },
  { label: 'Past 3 Months', value: '3months' },
]

function useDebouncedSet(
  setter: (val: Set<string>) => void,
  delay: number = 100
) {
  const timeout = useRef<number | null>(null)
  const setDebounced = (val: Set<string>) => {
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setter(new Set(val)), delay)
  }
  // Cleanup on unmount
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
    },
    []
  )
  return setDebounced
}

const PriceHistoryChart = () => {
  const { historyList, pricesList, currency } = useGameDetailContext()
  const [filteredStores, setFilteredStores] = useState<Set<string>>(new Set())
  const [dateRange, setDateRange] = useState(dateOptions[0].value)
  const setFilteredStoresDebounced = useDebouncedSet(setFilteredStores, 120)

  // Memoize stores calculation
  const stores = useMemo(() => {
    const possibleStores = new Set<string>()
    if (historyList) {
      historyList.forEach((point) => {
        possibleStores.add(point.shop.name)
      })
    }
    if (pricesList) {
      pricesList.forEach((priceItem) => {
        priceItem.deals.forEach((deal) => {
          possibleStores.add(deal.shop.name)
        })
      })
    }
    return possibleStores
  }, [historyList, pricesList])

  // When stores change, default to first N stores checked
  useEffect(() => {
    if (stores.size > 0) {
      setFilteredStores((prev) => {
        const prevArr = Array.from(prev)
        const storesArr = Array.from(stores)
        // Only update if stores have changed
        if (
          prevArr.length !== storesArr.length ||
          !prevArr.every((s) => stores.has(s))
        ) {
          // Select only the first MAX_VISIBLE_STORES
          return new Set(storesArr.slice(0, MAX_VISIBLE_STORES))
        }
        return prev
      })
    }
  }, [stores])

  // Memoize chart data calculation
  const chartData = useMemo(() => {
    if (!historyList) return []

    try {
      // Group by timestamp
      const grouped: { [date: string]: any } = {}
      historyList.forEach((point) => {
        const date = new Date(point.timestamp).toLocaleDateString()
        if (!grouped[date]) {
          grouped[date] = { date }
        }
        grouped[date][point.shop.name] = point.deal.price.amount
      })

      // Add current prices point if pricesList is available
      if (pricesList) {
        const now = new Date().toLocaleDateString()
        const currentPricesPoint: any = { date: now }
        pricesList.forEach((priceItem) => {
          priceItem.deals.forEach((deal) => {
            currentPricesPoint[deal.shop.name] = deal.price.amount
          })
        })
        grouped[now] = currentPricesPoint
      }

      // Convert grouped object to array sorted by date (ascending)
      let groupedArr = Object.values(grouped).sort((a: any, b: any) => {
        const da = new Date(a.date.split('/').reverse().join('-'))
        const db = new Date(b.date.split('/').reverse().join('-'))
        return da.getTime() - db.getTime()
      })

      // Date filtering
      if (dateRange !== 'all') {
        const now = new Date()
        let cutoff: Date
        if (dateRange === 'year') {
          cutoff = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            now.getDate()
          )
        } else if (dateRange === '3months') {
          cutoff = new Date(
            now.getFullYear(),
            now.getMonth() - 3,
            now.getDate()
          )
        } else {
          cutoff = new Date(0)
        }
        groupedArr = groupedArr.filter((row: any) => {
          const d = new Date(row.date.split('/').reverse().join('-'))
          return d >= cutoff
        })
      }

      // For each store, find first index where it appears
      const allStores = Array.from(stores)
      const storeFirstIndex: Record<string, number> = {}
      allStores.forEach((store) => {
        for (let i = 0; i < groupedArr.length; i++) {
          if (groupedArr[i][store] !== undefined) {
            storeFirstIndex[store] = i
            break
          }
        }
      })

      // Fill nulls only after first appearance
      const storesData = groupedArr.map((row: any, idx) => {
        const filledRow: any = { ...row }
        allStores.forEach((store) => {
          if (
            idx >= (storeFirstIndex[store] ?? Infinity) &&
            filledRow[store] === undefined
          ) {
            filledRow[store] = null
          }
        })
        return filledRow
      })

      return storesData
    } catch (error) {
      console.error('Error parsing history data:', error)
      return []
    }
  }, [historyList, pricesList, dateRange, stores])

  // Limit: max 3 checked stores
  const MAX_VISIBLE_STORES = 3
  const storeNames = useMemo(() => [...stores], [stores])
  const visibleStores = useMemo(
    () => storeNames.filter((store) => filteredStores.has(store)),
    [storeNames, filteredStores]
  )
  const checkedCount = visibleStores.length

  // MUI Select change handler
  const handleStoreSelectChange = (
    event: SelectChangeEvent<typeof storeNames>
  ) => {
    const {
      target: { value },
    } = event
    let selected = typeof value === 'string' ? value.split(',') : value
    // Enforce max selection
    if (selected.length > MAX_VISIBLE_STORES) {
      selected = selected.slice(0, MAX_VISIBLE_STORES)
    }
    setFilteredStoresDebounced(new Set(selected))
  }

  // Color palette for lines
  const COLORS = [
    '#1976d2', // blue
    '#d32f2f', // red
    '#388e3c', // green
    '#fbc02d', // yellow
    '#7b1fa2', // purple
    '#0288d1', // light blue
    '#c2185b', // pink
    '#ffa000', // orange
    '#455a64', // gray
    '#8bc34a', // lime
    '#f57c00', // deep orange
    '#0097a7', // teal
    '#5d4037', // brown
    '#cddc39', // chartreuse
    '#e91e63', // magenta
    '#00bcd4', // cyan
  ]

  // Assign a color to each store (stable order)
  const storeColorMap = useMemo(() => {
    const map: Record<string, string> = {}
    storeNames.forEach((store, idx) => {
      map[store] = COLORS[idx % COLORS.length]
    })
    return map
  }, [storeNames])

  if (historyList == null) {
    console.warn('No history data available for PriceHistoryChart.')
    return (
      <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <CardContent>
          <Box
            sx={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ width: '100%', textAlign: 'center' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '1.2rem',
                  color: '#666',
                }}
              >
                No history data available for this game.
              </span>
            </span>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <CardContent>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              height={400}
              margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
            >
              {visibleStores.map((store) => (
                <Line
                  key={store}
                  type="stepAfter"
                  dataKey={store}
                  stroke={storeColorMap[store]}
                  connectNulls
                />
              ))}
              <XAxis
                dataKey="date"
                label={{
                  value: 'Date',
                  position: 'insideBottomRight',
                  offset: -10,
                }}
              />
              <YAxis
                label={{
                  value: `Price (${currency})`,
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                }}
              />
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center" marginTop={2}>
          {/* Date Range Selectors */}
          <FormControl
            sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
            size="small"
          >
            <InputLabel id="date-range-select-label">Date Range</InputLabel>
            <Select
              labelId="date-range-select-label"
              id="date-range-select"
              value={dateRange}
              label="Date Range"
              onChange={(e) => setDateRange(e.target.value)}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: 'white',
                  },
                },
              }}
            >
              {dateOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Store Multi-Select */}
          <FormControl
            sx={{ width: '100%', backgroundColor: 'white', borderRadius: 1 }}
          >
            <InputLabel id="store-multi-select-label">Stores</InputLabel>
            <Select
              labelId="store-multi-select-label"
              id="store-multi-select"
              multiple
              value={Array.from(filteredStores)}
              onChange={handleStoreSelectChange}
              input={<OutlinedInput label="Stores" />}
              renderValue={(selected) => selected.join(', ')}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    minHeight: 120,
                    width: 500,
                    backgroundColor: 'white',
                  },
                },
              }}
            >
              {storeNames.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  disabled={
                    !filteredStores.has(name) &&
                    checkedCount >= MAX_VISIBLE_STORES
                  }
                >
                  <Checkbox
                    checked={filteredStores.has(name)}
                    size="small"
                    sx={{ color: storeColorMap[name] }}
                  />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Alert severity="info">
            Maximum of {MAX_VISIBLE_STORES} stores can be selected at once.
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default PriceHistoryChart
