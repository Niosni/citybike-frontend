import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Station from './Station'
import { expect, jest, test } from '@jest/globals'

const mockHandler = jest.fn()

const station = {
  id: 283,
  station_name: 'Alakiventie',
  station_address: 'Alakiventie 4',
  coordinate_x: '25.0772822325582',
  coordinate_y: '60.2198397844715'
}

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
})