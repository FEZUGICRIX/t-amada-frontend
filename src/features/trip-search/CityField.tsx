import { useId, useState, type KeyboardEvent } from 'react'
import type { FlightCity } from '@/entities/flight'

interface CityFieldProps {
  label: string
  name: 'origin' | 'destination'
  value: string
  cities: FlightCity[]
  isFetching?: boolean
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onChange: (value: string) => void
}

export default function CityField({
  label,
  name,
  value,
  cities,
  isFetching = false,
  isOpen,
  onOpen,
  onClose,
  onChange,
}: CityFieldProps) {
  const inputId = useId()
  const listboxId = useId()
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  function selectCity(cityName: string) {
    onChange(cityName)
    setHighlightedIndex(-1)
    onClose()
  }

  function handleKeyDown(evt: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (evt.key === 'ArrowDown' || evt.key === 'ArrowUp')) {
      onOpen()
      return
    }

    if (!isOpen) return

    if (evt.key === 'Escape') {
      evt.preventDefault()
      setHighlightedIndex(-1)
      onClose()
      return
    }

    if (evt.key === 'ArrowDown') {
      evt.preventDefault()
      setHighlightedIndex((prev) => (cities.length ? (prev + 1) % cities.length : -1))
      return
    }

    if (evt.key === 'ArrowUp') {
      evt.preventDefault()
      setHighlightedIndex((prev) =>
        cities.length ? (prev <= 0 ? cities.length - 1 : prev - 1) : -1,
      )
      return
    }

    if (evt.key === 'Enter' && highlightedIndex >= 0 && cities[highlightedIndex]) {
      evt.preventDefault()
      selectCity(cities[highlightedIndex].name)
    }
  }

  return (
    <div className="relative min-w-0">
      <label
        htmlFor={inputId}
        className="flex h-[60px] min-w-0 flex-col items-start justify-center rounded-xl border border-[#e3e5e8] bg-background-primary p-2 text-left text-text-primary focus-within:border-text-primary md:h-16 md:px-3 md:py-2.5"
      >
        <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[9px] leading-3 text-text-secondary md:text-[10px] md:leading-[14px]">
          {label}
        </span>
        <input
          id={inputId}
          name={name}
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
          }
          className="w-full min-w-0 border-0 bg-transparent p-0 text-xs leading-4 font-semibold text-text-primary outline-0 md:text-sm md:leading-5"
          value={value}
          onFocus={onOpen}
          onBlur={() => {
            setHighlightedIndex(-1)
            onClose()
          }}
          onChange={(evt) => {
            setHighlightedIndex(-1)
            onChange(evt.target.value)
          }}
          onKeyDown={handleKeyDown}
        />
      </label>

      {isOpen && (cities.length > 0 || isFetching) && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={`Подсказки: ${label}`}
          onMouseDown={(evt) => evt.preventDefault()}
          className="absolute top-[calc(100%+6px)] left-0 z-30 max-h-60 w-full min-w-[220px] overflow-y-auto rounded-xl border border-[#e3e5e8] bg-background-primary py-1.5 shadow-[0_12px_32px_rgb(0_0_0_/_12%)]"
        >
          {cities.length > 0 ? (
            cities.map((city, index) => {
              const isHighlighted = index === highlightedIndex
              return (
                <li
                  key={city.name}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={isHighlighted}
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(evt) => {
                      evt.preventDefault()
                      selectCity(city.name)
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-xs md:text-sm ${
                      isHighlighted ? 'bg-[#f4f5f7]' : 'hover:bg-[#f4f5f7]'
                    }`}
                  >
                    <span className="font-medium text-text-primary">{city.name}</span>
                    <span className="ml-2 text-[11px] text-text-secondary">{city.country}</span>
                  </button>
                </li>
              )
            })
          ) : (
            <li className="px-3 py-2 text-xs text-text-secondary">Поиск городов…</li>
          )}
        </ul>
      )}
    </div>
  )
}
