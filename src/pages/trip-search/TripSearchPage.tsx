import { useNavigate } from '@tanstack/react-router'
import TripSearchForm from '@/features/trip-search/TripSearchForm'
import SiteFooter from '@/shared/SiteFooter'

function TripSearchPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[calc(100dvh-62px)] flex-col md:min-h-[calc(100dvh-70px)] lg:min-h-[calc(100dvh-76px)]">
      <TripSearchForm
        onSearch={(search) => {
          sessionStorage.setItem('trip-search', JSON.stringify(search))
          sessionStorage.removeItem('selected-flights')
          sessionStorage.removeItem('selected-room')
          sessionStorage.removeItem('selected-insurance')
          sessionStorage.removeItem('hotel-period')
          sessionStorage.removeItem('insurance-period')
          void navigate({ to: '/flights' })
        }}
      />
      <section
        className="relative isolate mt-8 flex flex-1 flex-col px-4 md:mt-10 md:px-8"
        aria-labelledby="trip-steps-title"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-[linear-gradient(to_bottom,white_0%,rgba(255,255,255,0.93)_18%,rgba(255,255,255,0.5)_50%,rgba(255,255,255,0.04)_100%),url('/trip-landscape.png')] bg-cover bg-bottom bg-no-repeat"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 520 220"
          fill="none"
          className="pointer-events-none absolute right-0 top-0 hidden h-[220px] w-[52%] text-[#aa9141] opacity-40 md:block"
          preserveAspectRatio="xMaxYMid meet"
        >
          <circle
            cx="365"
            cy="104"
            r="77"
            fill="#fff5d1"
            fillOpacity="0.7"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M288 104h154M365 27c-25 22-38 47-38 77s13 55 38 77m0-154c25 22 38 47 38 77s-13 55-38 77M300 65c20 12 41 18 65 18s45-6 65-18M300 143c20-12 41-18 65-18s45 6 65 18"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M102 167c50-52 97-67 147-45 26 12 48 17 74 9m88-64c25-17 50-23 80-17"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeDasharray="4 7"
            strokeLinecap="round"
          />
          <circle cx="102" cy="167" r="4" fill="#fff" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="491" cy="50" r="4" fill="#ffdd2d" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="trip-steps-title"
              className="text-xl font-semibold tracking-[-0.025em] md:text-2xl"
            >
              Из чего складывается поездка
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Начните с перелёта и добавьте нужные услуги.
            </p>
          </div>
        </div>
        <ol className="relative mt-6 grid list-none grid-cols-1 gap-0 p-0 min-[520px]:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Перелёт', text: 'Выберите удобные рейсы', first: true },
            { title: 'Отель', text: 'Найдите место для проживания', first: false },
            { title: 'Страховка', text: 'Добавьте защиту на время поездки', first: false },
            { title: 'Трансфер', text: 'Доберитесь из аэропорта до отеля', first: false },
          ].map((step, index) => (
            <li
              key={step.title}
              className="relative flex min-w-0 gap-4 pb-6 last:pb-0 min-[520px]:pb-6 lg:block lg:pb-0"
            >
              <div
                aria-hidden="true"
                className="relative flex shrink-0 flex-col items-center lg:mb-4 lg:flex-row"
              >
                <span
                  className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${step.first ? 'bg-accent text-text-primary' : 'border border-[#d5d9dd] bg-white text-text-secondary'}`}
                >
                  {index + 1}
                </span>
                {index < 3 && (
                  <span className="my-1 w-px grow bg-[#dfe2e6] min-[520px]:hidden lg:my-0 lg:block lg:h-px lg:w-auto lg:grow" />
                )}
              </div>
              <div className="min-w-0 pt-0.5 lg:pr-6 lg:pt-0">
                <h3 className="text-sm leading-5 font-semibold">{step.title}</h3>
                <p className="mt-1 max-w-[210px] text-sm leading-5 text-text-secondary">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="min-h-10 flex-1" aria-hidden="true" />
        <SiteFooter onLandscape />
      </section>
    </div>
  )
}

export default TripSearchPage
