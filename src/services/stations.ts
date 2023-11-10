import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/stations'

interface Station {
  id: number
  station_name: string
  station_address: string
  coordinate_x: string
  coordinate_y: string
}

interface Journey {
  id: number
  return_station_id: number
  distance: number
  duration: number
}

const getAll = async (): Promise<Station[]> => {
  const { data } = await axios.get<Station[]>(baseUrl)
  return data
}

const getStation = async (id: number): Promise<Station> => {
  const { data } = await axios.get<Station>(`${baseUrl}/${id}`)
  return data
}

const getDepartures = async (id: number): Promise<Journey[]> => {
  const { data } = await axios.get<Journey[]>(`${baseUrl}/${id}/departures`)
  return data
}

const getReturns = async (id: number): Promise<Journey[]> => {
  const { data } = await axios.get<Journey[]>(`${baseUrl}/${id}/returns`)
  return data
}

export default {
  getAll,
  getStation,
  getDepartures,
  getReturns
}