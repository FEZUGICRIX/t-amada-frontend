import { useNavigate } from '@tanstack/react-router'
import HotelRoomsPage from './HotelRoomsPage'

function HotelRoomsRoutePage() {
  const navigate = useNavigate()
  return <HotelRoomsPage onContinue={() => void navigate({ to: '/insurance' })} />
}
export default HotelRoomsRoutePage
