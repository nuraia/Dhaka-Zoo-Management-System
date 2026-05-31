import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../api/client.js'
import AnimalCard from '../components/AnimalCard.jsx'
import { ErrorState, LoadingState } from '../components/States.jsx'
import { fallbackAnimals, fallbackZones } from '../data/fallback.js'

const heroImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Elephas_maximus_%28Bandipur%29.jpg/960px-Elephas_maximus_%28Bandipur%29.jpg'

function HomePage() {
  const [animals, setAnimals] = useState(fallbackAnimals)
  const [zones, setZones] = useState(fallbackZones)
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true

    async function loadHomeData() {
      try {
        const [animalData, zoneData, feedingData] = await Promise.all([
          apiRequest('/animals'),
          apiRequest('/zones'),
          apiRequest('/feeding'),
        ])

        if (!active) return
        setAnimals(animalData.animals.slice(0, 6))
        setZones(zoneData.zones.slice(0, 4))
        setSchedule(feedingData.schedule.slice(0, 4))
      } catch {
        if (active) {
          setNotice('Showing demo highlights until the API is running.')
          setSchedule(fallbackAnimals.flatMap((animal) => animal.feedingSchedules.map((item) => ({ ...item, animal }))).slice(0, 3))
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadHomeData()
    return () => {
      active = false
    }
  }, [])

  return (
    <main>
      <section className="home-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(10, 70, 67, 0.88), rgba(10, 70, 67, 0.34)), url(${heroImage})` }}>
        <div className="hero-content">
          <span className="eyebrow">Mirpur family day out</span>
          <h1>Dhaka Zoo Management System</h1>
          <p>
            Explore animals, plan a thoughtful visit, and book simple demo tickets through a database-backed zoo experience built for learning.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/animals">Explore Animals</Link>
            <Link className="secondary-button" to="/tickets">Book Tickets</Link>
          </div>
        </div>
      </section>

      <section className="section-shell intro-strip">
        <div>
          <span className="eyebrow">Visitor ready</span>
          <h2>Useful for families, clear for DBMS review</h2>
        </div>
        <p>
          The site joins animals with species, zones, food items, feeding schedules, and ticket history so every page demonstrates real relational design.
        </p>
      </section>

      {notice && <section className="section-shell compact"><ErrorState message={notice} /></section>}

      <section className="section-shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Featured animals</span>
            <h2>Meet a few residents</h2>
          </div>
          <Link className="text-button" to="/animals">See all animals</Link>
        </div>
        {loading ? <LoadingState label="Loading animal highlights..." /> : (
          <div className="animal-grid featured-grid">
            {animals.slice(0, 3).map((animal) => <AnimalCard key={animal.id} animal={animal} />)}
          </div>
        )}
      </section>

      <section className="section-band">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Zoo zones</span>
              <h2>Plan your route by habitat</h2>
            </div>
          </div>
          <div className="zone-grid">
            {zones.map((zone) => (
              <article className="zone-card" key={zone.id}>
                <h3>{zone.name}</h3>
                <p>{zone.description}</p>
                <div className="zone-meta">
                  <span>{zone._count?.animals || 0} animals</span>
                  <span>Capacity {zone.capacity}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell info-grid">
        <div className="feeding-teaser">
          <span className="eyebrow">Today around the zoo</span>
          <h2>Feeding schedule teaser</h2>
          <div className="schedule-list">
            {schedule.map((item, index) => (
              <p key={`${item.id || index}-${item.time}`}>
                <strong>{item.time}</strong>
                <span>{item.animal?.name || item.animal?.animal?.name} gets {item.foodItem?.name || item.foodItem || 'a planned meal'}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="visitor-info">
          <span className="eyebrow">Visitor info</span>
          <h2>Before you arrive</h2>
          <ul>
            <li>Best family route: Tiger Trail, Savanna Walk, then Aviary Garden.</li>
            <li>Bring water and use shaded breaks near Elephant Meadow.</li>
            <li>Book a demo ticket online and keep the ticket code ready at entry.</li>
            <li>School groups can use animal details for species, diet, and habitat lessons.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default HomePage
