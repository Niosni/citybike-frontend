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
  const [filterValue, setFilterValue] = useState('')
  const [stationsToShow, setStationsToShow] = useState<Station[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await stationService.getAll()
        const sortedStations = response.sort((a: Station, b: Station) => a.station_name.localeCompare(b.station_name))
        setStations(sortedStations)
        setStationsToShow(sortedStations)
      } catch (error) {
        console.error(error)
      }
    }
    void fetchData()
  }, [])

  const StationsList = () => {
    return (
      <>
        {stationsToShow.length > 0 ? '' : 'None match '}
        {stationsToShow.map(station =>
          <StationCard
            key={station.id}
            station={station}
          />
        )}
      </>
    )
  }
  const handleFiltering = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLButtonElement
    const newFilterValue = String(target.value)
    setFilterValue(newFilterValue)
    const filteredStations = stations.filter(station =>
      station.station_name.toLowerCase().includes(newFilterValue.toLowerCase())
    )
    setStationsToShow(filteredStations)
  }

  const StationsFilter = () => {
    return (
      <div className='filter-station'>
      Find stations:
        <input
          type='text'
          onChange={handleFiltering}
          value={filterValue}
        />
      </div>
    )
  }

  return (
    <>
      <h2>Citybike stations</h2>
      {StationsFilter()}
      <div className="stations-list">
        {StationsList()}
      </div>
    </>
  )
}

export default App
