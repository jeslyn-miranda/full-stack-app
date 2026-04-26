export function dueState(iso) {
  if (!iso) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(iso + 'T00:00:00')
  const diffDays = Math.round((due - today) / 86400000)

  if (diffDays < 0) return { tone: 'overdue', label: `${-diffDays}d overdue` }
  if (diffDays === 0) return { tone: 'soon', label: 'Due today' }
  if (diffDays === 1) return { tone: 'soon', label: 'Due tomorrow' }
  if (diffDays <= 3) return { tone: 'upcoming', label: `Due in ${diffDays}d` }
  return {
    tone: 'later',
    label: due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }
}
