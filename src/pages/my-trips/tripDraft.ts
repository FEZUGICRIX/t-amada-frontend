const DRAFT_KEY = 'trip-planning-draft'
const KEYS = [
  'trip-search',
  'selected-flights',
  'selected-room',
  'selected-insurance',
  'hotel-period',
  'insurance-period',
  'selected-transfer',
  'transfer-schedule',
] as const

type Draft = { path: string; values: Record<string, string | null> }

function validPath(path: string) {
  return (
    ['/flights', '/hotels', '/insurance', '/transfer', '/passengers', '/review'].includes(path) ||
    /^\/hotels\/[^/]+\/rooms$/.test(path)
  )
}

export function readDraft(): Draft | null {
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null') as Draft | null
    if (
      !draft ||
      typeof draft.path !== 'string' ||
      !validPath(draft.path) ||
      !draft.values ||
      typeof draft.values['trip-search'] !== 'string'
    )
      return null
    const search = JSON.parse(draft.values['trip-search'])
    return typeof search?.origin === 'string' && typeof search?.destination === 'string'
      ? draft
      : null
  } catch {
    return null
  }
}

export function saveDraft(path: string) {
  if (!validPath(path) || !sessionStorage.getItem('trip-search')) return
  const values = Object.fromEntries(KEYS.map((key) => [key, sessionStorage.getItem(key)]))
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ path, values }))
  } catch {
    /* Current tab keeps its session data. */
  }
}

export function restoreDraft(draft: Draft) {
  for (const key of KEYS) {
    const value = draft.values[key]
    if (typeof value === 'string') sessionStorage.setItem(key, value)
    else sessionStorage.removeItem(key)
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    /* Storage may be unavailable. */
  }
}
