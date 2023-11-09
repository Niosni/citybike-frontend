import { useState } from 'react'
import stationService from '../services/stations'
import _ from 'lodash'

interface Journey {
  id: number
  return_station_id: number
  distance: number
  duration: number
}

interface Station {
  id: number
  station_name: string
  station_address: string
  coordinate_x: string
  coordinate_y: string
}

interface ExtraInfo {
  averageDuration: number
  averageDistance: number
  totalDepartures: number
  totalReturns: number
}

interface StationProps {
  station: Station
}

const Station = ({ station }: StationProps) => {
  const [expanded, setExpanded] = useState(false)
  const [extraInfo, setextraInfo] = useState<ExtraInfo>({
    averageDuration:0,
    averageDistance:0,
    totalDepartures:0,
    totalReturns:0
  })
  const [loading, setLoading] = useState(false)

  const toggleExpansion = () => {
    if (!expanded) {
      // Expand station and fetch extra information
      setLoading(true)
      stationService.getDepartures(station.id)
        .then((departuresArray: Journey[]) => {

          const updatedInfo = calculateExtraInfo(departuresArray)
          stationService.getReturns(station.id)
            .then((returnsArray : Journey[]) => {
              const totalReturns = returnsArray.length
              setextraInfo({
                ...updatedInfo,
                totalReturns
              })
            })
            .catch((error) => {
              console.error('Error fetching returns: ', error)
            })
        })
        .catch((error) => {
          console.error('Error fetching departures: ', error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    setExpanded(!expanded)
  }
  const calculateExtraInfo = (departuresArray: Journey[]) => {
    const averageDuration = _.meanBy(departuresArray, (journey => journey.duration))
    const averageDistance = _.meanBy(departuresArray, (journey => journey.distance))

    const extraInfoObject: ExtraInfo = {
      averageDuration,
      averageDistance,
      totalDepartures: departuresArray.length,
      totalReturns: 0
    }
    setextraInfo(extraInfoObject)
    return(extraInfoObject)
  }

  return (
    <div className='station'>
      <h3>{station.station_name}</h3>
      { expanded && (
        <div className='station-expanded'>
          <p>Address: {station.station_address}</p>
          {loading ? <p>Loading data...</p> :
          <div>
            <p>Total departures from this station: {extraInfo.totalDepartures} <br></br>
              with average duration of {Math.floor((extraInfo.averageDuration)/60)} min {Math.floor(extraInfo.averageDuration)%60} sec
              and distance of {Math.round(extraInfo.averageDistance)} meters.
            </p>
            <p>Total journeys ended here: {extraInfo.totalReturns}</p>
          </div>
          }
        </div>
      )}
      <button onClick={toggleExpansion}>
        {expanded ? 'Collapse' : 'Show details'}
      </button>
    </div>

  )
}

export default Station