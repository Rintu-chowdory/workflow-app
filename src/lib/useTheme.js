import { useEffect, useState } from 'react'

/* Returns true when the app is in dark mode, live-updating as the
 * .dark class on <html> toggles (set by the Layout theme switcher). */
export function useDark() {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    )
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return dark
}

export function dueInfo(due) {
  if (!due) return null
  const d = new Date(due + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.round((d - today) / 86400000)
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return {
    overdue: diffDays < 0,
    today: diffDays === 0,
    label: diffDays === 0 ? 'Today' : label,
    diffDays,
  }
}
