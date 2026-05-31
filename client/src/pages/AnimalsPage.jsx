import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../api/client.js'
import AnimalCard from '../components/AnimalCard.jsx'
import AnimalDetail from '../components/AnimalDetail.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/States.jsx'
import { fallbackAnimals } from '../data/fallback.js'

function normalize(value) {
  return String(value || '').toLowerCase()
}

function AnimalsPage() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    zone: '',
    diet: '',
    health: '',
  })

  useEffect(() => {
    let active = true

    async function loadAnimals() {
      try {
        const data = await apiRequest('/animals')
        if (active) setAnimals(data.animals)
      } catch (err) {
        if (active) {
          setAnimals(fallbackAnimals)
          setError(`${err.message}. Showing demo animal cards until the API is running.`)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAnimals()
    return () => {
      active = false
    }
  }, [])

  const options = useMemo(() => {
    const zones = [...new Set(animals.map((animal) => animal.zone?.name).filter(Boolean))].sort()
    const diets = [...new Set(animals.map((animal) => animal.species?.dietType).filter(Boolean))].sort()
    const statuses = [...new Set(animals.map((animal) => animal.healthStatus).filter(Boolean))].sort()
    return { zones, diets, statuses }
  }, [animals])

  const filteredAnimals = useMemo(() => animals.filter((animal) => {
    const text = `${animal.name} ${animal.species?.name}`.toLowerCase()
    const matchesSearch = !filters.search || text.includes(filters.search.toLowerCase())
    const matchesZone = !filters.zone || animal.zone?.name === filters.zone
    const matchesDiet = !filters.diet || animal.species?.dietType === filters.diet
    const matchesHealth = !filters.health || animal.healthStatus === filters.health
    return matchesSearch && matchesZone && matchesDiet && matchesHealth
  }), [animals, filters])

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  return (
    <main className="page-shell">
      <section className="page-heading">
        <span className="eyebrow">Animal directory</span>
        <h1>Explore zoo residents</h1>
        <p>Search by animal or species, then filter by zone, diet, and health status.</p>
      </section>

      <section className="filter-bar" aria-label="Animal filters">
        <label>
          Search
          <input name="search" value={filters.search} onChange={updateFilter} placeholder="Tiger, elephant, bird..." />
        </label>
        <label>
          Zone
          <select name="zone" value={filters.zone} onChange={updateFilter}>
            <option value="">All zones</option>
            {options.zones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
          </select>
        </label>
        <label>
          Diet
          <select name="diet" value={filters.diet} onChange={updateFilter}>
            <option value="">All diets</option>
            {options.diets.map((diet) => <option key={diet} value={diet}>{normalize(diet)}</option>)}
          </select>
        </label>
        <label>
          Health
          <select name="health" value={filters.health} onChange={updateFilter}>
            <option value="">All statuses</option>
            {options.statuses.map((status) => <option key={status} value={status}>{normalize(status).replaceAll('_', ' ')}</option>)}
          </select>
        </label>
      </section>

      {loading && <LoadingState label="Loading animals..." />}
      {error && <ErrorState message={error} />}
      {!loading && !error && filteredAnimals.length === 0 && <EmptyState message="No animals match these filters." />}
      {!loading && filteredAnimals.length > 0 && (
        <section className="animal-grid">
          {filteredAnimals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} onSelect={setSelectedAnimal} />
          ))}
        </section>
      )}

      <AnimalDetail animal={selectedAnimal} onClose={() => setSelectedAnimal(null)} />
    </main>
  )
}

export default AnimalsPage
