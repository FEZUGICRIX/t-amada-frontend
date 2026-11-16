import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from './App'
import FlightsRoutePage from '@/pages/flight-selection/FlightsRoutePage'
import TripSearchPage from '@/pages/trip-search/TripSearchPage'
import HotelSelectionPage from '@/pages/hotel-selection/HotelSelectionPage'
import HotelRoomsRoutePage from '@/pages/hotel-selection/HotelRoomsRoutePage'
import InsurancePage from '@/pages/insurance/InsurancePage'

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
})
const routeTree = rootRoute.addChildren([
  searchRoute,
  flightsRoute,
  hotelsRoute,
  hotelRoomsRoute,
  insuranceRoute,
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
