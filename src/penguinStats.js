
import penguinData from './data/penguin_data.json'

// Great-circle distance between two GPS locations.
function distanceKm(a, b) {
  const radians = degrees => degrees * Math.PI / 180
  const radius = 6371

  const lat1 = radians(a.lat)
  const lat2 = radians(b.lat)

  const deltaLat = lat2 - lat1
  const deltaLon = radians(b.long - a.long)

  const h =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) ** 2

  return 2 * radius *
    Math.asin(Math.min(1, Math.sqrt(h)))
}

export function getPenguinStats(penguinNumber) {
  const points = penguinData
    .filter(
      point => point.penguin_number === Number(penguinNumber)
    )
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  if (points.length === 0) {
    return null
  }

  let trackedDistanceKm = 0

  for (let i = 1; i < points.length; i++) {
    trackedDistanceKm += distanceKm(
      points[i - 1],
      points[i]
    )
  }

  const latitudes = points.map(point => point.lat)

  return {
    trackingPoints: points.length,
    firstSeen: points[0].timestamp.slice(0, 10),
    lastSeen: points[points.length - 1].timestamp.slice(0, 10),
    monthsTracked: new Set(
      points.map(point => point.month)
    ).size,
    trackedDistanceKm: Math.round(trackedDistanceKm),
    northernmostLatitude: Math.max(...latitudes),
    southernmostLatitude: Math.min(...latitudes)
  }
}
