import { Link, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import BookingSteps from '@/shared/BookingSteps'
import formatPrice from '@/pages/flight-selection/formatPrice'
import { getTripFlightPrice } from '@/pages/hotel-selection/tripFlightPrice'
import { hotels } from '@/pages/hotel-selection/hotels'
import {
  getRoomNightlyTotal,
  readRoomSelection,
  resolveSelectedRooms,
} from '@/pages/hotel-selection/roomSelection'
import { insurancePlans } from './insurancePlans'
import InsuranceCard from './InsuranceCard'
import TripPeriodPicker from '@/shared/TripPeriod'
import { formatTripPeriod, readTripPeriod } from '@/shared/tripPeriodData'
import { readHotelNights } from '@/shared/tripPeriodData'
import { FlightPriceRow, HotelRoomsPriceRow, InsurancePriceRow } from '@/shared/TripPriceRows'
import { getInsurancePrice } from './insurancePrice'
import SkipStepButton from '@/shared/SkipStepButton'

function InsurancePage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    sessionStorage.getItem('selected-insurance'),
  )
  const [transferRemoved] = useState(() => {
    const notice = sessionStorage.getItem('transfer-removed-notice') === '1'
    sessionStorage.removeItem('transfer-removed-notice')
    return notice
  })
  const [search] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('trip-search') || 'null') as {
        destination?: string
        departureDate?: string | null
        returnDate?: string | null
        isOneWay?: boolean
        passengers?: { adults: number; children: number; infants: number }
      } | null
    } catch {
      return null
    }
  })
  const [trip] = useState(() => {
    try {
      const selection = readRoomSelection()
      const hotel = hotels.find((item) => item.id === selection?.hotelId)
      const rooms = resolveSelectedRooms(selection)
      return { hotel, rooms, flightPrice: getTripFlightPrice() }
    } catch {
      return { hotel: undefined, rooms: [], flightPrice: 0 }
    }
  })
  const [insurancePeriod, setInsurancePeriod] = useState(() =>
    readTripPeriod('insurance-period', search),
  )
  const [periodError, setPeriodError] = useState(0)
  const periodRef = useRef<HTMLDivElement>(null)
  const selected = insurancePlans.find((plan) => plan.id === selectedId)
  const insurancePrice = selected
    ? getInsurancePrice(selected.price, insurancePeriod, search)
    : null
  const nights = readHotelNights()
  const total =
    trip.flightPrice + getRoomNightlyTotal(trip.rooms) * (nights ?? 0) + (insurancePrice ?? 0)
  function selectPlan(id: string) {
    setSelectedId(id)
    sessionStorage.setItem('selected-insurance', id)
  }
  function continueTrip() {
    if (trip.hotel && trip.rooms.length) {
      void navigate({ to: '/transfer' })
      return
    }
    void navigate({ to: '/passengers' })
  }
  function skipInsurance() {
    setSelectedId(null)
    sessionStorage.removeItem('selected-insurance')
    continueTrip()
  }
  return (
    <section className="relative isolate min-h-[calc(100vh-80px)] pt-6 pb-28 md:pt-8 lg:pt-10 lg:pb-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden"
      >
        <svg
          className="absolute bottom-0 left-0 h-[min(46vh,420px)] w-full"
          viewBox="0 0 1440 420"
          preserveAspectRatio="xMidYMax slice"
          fill="none"
        >
          <circle cx="1190" cy="115" r="54" fill="#f8df80" />
          <path
            d="M0 300 155 165 255 250 385 118 535 278 660 178 840 326 1015 173 1160 297 1305 150 1440 261V420H0Z"
            fill="#f2ead2"
          />
          <path d="m278 229 107-111 109 116-47-20-24 13-39-38-35 34-25-11Z" fill="#fffdf6" />
          <path d="m1204 250 101-100 96 86-39-14-19 11-38-34-34 30-22-8Z" fill="#fffdf6" />
          <path
            d="M0 340C155 278 260 299 393 347c137 50 274 42 423-7 180-59 326-73 624-7v87H0Z"
            fill="#dfe9e2"
          />
          <path
            d="M0 382c184-63 316-47 456-9 171 47 305 24 455-11 171-40 324-31 529 18v40H0Z"
            fill="#ceded5"
          />
          <path
            d="M1045 92c12-9 25-9 37 0m8 11c10-7 20-7 30 0"
            stroke="#b0a374"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {trip.hotel && trip.rooms.length > 0 ? (
        <Link
          to="/hotels/$hotelId/rooms"
          params={{ hotelId: trip.hotel.id }}
          className="mb-4 inline-flex h-10 items-center rounded-xl border border-[#cfd3d8] px-4 text-sm font-semibold text-text-primary no-underline hover:bg-[#f5f6f7]"
        >
          Назад
        </Link>
      ) : (
        <Link
          to="/hotels"
          className="mb-4 inline-flex h-10 items-center rounded-xl border border-[#cfd3d8] px-4 text-sm font-semibold text-text-primary no-underline hover:bg-[#f5f6f7]"
        >
          Назад
        </Link>
      )}
      <header className="rounded-2xl bg-[radial-gradient(circle_at_90%_0%,rgb(255_221_45_/_22%),transparent_42%),linear-gradient(120deg,#fffdf8,#fff9e4)] p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[22px] leading-7 font-semibold md:text-[28px] md:leading-9 lg:text-[34px] lg:leading-10">
            Выберите страховку
          </h1>
          <SkipStepButton onClick={skipInsurance} />
        </div>
        <p className="mt-2 text-sm text-text-secondary">Стоимость указана за всех пассажиров</p>
        <BookingSteps current={2} />
      </header>
      {transferRemoved && (
        <p role="status" className="mt-4 rounded-xl bg-[#fff7d6] p-3 text-sm">
          Отель удалён, выбранный трансфер тоже удалён.
        </p>
      )}
      {search?.isOneWay ? (
        <div ref={periodRef}>
          <TripPeriodPicker
            label="Даты страховки"
            period={insurancePeriod}
            errorAttempt={periodError}
            onChange={(period) => {
              setInsurancePeriod(period)
              if (period.start && period.end) setPeriodError(0)
              sessionStorage.setItem('insurance-period', JSON.stringify(period))
            }}
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-text-secondary">
          Даты страховки: {formatTripPeriod(insurancePeriod)}
        </p>
      )}
      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
        <div aria-label="Варианты страховки" className="space-y-2">
          {insurancePlans.map((plan) => (
            <InsuranceCard
              key={plan.id}
              plan={plan}
              selected={selectedId === plan.id}
              search={search}
              period={insurancePeriod}
              onSelect={() => selectPlan(plan.id)}
            />
          ))}
        </div>
        <aside
          aria-label="Ваша поездка"
          className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e1e4e8] bg-white p-4 shadow-[0_-6px_20px_rgb(17_17_17_/_8%)] lg:static lg:rounded-2xl lg:border lg:shadow-sm"
        >
          <h2 className="hidden text-xl font-semibold lg:block">Ваша поездка</h2>
          <details className="mb-3 lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold">Состав поездки</summary>
            <FlightPriceRow />
            {trip.rooms.length > 0 && <HotelRoomsPriceRow rooms={trip.rooms} nights={nights} />}
            {selected && <InsurancePriceRow total={insurancePrice} />}
          </details>
          <div className="hidden lg:block">
            <FlightPriceRow />
          </div>
          {trip.rooms.length > 0 && (
            <div className="hidden lg:block">
              <HotelRoomsPriceRow rooms={trip.rooms} nights={nights} />
            </div>
          )}
          {selected && (
            <div className="hidden lg:block">
              <InsurancePriceRow total={insurancePrice} />
            </div>
          )}
          <div className="flex items-center justify-between gap-4 lg:mt-3 lg:border-t lg:border-[#e1e4e8] lg:pt-3">
            <div>
              <span className="block text-xs text-text-secondary">Итого</span>
              <strong>
                {(trip.rooms.length > 0 && !nights) || (selected && insurancePrice === null)
                  ? 'Укажите даты'
                  : formatPrice(total)}
              </strong>
            </div>
            <button
              type="button"
              disabled={!selected}
              onClick={() => {
                if (search?.isOneWay && (!insurancePeriod.start || !insurancePeriod.end)) {
                  setPeriodError((count) => count + 1)
                  periodRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
                  return
                }
                continueTrip()
              }}
              className="h-10 rounded-xl bg-accent px-5 text-sm font-semibold text-text-primary disabled:cursor-not-allowed disabled:bg-[#e7e9ec] disabled:text-text-secondary"
            >
              Продолжить
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}
export default InsurancePage
