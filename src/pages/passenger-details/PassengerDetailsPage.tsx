import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { readTransferTrip } from '@/pages/transfer/transferTrip'
import PassengerCard, { type PassengerCategory } from './PassengerCard'
import PassengerField from './PassengerField'

function readPassengers(): PassengerCategory[] {
  try {
    const search = JSON.parse(sessionStorage.getItem('trip-search') || 'null') as {
      passengers?: { adults?: number; children?: number; infants?: number }
    } | null
    if (!search?.passengers) return ['взрослый']
    const count = (value: number | undefined) =>
      Number.isInteger(value) && value! > 0 ? Math.min(value!, 10) : 0
    const passengers: PassengerCategory[] = [
      ...Array<PassengerCategory>(count(search.passengers.adults)).fill('взрослый'),
      ...Array<PassengerCategory>(count(search.passengers.children)).fill('ребёнок'),
      ...Array<PassengerCategory>(count(search.passengers.infants)).fill('младенец'),
    ]
    return passengers.length ? passengers : ['взрослый']
  } catch {
    return ['взрослый']
  }
}

function PassengerDetailsPage() {
  const [passengers] = useState(readPassengers)
  const [hasHotel] = useState(() => {
    const trip = readTransferTrip()
    return Boolean(trip.hotel && trip.rooms.length)
  })
  const [continued, setContinued] = useState(false)
  return (
    <section className="pt-6 pb-10 md:pt-8 lg:pt-10">
      <Link
        to={hasHotel ? '/transfer' : '/insurance'}
        className="mb-4 inline-flex h-10 items-center rounded-xl border border-[#cfd3d8] px-4 text-sm font-semibold text-text-primary no-underline hover:bg-[#f5f6f7] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Назад
      </Link>
      <header className="rounded-2xl bg-[radial-gradient(circle_at_90%_0%,rgb(255_221_45_/_22%),transparent_42%),linear-gradient(120deg,#fffdf8,#fff9e4)] p-4 md:p-6">
        <h1 className="text-[22px] leading-7 font-semibold md:text-[28px] md:leading-9 lg:text-[34px] lg:leading-10">
          Данные пассажиров
        </h1>
        <p className="mt-2 text-sm leading-5 text-text-secondary">
          Заполните данные точно как в документе
        </p>
      </header>
      <form
        noValidate
        className="mt-5"
        onSubmit={(event) => {
          event.preventDefault()
          setContinued(true)
        }}
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {passengers.map((category, index) => (
            <PassengerCard key={index} index={index + 1} category={category} />
          ))}
        </div>
        <fieldset className="mt-4 min-w-0 rounded-2xl border border-[#e1e4e8] bg-white p-4 md:p-5">
          <legend className="sr-only">Контакты покупателя</legend>
          <h2 className="text-lg leading-6 font-semibold md:text-xl">Контакты покупателя</h2>
          <div className="mt-4 grid max-w-[840px] grid-cols-1 gap-2.5 min-[380px]:grid-cols-2">
            <PassengerField
              id="buyer-phone"
              name="buyer-phone"
              label="Телефон"
              type="tel"
              autoComplete="tel"
            />
            <PassengerField
              id="buyer-email"
              name="buyer-email"
              label="Электронная почта"
              type="email"
              autoComplete="email"
            />
          </div>
        </fieldset>
        <div className="mt-5 flex flex-col items-stretch gap-2 sm:items-end">
          <button
            type="submit"
            className="min-h-11 cursor-pointer rounded-xl bg-accent px-6 text-sm font-semibold text-text-primary transition hover:brightness-95 active:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          >
            Перейти к проверке
          </button>
          {continued && (
            <p role="status" className="text-sm text-text-secondary">
              Следующий этап пока недоступен.
            </p>
          )}
        </div>
      </form>
    </section>
  )
}

export default PassengerDetailsPage
