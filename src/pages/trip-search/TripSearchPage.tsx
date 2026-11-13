import { useNavigate } from '@tanstack/react-router'
import TripSearchForm from '@/features/trip-search/TripSearchForm'

function TripSearchPage() {
  const navigate = useNavigate()

  return (
    <TripSearchForm
      onSearch={(search) => {
        sessionStorage.setItem('trip-search', JSON.stringify(search))
        sessionStorage.removeItem('selected-flights')
        void navigate({ to: '/flights' })
      }}
    />
  )
}

export default TripSearchPage
