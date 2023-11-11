import { useState, useEffect } from 'react'
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

const Station = ({ station, hideButton }: StationProps) => {
  const [loading, setLoading] = useState(false)
  const [extraInfo, setextraInfo] = useState<ExtraInfo>()

  useEffect(() => {
    if (!extraInfo) {
      fetchExtraInfo(station)
    }
  }, [])

  const fetchExtraInfo = (station: Station) => {
    setLoading(true)
    stationService.getDepartures(station.id)
      .then((departuresArray: Journey[]) => {

        const departureInfo = calculateDepartureExtraInfo(departuresArray)
        stationService.getReturns(station.id)
          .then((returnsArray : Journey[]) => {
            const totalReturns = returnsArray.length
            setextraInfo({
              ...departureInfo,
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