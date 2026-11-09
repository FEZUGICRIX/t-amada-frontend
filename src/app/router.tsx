import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from './App'
import FlightSelectionPage from '@/pages/flight-selection/FlightSelectionPage'
import TripSearchPage from '@/pages/trip-search/TripSearchPage'

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
  component: FlightSelectionPage,
})

const routeTree = rootRoute.addChildren([searchRoute, flightsRoute])

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
