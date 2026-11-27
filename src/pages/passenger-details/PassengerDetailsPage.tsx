import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  emptyPassenger,
  validateContact,
  validatePassenger,
  type BuyerData,
  type FieldErrors,
  type PassengerData,
} from './passengerValidation'
import { readTransferTrip } from '@/pages/transfer/transferTrip'
import PassengerCard, { type PassengerCategory } from './PassengerCard'
import PassengerField from './PassengerField'
import { formatPhone } from './passengerFormatting'

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
  const navigate = useNavigate()
  const [categories] = useState(readPassengers)
  const [passengers, setPassengers] = useState<PassengerData[]>(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('passenger-details') || 'null') as {
        passengers?: PassengerData[]
      } | null
      const counts: Record<string, number> = {}
      return categories.map((category) => {
        const index = counts[category] || 0
        counts[category] = index + 1
        return (
          saved?.passengers?.filter((passenger) => passenger.category === category)[index] ??
          emptyPassenger(category)
        )
      })
    } catch {
      return categories.map(emptyPassenger)
    }
  })
  const [buyer, setBuyer] = useState<BuyerData>(() => {
    try {
      return (
        JSON.parse(sessionStorage.getItem('passenger-details') || 'null')?.buyer ?? {
          phone: '',
          email: '',
        }
      )
    } catch {
      return { phone: '', email: '' }
    }
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  useEffect(() => {
    sessionStorage.setItem('passenger-details', JSON.stringify({ passengers, buyer }))
  }, [passengers, buyer])
  const [hasHotel] = useState(() => {
    const trip = readTransferTrip()
    return Boolean(trip.hotel && trip.rooms.length)
  })
  return (
    <section className="relative isolate min-h-[calc(100vh-80px)] pt-6 pb-10 md:pt-8 lg:pt-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-[linear-gradient(to_bottom,white_0%,rgba(255,255,255,0.96)_18%,rgba(255,255,255,0.85)_50%,rgba(255,255,255,0.68)_100%),url('/trip-landscape.png')] bg-cover bg-bottom bg-no-repeat"
      />
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
          let departureDate: string | null = null
          try {
            departureDate =
              JSON.parse(sessionStorage.getItem('trip-search') || 'null')?.departureDate ?? null
          } catch {
            departureDate = null
          }
          const nextErrors = Object.assign(
            {},
            ...passengers.map((passenger, index) =>
              validatePassenger(passenger, index + 1, departureDate),
            ),
            validateContact(buyer),
          ) as FieldErrors
          setErrors(nextErrors)
          if (Object.keys(nextErrors).length === 0) void navigate({ to: '/review' })
          const firstError = Object.keys(nextErrors)[0]
          if (firstError) document.getElementById(firstError)?.focus()
        }}
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {passengers.map((passenger, index) => (
            <PassengerCard
              key={index}
              index={index + 1}
              passenger={passenger}
              errors={errors}
              onChange={(value) => {
                setPassengers((current) => current.map((item, i) => (i === index ? value : item)))
                setErrors((current) => {
                  const updated = { ...current }
                  const fields = {
                    surname: 'surname',
                    name: 'name',
                    birthDate: 'birth-date',
                    document: 'document',
                    documentNumber: 'document-number',
                    citizenship: 'citizenship',
                  } as const
                  for (const key of Object.keys(fields) as (keyof typeof fields)[]) {
                    if (value[key] !== passenger[key])
                      delete updated[`passenger-${index + 1}-${fields[key]}`]
                  }
                  return updated
                })
              }}
            />
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
              value={buyer.phone}
              onChange={(event) => {
                setBuyer({ ...buyer, phone: formatPhone(event.target.value) })
                setErrors((current) => {
                  const updated = { ...current }
                  delete updated['buyer-phone']
                  return updated
                })
              }}
              error={errors['buyer-phone']}
            />
            <PassengerField
              id="buyer-email"
              name="buyer-email"
              label="Электронная почта"
              type="email"
              autoComplete="email"
              value={buyer.email}
              onChange={(event) => {
                setBuyer({ ...buyer, email: event.target.value })
                setErrors((current) => {
                  const updated = { ...current }
                  delete updated['buyer-email']
                  return updated
                })
              }}
              onBlur={() => setBuyer((current) => ({ ...current, email: current.email.trim() }))}
              placeholder="name@example.ru"
              error={errors['buyer-email']}
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
        </div>
      </form>
    </section>
  )
}

export default PassengerDetailsPage
