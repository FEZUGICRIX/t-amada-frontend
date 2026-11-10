function formatPrice(price: number) {
  const formattedPrice = price.toLocaleString('ru-RU').replace(/[\u00a0\u202f]/g, ' ')

  return `${formattedPrice} ₽`
}

export default formatPrice
