import { Link } from '@tanstack/react-router'
const steps = ['Авиабилет', 'Отель', 'Страховка', 'Трансфер']

function BookingSteps({ current }: { current: number }) {
  let hasSelectedHotel = false
  try {
    const selection = JSON.parse(sessionStorage.getItem('selected-room') || 'null') as {
      hotelId?: string
      roomId?: string
    } | null
    hasSelectedHotel = Boolean(selection?.hotelId && selection.roomId)
  } catch {
    hasSelectedHotel = false
  }
  return (
    <ol
      className="mt-4 flex list-none flex-wrap items-center gap-2 p-0"
      aria-label="Этапы бронирования"
    >
      {steps.map((step, index) => (
        <li
          key={step}
          aria-current={index === current ? 'step' : undefined}
          className={`shrink-0 rounded-full text-[13px] leading-4 ${index === current ? 'bg-accent font-semibold text-text-primary shadow-[0_2px_8px_rgb(255_221_45_/_35%)]' : 'bg-white/80 text-text-secondary'}`}
        >
          {index < current && index === 0 ? (
            <Link
              to="/flights"
              className="block rounded-full px-3 py-1.5 text-inherit no-underline hover:bg-white focus-visible:outline-2"
            >
              {index + 1}. {step}
            </Link>
          ) : index === 1 && current !== 1 && hasSelectedHotel ? (
            <Link
              to="/hotels"
              className="block rounded-full px-3 py-1.5 text-inherit no-underline hover:bg-white focus-visible:outline-2"
            >
              {index + 1}. {step}
            </Link>
          ) : index === 2 && current === 3 ? (
            <Link
              to="/insurance"
              className="block rounded-full px-3 py-1.5 text-inherit no-underline hover:bg-white focus-visible:outline-2"
            >
              {index + 1}. {step}
            </Link>
          ) : index === 3 && current === 2 && hasSelectedHotel ? (
            <Link
              to="/transfer"
              className="block rounded-full px-3 py-1.5 text-inherit no-underline hover:bg-white focus-visible:outline-2"
            >
              {index + 1}. {step}
            </Link>
          ) : (
            <span className="block px-3 py-1.5">
              {index + 1}. {step}
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}

export default BookingSteps
