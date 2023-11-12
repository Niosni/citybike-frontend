import '@testing-library/jest-dom'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Station from './Station'
import StationCard from './StationCard'
import { expect, jest, test } from '@jest/globals'

const mockHandler = jest.fn()

const station = {
  id: 283,
  station_name: 'Alakiventie',
  station_address: 'Alakiventie 4',
  coordinate_x: '25.0772822325582',
  coordinate_y: '60.2198397844715'
}

afterEach(() => {
  cleanup()
})

describe('Station list view tests', () => {
  test('renders content', () => {
    render(<Station station={station} showButton={mockHandler} />)
    const element = screen.getByText('Alakiventie')

    expect(element).toBeDefined()
  })

  test('Clicking the "show details" -button calls event handler once', async () => {
    render(<Station station={station} showButton={mockHandler} />)
    const user = userEvent.setup()

    const button = screen.getByText('Show details')
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)
  }, 3000)
})

describe('Single station view tests',() => {
  test('"Loading data" is displayed when Station information is first rendered', () => {
    render(<StationCard station={station} hideButton={mockHandler} />)
    const element = screen.getByText('Loading data...')
    expect(element).toBeDefined()
  })

  test('Single station details are displayed after 2 second of rendering ', () => {
    render(<StationCard station={station} hideButton={mockHandler} />)
    setTimeout( () => {
      const element = screen.getByText('bikes returned')
      screen.debug(element)
      expect(element).toBeDefined()
    }, 5000)
  })
})