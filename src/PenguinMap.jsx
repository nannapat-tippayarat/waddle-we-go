
import { useState, useMemo } from 'react'
import {
  MapContainer,
  TileLayer,
  Polyline,
  Tooltip,
  useMap
} from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import penguinData from './data/penguin_data.json'

// Get the actual penguins and months from your friend's data.
const penguins = [
  ...new Set(penguinData.map(point => point.penguin_number))
].sort((a, b) => a - b)

const months = [
  ...new Set(penguinData.map(point => point.month))
]
  .sort()
  .map(value => ({
    value,
    label: new Date(`${value}-01T12:00:00Z`)
      .toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
      })
  }))

const penguinColors = [
  '#e98fa9',
  '#6e9ed6',
  '#9a86cf',
  '#e6a45e',
  '#67b6a4',
  '#d77e82',
  '#8ba85c',
  '#5f8fa4'
]

const seasonalNotes = {
  summer: {
    emoji: '☀️',
    title: 'Antarctic Summer',
    description:
      'Antarctic sea ice generally retreats during summer, reaching its annual minimum around February. This changes the habitats available to marine wildlife.'
  },
  autumn: {
    emoji: '🍂',
    title: 'Antarctic Autumn',
    description:
      'Sea ice begins expanding as Antarctica moves toward winter. Seasonal changes in ice conditions provide important context for understanding penguin journeys.'
  },
  winter: {
    emoji: '❄️',
    title: 'Antarctic Winter',
    description:
      'Antarctic sea ice generally expands through winter, approaching its annual maximum around September. These changes affect the ocean environment penguins travel through.'
  },
  spring: {
    emoji: '🌱',
    title: 'Antarctic Spring',
    description:
      'After the winter maximum, Antarctic sea ice generally begins retreating again, changing the marine environment around the continent.'
  }
}

function getSeason(monthValue) {
  const month = Number(monthValue.split('-')[1])

  if ([12, 1, 2].includes(month)) return 'summer'
  if ([3, 4, 5].includes(month)) return 'autumn'
  if ([6, 7, 8].includes(month)) return 'winter'
  return 'spring'
}

// Recenter the map whenever the displayed routes change.
function FitMapToRoutes({ routes }) {
  const map = useMap()

  useEffect(() => {
    const positions = routes.flatMap(route => route.positions)

    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), {
        padding: [25, 25],
        maxZoom: 6
      })
    }
  }, [map, routes])

  return null
}

function PenguinMap() {
  const [selectedPenguin, setSelectedPenguin] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [journalTab, setJournalTab] = useState('season')

  const hasPenguin = selectedPenguin !== 'all'
  const hasMonth = selectedMonth !== 'all'

  const monthLabel = hasMonth
    ? months.find(month => month.value === selectedMonth)?.label
    : null

  const currentSeason = hasMonth
    ? seasonalNotes[getSeason(selectedMonth)]
    : null

  // Filter the original tracking observations.
  const filteredData = useMemo(() => {
    return penguinData.filter(point => {
      const matchesPenguin =
        selectedPenguin === 'all' ||
        String(point.penguin_number) === selectedPenguin

      const matchesMonth =
        selectedMonth === 'all' ||
        point.month === selectedMonth

      return matchesPenguin && matchesMonth
    })
  }, [selectedPenguin, selectedMonth])

  // Convert observations into map routes.
  const routes = useMemo(() => {
    return penguins
      .map(penguin => {
        const points = filteredData
          .filter(point => point.penguin_number === penguin)
          .sort((a, b) =>
            a.timestamp.localeCompare(b.timestamp)
          )

        return {
          penguin,
          positions: points.map(point => [
            point.lat,
            point.long
          ])
        }
      })
      .filter(route => route.positions.length > 0)
  }, [filteredData])

  function changePenguin(value) {
    setSelectedPenguin(value)
    setJournalTab(value === 'all' ? 'season' : 'penguin')
  }

  function changeMonth(value) {
    setSelectedMonth(value)
    setJournalTab(
      selectedPenguin !== 'all' ? 'penguin' : 'season'
    )
  }

  return (
    <main className="map-page">

      {/* HEADER */}
      <div className="map-header">
        <p className="map-eyebrow">
          ✦ YOUR LITTLE OCEAN ADVENTURE ✦
        </p>

        <h1>where did they waddle? 🐧</h1>

        <p className="map-subtitle">
          8 little explorers, 1 very big ocean.
          Follow their first journeys at sea!
        </p>
      </div>

      {/* STICKERS */}
      <div className="map-stickers">
        <span>🐧 tiny travelers</span>
        <span>🌊 southern ocean</span>
        <span>💌 2019–2020</span>
      </div>

      {/* FILTERS */}
      <div className="map-filters">
        <label className="filter-group">
          <span>🐧 Choose a penguin</span>

          <select
            value={selectedPenguin}
            onChange={e => changePenguin(e.target.value)}
          >
            <option value="all">All explorers</option>

            {penguins.map(penguin => (
              <option
                key={penguin}
                value={String(penguin)}
              >
                Penguin {String(penguin).padStart(2, '0')}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-group">
          <span>📅 Choose a month</span>

          <select
            value={selectedMonth}
            onChange={e => changeMonth(e.target.value)}
          >
            <option value="all">All months</option>

            {months.map(month => (
              <option
                key={month.value}
                value={month.value}
              >
                {month.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* MAP AND SIDEBAR */}
      <div className="map-layout">

        {/* MAP */}
        <div className="map-frame">
          <div className="map-frame-top">
            <span>✧ southern ocean expedition</span>
            <span>♡ 2019–2020</span>
          </div>

          <MapContainer
            center={[-65, -8]}
            zoom={3}
            className="penguin-leaflet-map"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {routes.map(route => (
              <Polyline
                key={route.penguin}
                positions={route.positions}
                pathOptions={{
                  color: penguinColors[
                    (route.penguin - 1) %
                    penguinColors.length
                  ],
                  weight: 3,
                  opacity: 0.8
                }}
              >
                <Tooltip sticky>
                  Penguin {String(route.penguin).padStart(2, '0')}
                </Tooltip>
              </Polyline>
            ))}

            <FitMapToRoutes routes={routes} />
          </MapContainer>

          <p className="map-count">
            🐧 Showing {routes.length} penguin
            {routes.length === 1 ? '' : 's'}
            {' '}·{' '}
            {filteredData.length.toLocaleString()}
            {' '}tracking points
          </p>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="map-sidebar">

          {/* GENERAL NOTES */}
          <aside className="field-notes">
            <p>✦ NOTES FROM THE FIELD ✦</p>

            <h2>Why do penguins travel so far? 🌊</h2>

            <p>
              These eight juvenile emperor penguins
              were tracked during their first journeys
              at sea.
            </p>

            <p>
              Their movements take place in a changing
              Antarctic environment, where sea ice
              shifts with the seasons.
            </p>

            <p>
              Satellite locations show us where the
              penguins traveled, but not whether they
              were swimming or resting on ice.
            </p>

            <a
              href="https://doi.org/10.1098/rsos.211708"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the original research ↗
            </a>
          </aside>

          {/* INTERACTIVE JOURNAL */}
          <section className="season-card">
            <p className="season-eyebrow">
              ✦ ANTARCTIC FIELD JOURNAL ✦
            </p>

            <div className="journal-tabs">
              <button
                type="button"
                className={
                  journalTab === 'season' ? 'selected' : ''
                }
                onClick={() => setJournalTab('season')}
              >
                ❄️ Season
              </button>

              <button
                type="button"
                className={
                  journalTab === 'penguin' ? 'selected' : ''
                }
                onClick={() => setJournalTab('penguin')}
              >
                🐧 Penguin
              </button>
            </div>

            {journalTab === 'season' ? (
              <>
                {!hasMonth ? (
                  <>
                    <h2>❄️ Life in the Southern Ocean</h2>

                    <p>
                      Antarctica changes throughout
                      the year. Sea ice expands during
                      winter and retreats in summer.
                    </p>

                    <p>
                      Choose a month above to discover
                      the seasonal conditions that help
                      provide context for these journeys.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="journal-month">
                      📅 {monthLabel}
                    </p>

                    <h2>
                      {currentSeason.emoji}{' '}
                      {currentSeason.title}
                    </h2>

                    <p>{currentSeason.description}</p>

                    <p className="journal-disclaimer">
                      This is general climate context,
                      not a direct observation of
                      an individual penguin.
                    </p>
                  </>
                )}

                <a
                  href="https://nsidc.org/learn/parts-cryosphere/sea-ice/quick-facts-about-sea-ice"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn about Antarctic sea ice ↗
                </a>
              </>
            ) : (
              <>
                {!hasPenguin ? (
                  <>
                    <h2>🐧 Meet the explorers!</h2>

                    <p>
                      Eight young emperor penguins.
                      Eight unique journeys.
                    </p>

                    <p>
                      Choose an individual penguin
                      above to discover its story.
                    </p>
                  </>
                ) : (
                  <>
                    <h2>
                      🐧 Penguin {selectedPenguin}
                    </h2>

                    {hasMonth ? (
                      <p>
                        Exploring Penguin {selectedPenguin}'s
                        journey during {monthLabel}.
                      </p>
                    ) : (
                      <p>
                        Exploring Penguin {selectedPenguin}'s
                        complete recorded journey.
                      </p>
                    )}

                    {filteredData.length === 0 ? (
                      <p>
                        No tracking observations were
                        recorded for this selection.
                        Try another month!
                      </p>
                    ) : (
                      <p>
                        This selection contains{' '}
                        <strong>
                          {filteredData.length.toLocaleString()}
                        </strong>
                        {' '}recorded locations.
                      </p>
                    )}

                    <p className="journal-disclaimer">
                      These locations show recorded
                      positions, not the penguin's
                      exact path between observations.
                    </p>
                  </>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      <p className="map-footer">
        ✧ real penguins, real journeys,
        very big adventures ✧
      </p>
    </main>
  )
}

export default PenguinMap
