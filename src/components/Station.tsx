interface Station {
  id: number
  station_name: string
  station_address: string
  coordinate_x: string
  coordinate_y: string
}

interface StationProps {
  station: Station
  showButton: (station: Station) => void
}

// Component for short list item style station info
const Station = ({ station, showButton }: StationProps) => {

  return (
    <div className="station">
      <div>{station.station_name}</div>
      <div>{station.station_address}</div>
      <div>
        <button onClick={() => { showButton(station) }}>
          Show details
        </button>
      </div>
    </div>
  )
}

export default Station