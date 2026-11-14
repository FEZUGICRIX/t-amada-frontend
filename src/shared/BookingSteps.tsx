const steps = ['Авиабилет', 'Отель', 'Страховка', 'Трансфер']

function BookingSteps({ current }: { current: number }) {
  return (
    <ol
      className="mt-4 flex list-none flex-wrap items-center gap-2 p-0"
      aria-label="Этапы бронирования"
    >
      {steps.map((step, index) => (
        <li
          key={step}
          aria-current={index === current ? 'step' : undefined}
          className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] leading-4 ${index === current ? 'bg-accent font-semibold text-text-primary shadow-[0_2px_8px_rgb(255_221_45_/_35%)]' : 'bg-white/80 text-text-secondary'}`}
        >
          {index + 1}. {step}
        </li>
      ))}
    </ol>
  )
}

export default BookingSteps
