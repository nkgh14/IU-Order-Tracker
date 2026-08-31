import { useState, type FormEvent } from 'react'
import { setDisplayName } from '../lib/storage'

export function NamePrompt({ onSet }: { onSet: (name: string) => void }) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    setDisplayName(trimmed)
    onSet(trimmed)
  }

  return (
    <div className="min-h-svh bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs border border-neutral-800 bg-neutral-900 p-6 rounded-lg"
      >
        <h1 className="text-lg font-semibold text-neutral-100 mb-1">Who's this?</h1>
        <p className="text-sm text-neutral-500 mb-4">
          Your name is stamped on orders when you make changes.
        </p>
        <label htmlFor="display-name" className="sr-only">
          Your name
        </label>
        <input
          id="display-name"
          type="text"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 placeholder:text-neutral-600"
          placeholder="e.g. Nik"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="mt-4 w-full rounded-md bg-sky-400 px-3 py-2.5 text-base font-medium text-neutral-950 hover:bg-sky-300 active:bg-sky-500 disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue
        </button>
      </form>
    </div>
  )
}
