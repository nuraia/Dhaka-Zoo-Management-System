import { useMemo, useState } from 'react'
import { apiRequest } from '../api/client.js'

const ticketTypes = [
  { id: 'adult', label: 'Adult', price: 100, note: 'Single adult visitor' },
  { id: 'child', label: 'Child', price: 50, note: 'Children under 12' },
  { id: 'family', label: 'Family', price: 250, note: 'Two adults and two children' },
]

function makeQrCells(code) {
  const seed = Array.from(code).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return Array.from({ length: 49 }, (_, index) => ((seed + index * 7 + index ** 2) % 5) < 2)
}

function TicketBookingForm({ onBooked }) {
  const [type, setType] = useState('adult')
  const [visitDate, setVisitDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const selectedType = ticketTypes.find((ticket) => ticket.id === type)
  const qrCells = useMemo(() => makeQrCells(success?.qrCode || 'DHAKA-ZOO'), [success])

  async function submit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const data = await apiRequest('/tickets/book', {
        method: 'POST',
        body: JSON.stringify({ type, visitDate }),
      })
      setSuccess(data.ticket)
      onBooked?.(data.ticket)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="ticket-layout">
      <form className="ticket-form" onSubmit={submit}>
        <div className="ticket-options" role="radiogroup" aria-label="Ticket type">
          {ticketTypes.map((ticket) => (
            <label key={ticket.id} className={ticket.id === type ? 'ticket-option active' : 'ticket-option'}>
              <input type="radio" name="ticketType" value={ticket.id} checked={ticket.id === type} onChange={() => setType(ticket.id)} />
              <span>{ticket.label}</span>
              <strong>BDT {ticket.price}</strong>
              <small>{ticket.note}</small>
            </label>
          ))}
        </div>

        <label className="date-field">
          Visit date
          <input type="date" value={visitDate} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setVisitDate(event.target.value)} required />
        </label>

        <div className="price-row">
          <span>Total</span>
          <strong>BDT {selectedType.price}</strong>
        </div>

        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? 'Booking...' : 'Book ticket'}
        </button>
      </form>

      <aside className="ticket-success">
        {success ? (
          <>
            <span className="eyebrow">Booking confirmed</span>
            <h3>{success.type.toLowerCase()} ticket</h3>
            <div className="qr-visual" aria-label="Ticket code visual">
              {qrCells.map((active, index) => <span key={index} className={active ? 'active' : ''} />)}
            </div>
            <p className="ticket-code">{success.qrCode}</p>
            <p>{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(success.visitDate))}</p>
          </>
        ) : (
          <>
            <span className="eyebrow">No payment needed</span>
            <h3>Your ticket code appears here</h3>
            <p>Choose a date and ticket type. The system will create a unique code for gate validation.</p>
          </>
        )}
      </aside>
    </div>
  )
}

export default TicketBookingForm
