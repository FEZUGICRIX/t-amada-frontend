function TripBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden"
    >
      {(['left', 'right'] as const).map((side) => (
        <svg
          key={side}
          className={`absolute top-64 h-[600px] w-[min(40vw,260px)] text-[#e8ddb9] ${side === 'left' ? 'left-0 -scale-x-100' : 'right-0'}`}
          viewBox="0 0 260 600"
          fill="none"
          preserveAspectRatio="xMaxYMin slice"
        >
          <path
            d="M260 20C115 100 330 200 170 310S85 485 260 580"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M290 20C145 100 360 200 200 310S115 485 290 580"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M320 20C175 100 390 200 230 310S145 485 320 580"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </div>
  )
}

export default TripBackground
