const UNLOCKED_KEY = 'iu-order-tracker:unlocked'
const NAME_KEY = 'iu-order-tracker:display-name'

export function isUnlocked(): boolean {
  return localStorage.getItem(UNLOCKED_KEY) === 'true'
}

export function setUnlocked(): void {
  localStorage.setItem(UNLOCKED_KEY, 'true')
}

export function getDisplayName(): string | null {
  return localStorage.getItem(NAME_KEY)
}

export function setDisplayName(name: string): void {
  localStorage.setItem(NAME_KEY, name)
}
