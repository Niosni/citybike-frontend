import { useState, useEffect, useCallback } from 'react'
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
  hideButton: ()=>void
}

// Component for expanded station information view
const Station = ({ station, hideButton }: StationProps) => {
  const [loading, setLoading] = useState(false)
  const [extraInfo, setextraInfo] = useState<ExtraInfo>()

  const fetchExtraInfo = useCallback(async () => {
    setLoading(true)
    const departuresArray = await stationService.getDepartures(station.id)
    const returnsArray = await stationService.getReturns(station.id)

    const departureInfo = calculateDepartureExtraInfo(departuresArray)
    const extraInfoObject = {
      ...departureInfo,
      totalReturns: returnsArray.length
    }
    setextraInfo(extraInfoObject)
    setLoading(false)
  }, [station.id])

  useEffect(() => {
    const fetchData = async () => {
      await fetchExtraInfo()
    }
    if (!extraInfo) {
      try {
        void fetchData()
      } catch (error) {
        console.error(error)
      }

    }
  }, [extraInfo, fetchExtraInfo])

  const calculateDepartureExtraInfo = (departuresArray: Journey[]) => {
    const averageDuration = _.meanBy(departuresArray, (journey => journey.duration))
    const averageDistance = _.meanBy(departuresArray, (journey => journey.distance))

    const departureInfoObject = {
      averageDuration,
      averageDistance,
      totalDepartures: departuresArray.length,
    }
    return(departureInfoObject)
  }

  const getMinutesAndSeconds = (durationInSeconds: number) => {
    const minutes = Math.floor(durationInSeconds/60)
    const seconds = Math.floor(durationInSeconds%60)
    return (
      <>
        {minutes} min {seconds} sec
      </>
    )
  }

  const getDistanceInKilometers = (distanceInMeters: number) => {
    const roundedToMeters = Math.round(distanceInMeters)
    const distanceInKm = (roundedToMeters/1000).toFixed(2)
    return (
      <>
        {distanceInKm} kilometers
      </>
    )
  }

  return (
    <div className="station-expanded">
      <div className="station-header">
        <div>Station: {station.station_name}</div>
        <div>Address: {station.station_address}</div>
        <div>
          <button onClick={hideButton} className="back-button">
            Back to list
          </button>
        </div>
      </div>
      { (loading || !extraInfo) ? 'Loading data...' :
        <div className="station-box">
          <div className="journey-info">
            <p>Journeys on this station:</p>
            <ul>
              <li>{extraInfo.totalReturns} bikes returned</li>
              <li>{extraInfo.totalDepartures} bikes departed</li>
              <ul>
                <li>{getMinutesAndSeconds(extraInfo.averageDuration)} average ride time</li>
                <li>{getDistanceInKilometers(extraInfo.averageDistance)} average ride distance</li>
              </ul>
            </ul>
          </div>
        </div>
      }
    </div>
  )
}

export default Station