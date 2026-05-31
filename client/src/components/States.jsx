export function LoadingState({ label = 'Loading...' }) {
  return <div className="state-card">{label}</div>
}

export function ErrorState({ message = 'Something went wrong.' }) {
  return <div className="state-card error-state">{message}</div>
}

export function EmptyState({ message = 'No records found.' }) {
  return <div className="state-card empty-state">{message}</div>
}
