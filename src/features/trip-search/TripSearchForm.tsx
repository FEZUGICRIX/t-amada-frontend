import { useState, type SubmitEvent } from 'react'
import styles from './TripSearchForm.module.css'

function TripSearchForm() {
  const [isOneWay, setIsOneWay] = useState(false)

  function handleSubmit(evt: SubmitEvent<HTMLFormElement>) {
    evt.preventDefault()
  }

  return (
    <section
      className={styles.section}
      aria-labelledby="trip-search-title"
    >
      <h1 className={styles.heading} id="trip-search-title">
        Соберите поездку целиком
      </h1>

      <p className={styles.subtitle}>
        Все нужные услуги — в одном заказе
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div
          className={`${styles.fields} ${
            isOneWay ? styles.oneWayFields : ''
          }`}
        >
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Откуда</span>
            <input
              className={styles.input}
              name="origin"
              defaultValue="Москва"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Куда</span>
            <input
              className={styles.input}
              name="destination"
              defaultValue="Екатеринбург"
            />
          </label>

          <button className={styles.field} type="button">
            <span className={styles.fieldLabel}>Когда</span>
            <span className={styles.fieldValue}>12 октября</span>
          </button>

          {!isOneWay && (
            <button className={styles.field} type="button">
              <span className={styles.fieldLabel}>Обратно</span>
              <span className={styles.fieldValue}>18 октября</span>
            </button>
          )}

          <button
            className={`${styles.field} ${styles.passengersField}`}
            type="button"
          >
            <span className={styles.fieldLabel}>
              Пассажиры и класс
            </span>
            <span className={styles.fieldValue}>
              2 пассажира, эконом
            </span>
          </button>

          <button className={styles.submitButton} type="submit">
            Найти билеты
          </button>
        </div>

        <label className={styles.oneWay}>
          <input
            className={styles.checkbox}
            type="checkbox"
            name="oneWay"
            checked={isOneWay}
            onChange={(evt) => setIsOneWay(evt.target.checked)}
          />
          <span className={styles.switch} aria-hidden="true" />
          <span>Билет в одну сторону</span>
        </label>
      </form>
    </section>
  )
}

export default TripSearchForm