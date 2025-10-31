import React from 'react';

function FilterDropdown({ 
  subjects, 
  filterSubject, 
  setFilterSubject, 
  totalBooks, 
  filteredCount,
  onReset 
}) {
  return (
    <section className="filter-section">
      <div className="filter-container">
        <label htmlFor="subject-filter" className="filter-label">
          📂 Filter by Category:
        </label>
        
        <select
          id="subject-filter"
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories ({totalBooks} books)</option>
          {subjects.map((subj) => (
            <option key={subj.name} value={subj.name}>
              {subj.name} ({subj.count})
            </option>
          ))}
        </select>

        {filterSubject && (
          <button 
            onClick={onReset}
            className="filter-reset-btn"
            title="Clear filter"
          >
            ✕ Clear Filter
          </button>
        )}
      </div>

      {filterSubject && (
        <div className="filter-info">
          <span className="filter-badge">
            Active Filter: <strong>{filterSubject}</strong>
          </span>
          <span className="filter-count">
            Showing {filteredCount} of {totalBooks} books
          </span>
        </div>
      )}
    </section>
  );
}

export default FilterDropdown;