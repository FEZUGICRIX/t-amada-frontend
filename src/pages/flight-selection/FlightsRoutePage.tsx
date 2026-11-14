import { useNavigate } from '@tanstack/react-router'
import FlightSelectionPage from './FlightSelectionPage'

function FlightsRoutePage() {
  const navigate = useNavigate()
  return <FlightSelectionPage onComplete={() => void navigate({ to: '/hotels' })} />
}

export default FlightsRoutePage
