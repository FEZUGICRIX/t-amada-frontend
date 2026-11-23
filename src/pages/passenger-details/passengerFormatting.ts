export function formatBirthDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('.')
}

export function formatPhone(value: string) {
  let digits = value.replace(/\D/g, '').slice(0, 15)
  if (!digits) return ''
  if (digits[0] === '8') digits = `7${digits.slice(1)}`
  if (digits[0] === '9') digits = `7${digits}`
  if (digits[0] !== '7') return `+${digits}`
  digits = digits.slice(0, 11)
  const rest = digits.slice(1)
  return `+7${rest ? ` ${rest.slice(0, 3)}` : ''}${rest.length > 3 ? ` ${rest.slice(3, 6)}` : ''}${rest.length > 6 ? `-${rest.slice(6, 8)}` : ''}${rest.length > 8 ? `-${rest.slice(8, 10)}` : ''}`
}
