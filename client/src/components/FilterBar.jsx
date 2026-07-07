import React, { useMemo, useCallback, useRef } from 'react';
import Select from 'react-select';

const toOptions = (arr = []) => arr.map((v) => ({ value: String(v), label: String(v) }));

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const selectStyles = {
  classNamePrefix: 'rs',
};

export default function FilterBar({ filters, filterOptions, onFilterChange, onReset }) {
  // Count active filters
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.endYear) count++;
    const arrFields = ['topic', 'sector', 'region', 'pestle', 'source', 'swot', 'country', 'city'];
    arrFields.forEach((f) => { if (filters[f]?.length > 0) count++; });
    return count;
  }, [filters]);

  // Debounced change handler — 300ms
  const debouncedChange = useRef(debounce((field, value) => onFilterChange(field, value), 300)).current;

  const handleMultiChange = useCallback((field) => (selected) => {
    const values = selected ? selected.map((s) => s.value) : [];
    debouncedChange(field, values);
  }, [debouncedChange]);

  const handleSingleChange = useCallback((field) => (selected) => {
    debouncedChange(field, selected ? selected.value : null);
  }, [debouncedChange]);

  if (!filterOptions) {
    return (
      <div className="sidebar-inner">
        <div className="loading-container">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  const yearOptions = toOptions(filterOptions.end_years || []);
  const currentYearOption = filters.endYear ? { value: String(filters.endYear), label: String(filters.endYear) } : null;

  const multiConfig = [
    { field: 'topic',   label: 'Topic',   options: toOptions(filterOptions.topics) },
    { field: 'sector',  label: 'Sector',  options: toOptions(filterOptions.sectors) },
    { field: 'region',  label: 'Region',  options: toOptions(filterOptions.regions) },
    { field: 'pestle',  label: 'PESTLE',  options: toOptions(filterOptions.pestles) },
    { field: 'source',  label: 'Source',  options: toOptions(filterOptions.sources) },
    { field: 'country', label: 'Country', options: toOptions(filterOptions.countries) },
  ];

  return (
    <div className="sidebar-inner">
      <div className="filter-section-title">
        🔽 Filters
        {activeCount > 0 && <span className="filter-active-badge">{activeCount}</span>}
      </div>

      {activeCount > 0 && (
        <div className="active-filters-summary">
          <span>🔍</span>
          <span>{activeCount} active filter{activeCount !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* End Year */}
      <div className="filter-group">
        <label className="filter-label">End Year</label>
        <Select
          classNamePrefix="rs"
          options={yearOptions}
          value={currentYearOption}
          onChange={handleSingleChange('endYear')}
          isClearable
          placeholder="Any year..."
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </div>

      <div className="sidebar-divider" />

      {multiConfig.map(({ field, label, options }) => (
        <div className="filter-group" key={field}>
          <label className="filter-label">{label}</label>
          <Select
            classNamePrefix="rs"
            isMulti
            options={options}
            value={filters[field]?.map((v) => ({ value: v, label: v })) || []}
            onChange={handleMultiChange(field)}
            isClearable
            isSearchable
            placeholder={`All ${label.toLowerCase()}s...`}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
      ))}

      <button className="reset-btn" onClick={onReset}>
        ✕ Reset All Filters
      </button>
    </div>
  );
}
