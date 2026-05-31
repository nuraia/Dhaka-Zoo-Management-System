import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client.js'
import TicketBookingForm from '../components/TicketBookingForm.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/States.jsx'

function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadTickets() {
      try {
        const data = await apiRequest('/tickets/my')
        if (active) setTickets(data.tickets)
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadTickets()
    return () => {
      active = false
    }
  }, [])

  function addTicket(ticket) {
    setTickets((current) => [ticket, ...current])
  }

  return (
    <main className="page-shell">
      <section className="page-heading">
        <span className="eyebrow">Ticket booking</span>
        <h1>Book your zoo visit</h1>
        <p>Select a date and ticket type. The demo flow generates a unique ticket code without payment integration.</p>
      </section>

      <TicketBookingForm onBooked={addTicket} />

      <section className="section-shell no-side-padding">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Your tickets</span>
            <h2>Booking history</h2>
          </div>
        </div>
        {loading && <LoadingState label="Loading your tickets..." />}
        {error && <ErrorState message={error} />}
        {!loading && !error && tickets.length === 0 && <EmptyState message="No tickets booked yet." />}
        {!loading && !error && tickets.length > 0 && (
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <article className="ticket-row" key={ticket.id}>
                <div>
                  <strong>{ticket.type.toLowerCase()} ticket</strong>
                  <span>{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(ticket.visitDate))}</span>
                </div>
                <code>{ticket.qrCode}</code>
                <span className="status-pill">{ticket.status.toLowerCase()}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default TicketsPage
