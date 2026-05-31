const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Bengal_tiger_in_Sanjay_Dubri_Tiger_Reserve_December_2024_by_Tisha_Mukherjee_11.jpg/960px-Bengal_tiger_in_Sanjay_Dubri_Tiger_Reserve_December_2024_by_Tisha_Mukherjee_11.jpg'

function formatLabel(value) {
  return String(value || '').toLowerCase().replaceAll('_', ' ')
}

function AnimalCard({ animal, onSelect }) {
  return (
    <article className="animal-card">
      <button className="animal-image-button" type="button" onClick={() => onSelect?.(animal)}>
        <img
          src={animal.imageUrl || fallbackImage}
          alt={animal.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = fallbackImage
          }}
        />
      </button>
      <div className="animal-card-body">
        <div className="animal-title-row">
          <div>
            <h3>{animal.name}</h3>
            <p>{animal.species?.name || 'Unknown species'}</p>
          </div>
          <span className={`status-pill ${formatLabel(animal.healthStatus).replaceAll(' ', '-')}`}>
            {formatLabel(animal.healthStatus)}
          </span>
        </div>
        <dl className="animal-facts">
          <div>
            <dt>Zone</dt>
            <dd>{animal.zone?.name || 'Unassigned'}</dd>
          </div>
          <div>
            <dt>Diet</dt>
            <dd>{formatLabel(animal.species?.dietType)}</dd>
          </div>
        </dl>
        <button className="text-button" type="button" onClick={() => onSelect?.(animal)}>
          View details
        </button>
      </div>
    </article>
  )
}

export default AnimalCard
