import { transferOptions } from './transferOptions'

export type TransferSelection = {
  optionId: string
  roundTrip: boolean
  hotelId: string
  flightKey: string
}

export function readTransferSelection(
  hotelId: string | undefined,
  passengers: number,
  flightKey: string,
) {
  try {
    const saved = JSON.parse(
      sessionStorage.getItem('selected-transfer') || 'null',
    ) as TransferSelection | null
    if (!saved) return { selection: null, invalid: false }
    const option = transferOptions.find((item) => item.id === saved.optionId)
    if (
      !hotelId ||
      saved.hotelId !== hotelId ||
      saved.flightKey !== flightKey ||
      !option ||
      option.capacity < passengers ||
      typeof saved.roundTrip !== 'boolean'
    ) {
      sessionStorage.removeItem('selected-transfer')
      return { selection: null, invalid: true }
    }
    return { selection: saved, invalid: false }
  } catch {
    sessionStorage.removeItem('selected-transfer')
    return { selection: null, invalid: true }
  }
}

export function clearTransfer() {
  const existed = Boolean(sessionStorage.getItem('selected-transfer'))
  sessionStorage.removeItem('selected-transfer')
  sessionStorage.removeItem('transfer-schedule')
  return existed
}
