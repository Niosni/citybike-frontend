import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Station from './Station'
import { expect, jest, test } from '@jest/globals'

test('renders content', () => {
  const station = {
    id: 283,
    station_name: 'Alakiventie',
    station_address: 'Alakiventie 4',
    coordinate_x: '25.0772822325582',
    coordinate_y: '60.2198397844715'
  }

  render(<Station station={station} showButton={jest.fn()} />)

  const element = screen.getByText('Alakiventie')
  expect(element).toBeDefined()
})