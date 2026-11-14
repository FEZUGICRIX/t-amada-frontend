import { Link, useParams } from '@tanstack/react-router'
import { hotels } from './hotels'

function HotelRoomsPage() {
  const { hotelId } = useParams({ from: '/hotels/$hotelId/rooms' })
  const hotel = hotels.find((item) => item.id === hotelId)
  return (
    <section className="pt-6 md:pt-8 lg:pt-10">
      <Link
        to="/hotels"
        className="inline-flex h-10 items-center rounded-xl border border-[#cfd3d8] px-4 text-sm font-semibold text-text-primary no-underline"
      >
        Назад к отелям
      </Link>
      {hotel ? (
        <>
          <h1 className="mt-6 text-2xl font-semibold">{hotel.name}</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Страница выбора номера появится в следующей задаче.
          </p>
        </>
      ) : (
        <h1 className="mt-6 text-2xl font-semibold">Отель не найден</h1>
      )}
    </section>
  )
}
export default HotelRoomsPage
