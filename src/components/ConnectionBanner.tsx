export function ConnectionBanner({ connected }: { connected: boolean }) {
  if (connected) return null
  return (
    <div
      role="alert"
      className="sticky top-0 z-50 bg-red-600 text-white text-sm font-medium px-4 py-2 text-center"
    >
      Not connected — changes aren't saving. Reconnecting…
    </div>
  )
}
