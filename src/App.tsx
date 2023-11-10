import { useState, useEffect } from 'react'
import './App.css'

import StationCard from './components/Station'
import stationService from './services/stations'

interface Station {
  id: number
  station_name: string
  station_address: string
  coordinate_x: string
  coordinate_y: string
}

function App() {
  const [stations, setStations] = useState<Station[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await stationService.getAll()
        setStations(response.sort((a: Station, b: Station) => a.station_name.localeCompare(b.station_name)))

      } catch (error) {
        console.error(error)
      }
    }
    void fetchData()
  }, [])

  const StationsList = () => {
    return (
      <div>
        <h2>Citybike stations</h2>
        {stations.length > 0 ? '' : 'Loading '}
        {stations.map(station =>
          <StationCard
            key={station.id}
            station={station}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <div>
        {StationsList()}
      </div>
    </>
  )
}

export default App
