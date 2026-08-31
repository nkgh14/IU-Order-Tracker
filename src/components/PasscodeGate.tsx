import { useState, type FormEvent } from 'react'
import { setUnlocked } from '../lib/storage'

const PASSCODE = import.meta.env.VITE_APP_PASSCODE

export function PasscodeGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (value === PASSCODE) {
      setUnlocked()
      onUnlock()
    } else {
      setWrong(true)
    }
  }

  return (
    <div className="min-h-svh bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs border border-neutral-800 bg-neutral-900 p-6 rounded-lg"
      >
        <h1 className="text-lg font-semibold text-neutral-100 mb-1">IU Order Tracker</h1>
        <p className="text-sm text-neutral-500 mb-4">Enter the shared passcode to continue.</p>
        <label htmlFor="passcode" className="sr-only">
          Passcode
        </label>
        <input
          id="passcode"
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setWrong(false)
          }}
          className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 placeholder:text-neutral-600"
          placeholder="Passcode"
        />
        {wrong && <p className="mt-2 text-sm text-red-400">That's not it. Try again.</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-sky-400 px-3 py-2.5 text-base font-medium text-neutral-950 hover:bg-sky-300 active:bg-sky-500"
        >
          Unlock
        </button>
      </form>
    </div>
  )
}
