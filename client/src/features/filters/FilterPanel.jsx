import React from 'react';
import Select from 'react-select';

function makeOptions(values) {
  if (!values) return [];
  return values.map((v) => ({ value: String(v), label: String(v) }));
}

export default function FilterPanel({
  isOpen,
  onClose,
  filterOptions,
  activeFilters,
  activeFilterCount,
  onFilterChange,
  onReset,
}) {
  if (!isOpen) return null;

  function handleSingleChange(field, selected) {
    onFilterChange(field, selected ? selected.value : null);
  }

  function handleMultiChange(field, selected) {
    onFilterChange(field, selected ? selected.map((s) => s.value) : []);
  }

  return (
    <>
      <div className="filter-drawer-backdrop" onClick={onClose}></div>
      <aside className="filter-drawer">
        <div className="drawer-header">
          <span className="drawer-title">
            Filters
            {activeFilterCount > 0 && (
              <span style={{ marginLeft: '8px', fontSize: '12px', color: '#4a90d9' }}>
                ({activeFilterCount} active)
              </span>
            )}
          </span>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        {!filterOptions ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {activeFilterCount > 0 && (
              <div className="active-filters-bar">
                🔍 {activeFilterCount} filter(s) applied
              </div>
            )}

            <div className="filter-group">
              <label className="filter-label">End Year</label>
              <Select
                classNamePrefix="rs"
                options={makeOptions(filterOptions.end_years)}
                value={activeFilters.endYear ? { value: String(activeFilters.endYear), label: String(activeFilters.endYear) } : null}
                onChange={(selected) => handleSingleChange('endYear', selected)}
                isClearable
                placeholder="Select year..."
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
              />
            </div>

            <hr className="divider" />

            <div className="filter-group">
              <label className="filter-label">Topic</label>
              <Select
                classNamePrefix="rs"
                isMulti
                isSearchable
                options={makeOptions(filterOptions.topics)}
                value={(activeFilters.topic || []).map((v) => ({ value: v, label: v }))}
                onChange={(selected) => handleMultiChange('topic', selected)}
                placeholder="All topics..."
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Sector</label>
              <Select
                classNamePrefix="rs"
                isMulti
                isSearchable
                options={makeOptions(filterOptions.sectors)}
                value={(activeFilters.sector || []).map((v) => ({ value: v, label: v }))}
                onChange={(selected) => handleMultiChange('sector', selected)}
                placeholder="All sectors..."
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Region</label>
              <Select
                classNamePrefix="rs"
                isMulti
                isSearchable
                options={makeOptions(filterOptions.regions)}
                value={(activeFilters.region || []).map((v) => ({ value: v, label: v }))}
                onChange={(selected) => handleMultiChange('region', selected)}
                placeholder="All regions..."
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">PESTLE</label>
              <Select
                classNamePrefix="rs"
                isMulti
                isSearchable
                options={makeOptions(filterOptions.pestles)}
                value={(activeFilters.pestle || []).map((v) => ({ value: v, label: v }))}
                onChange={(selected) => handleMultiChange('pestle', selected)}
                placeholder="All categories..."
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Source</label>
              <Select
                classNamePrefix="rs"
                isMulti
                isSearchable
                options={makeOptions(filterOptions.sources)}
                value={(activeFilters.source || []).map((v) => ({ value: v, label: v }))}
                onChange={(selected) => handleMultiChange('source', selected)}
                placeholder="All sources..."
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Country</label>
              <Select
                classNamePrefix="rs"
                isMulti
                isSearchable
                options={makeOptions(filterOptions.countries)}
                value={(activeFilters.country || []).map((v) => ({ value: v, label: v }))}
                onChange={(selected) => handleMultiChange('country', selected)}
                placeholder="All countries..."
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
              />
            </div>

            <button className="reset-btn" onClick={onReset}>
              Clear All Filters
            </button>
          </>
        )}
      </aside>
    </>
  );
}
