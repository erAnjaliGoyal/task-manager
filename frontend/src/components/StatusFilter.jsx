const FILTERS = [
  { label: 'All', value: null },
  { label: 'Pending', value: false },
  { label: 'Completed', value: true },
]

function StatusFilter({ filter, onChange }) {
  return (
    <div className="status-filter">
      {FILTERS.map((item) => (
        <button
          className={filter === item.value ? 'active' : ''}
          key={item.label}
          onClick={() => onChange(item.value)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default StatusFilter
