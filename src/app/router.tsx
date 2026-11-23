import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import App from './App'
import FlightsRoutePage from '@/pages/flight-selection/FlightsRoutePage'
import TripSearchPage from '@/pages/trip-search/TripSearchPage'
import HotelSelectionPage from '@/pages/hotel-selection/HotelSelectionPage'
import HotelRoomsRoutePage from '@/pages/hotel-selection/HotelRoomsRoutePage'
import InsurancePage from '@/pages/insurance/InsurancePage'
import TransferPage from '@/pages/transfer/TransferPage'
import PassengerDetailsPage from '@/pages/passenger-details/PassengerDetailsPage'
import TripReviewPage from '@/pages/trip-review/TripReviewPage'
import { readTransferTrip } from '@/pages/transfer/transferTrip'
import {
  getRoomCapacity,
  getTripPassengerCount,
  readRoomSelection,
  resolveSelectedRooms,
} from '@/pages/hotel-selection/roomSelection'

const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: () => <p className="py-10 text-center">Страница не найдена</p>,
})

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TripSearchPage,
})

const flightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/flights',
  component: FlightsRoutePage,
})

const hotelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hotels',
  component: HotelSelectionPage,
})
const hotelRoomsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hotels/$hotelId/rooms',
  component: HotelRoomsRoutePage,
})
const insuranceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/insurance',
  component: InsurancePage,
  beforeLoad: () => {
    const selection = readRoomSelection()
    if (selection && getRoomCapacity(resolveSelectedRooms(selection)) < getTripPassengerCount())
      throw redirect({ to: '/hotels/$hotelId/rooms', params: { hotelId: selection.hotelId } })
  },
})
const routeTree = rootRoute.addChildren([
  searchRoute,
  flightsRoute,
  hotelsRoute,
  hotelRoomsRoute,
  insuranceRoute,
  createRoute({ getParentRoute: () => rootRoute, path: '/review', component: TripReviewPage }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/passengers',
    component: PassengerDetailsPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/transfer',
    component: TransferPage,
    beforeLoad: () => {
      const trip = readTransferTrip()
      if (!trip.hotel || !trip.rooms.length) throw redirect({ to: '/insurance' })
      if (getRoomCapacity(trip.rooms) < getTripPassengerCount())
        throw redirect({ to: '/hotels/$hotelId/rooms', params: { hotelId: trip.hotel.id } })
    },
  }),
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
