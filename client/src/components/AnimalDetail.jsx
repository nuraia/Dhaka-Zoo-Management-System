function formatDate(value) {
  if (!value) return 'Not recorded'
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value))
}

function formatLabel(value) {
  return String(value || '').toLowerCase().replaceAll('_', ' ')
}

function AnimalDetail({ animal, onClose }) {
  if (!animal) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="detail-panel" role="dialog" aria-modal="true" aria-label={`${animal.name} details`} onClick={(event) => event.stopPropagation()}>
        <button className="close-button" type="button" onClick={onClose} aria-label="Close animal details">×</button>
        <img
          src={animal.imageUrl}
          alt={animal.name}
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
        <div className="detail-content">
          <span className="eyebrow">{animal.zone?.name}</span>
          <h2>{animal.name}</h2>
          <p className="lead">{animal.species?.description}</p>
          <dl className="detail-grid">
            <div><dt>Species</dt><dd>{animal.species?.name}</dd></div>
            <div><dt>Habitat</dt><dd>{animal.species?.habitat}</dd></div>
            <div><dt>Diet</dt><dd>{formatLabel(animal.species?.dietType)}</dd></div>
            <div><dt>Date of birth</dt><dd>{formatDate(animal.dob)}</dd></div>
            <div><dt>Health</dt><dd>{formatLabel(animal.healthStatus)}</dd></div>
            <div><dt>Last fed</dt><dd>{formatDate(animal.lastFedAt)}</dd></div>
          </dl>
          <div className="feeding-list">
            <h3>Feeding schedule</h3>
            {animal.feedingSchedules?.length ? (
              animal.feedingSchedules.map((schedule) => (
                <p key={schedule.id || `${schedule.time}-${schedule.foodItem?.name}`}>
                  <strong>{schedule.time}</strong> {schedule.foodItem?.name} · {schedule.quantity} · {schedule.frequency}
                </p>
              ))
            ) : (
              <p>No feeding schedule available yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AnimalDetail
