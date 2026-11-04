import styles from './PassengerSelector.module.css'

type TravelClass = 'economy' | 'business'

type PassengerSelection = {
    adults: number
    children: number
    infants: number
    travelClass: TravelClass
}

type PassengerType = 'adults' | 'children' | 'infants'

type PassengerSelectorProps = {
    value: PassengerSelection
    onChange: (value: PassengerSelection) => void
}

const MAX_PASSENGERS = 10

function PassengerSelector({
    value,
    onChange,
}: PassengerSelectorProps) {
    const totalPassengers =
        value.adults + value.children + value.infants

    function changePassengerCount(
        type: PassengerType,
        change: 1 | -1,
    ) {
        const nextCount = value[type] + change

        if (type === 'adults' && nextCount < 1) {
            return
        }

        if (type !== 'adults' && nextCount < 0) {
            return
        }

        if (change > 0 && totalPassengers >= MAX_PASSENGERS) {
            return
        }

        if (
            type === 'infants' &&
            change > 0 &&
            value.infants >= value.adults
        ) {
            return
        }

        onChange({
            ...value,
            [type]: nextCount,
        })
    }
        return (
        <div
            className={styles.panel}
            role="dialog"
            aria-label="Выбор пассажиров и класса"
        >
            <div className={styles.row}>
                <div className={styles.info}>
                    <strong className={styles.name}>Взрослые</strong>
                    <span className={styles.hint}>12 лет и старше</span>
                </div>

                <div className={styles.counter}>
                    <button
                        className={styles.counterButton}
                        type="button"
                        aria-label="Уменьшить количество взрослых"
                        disabled={value.adults <= 1}
                        onClick={() => changePassengerCount('adults', -1)}
                    >
                        −
                    </button>

                    <span className={styles.count}>{value.adults}</span>

                    <button
                        className={styles.counterButton}
                        type="button"
                        aria-label="Увеличить количество взрослых"
                        disabled={totalPassengers >= MAX_PASSENGERS}
                        onClick={() => changePassengerCount('adults', 1)}
                    >
                        +
                    </button>
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.info}>
                    <strong className={styles.name}>Дети</strong>
                    <span className={styles.hint}>2–11 лет</span>
                </div>

                <div className={styles.counter}>
                    <button
                        className={styles.counterButton}
                        type="button"
                        aria-label="Уменьшить количество детей"
                        disabled={value.children <= 0}
                        onClick={() => changePassengerCount('children', -1)}
                    >
                        −
                    </button>

                    <span className={styles.count}>{value.children}</span>

                    <button
                        className={styles.counterButton}
                        type="button"
                        aria-label="Увеличить количество детей"
                        disabled={totalPassengers >= MAX_PASSENGERS}
                        onClick={() => changePassengerCount('children', 1)}
                    >
                        +
                    </button>
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.info}>
                    <strong className={styles.name}>Младенцы</strong>
                    <span className={styles.hint}>До 2 лет, без места</span>
                </div>

                <div className={styles.counter}>
                    <button
                        className={styles.counterButton}
                        type="button"
                        aria-label="Уменьшить количество младенцев"
                        disabled={value.infants <= 0}
                        onClick={() => changePassengerCount('infants', -1)}
                    >
                        −
                    </button>

                    <span className={styles.count}>{value.infants}</span>

                    <button
                        className={styles.counterButton}
                        type="button"
                        aria-label="Увеличить количество младенцев"
                        disabled={
                            totalPassengers >= MAX_PASSENGERS ||
                            value.infants >= value.adults
                        }
                        onClick={() => changePassengerCount('infants', 1)}
                    >
                        +
                    </button>
                </div>
            </div>

            <div className={`${styles.row} ${styles.classRow}`}>
                <strong className={styles.name}>Класс</strong>

                <div className={styles.classControl}>
                    <button
                        className={styles.classButton}
                        type="button"
                        aria-pressed={value.travelClass === 'economy'}
                        onClick={() =>
                            onChange({
                                ...value,
                                travelClass: 'economy',
                            })
                        }
                    >
                        Эконом
                    </button>

                    <button
                        className={styles.classButton}
                        type="button"
                        aria-pressed={value.travelClass === 'business'}
                        onClick={() =>
                            onChange({
                                ...value,
                                travelClass: 'business',
                            })
                        }
                    >
                        Бизнес
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PassengerSelector
export type { PassengerSelection }