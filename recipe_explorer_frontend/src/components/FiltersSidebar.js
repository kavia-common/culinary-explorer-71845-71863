/**
 * Sidebar filters for cuisine, ingredient, max ready time and sort.
 */
import React, { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export default function FiltersSidebar({
  cuisines = [],
  ingredients = [],
  values = { cuisine: '', ingredient: '', maxReadyTime: '', sort: 'relevance' },
  onApply,
  onReset
}) {
  const [cuisine, setCuisine] = useState(values.cuisine || '');
  const [ingredient, setIngredient] = useState(values.ingredient || '');
  const [maxReadyTime, setMaxReadyTime] = useState(values.maxReadyTime || '');
  const [sort, setSort] = useState(values.sort || 'relevance');

  useEffect(() => {
    setCuisine(values.cuisine || '');
    setIngredient(values.ingredient || '');
    setMaxReadyTime(values.maxReadyTime || '');
    setSort(values.sort || 'relevance');
  }, [values.cuisine, values.ingredient, values.maxReadyTime, values.sort]);

  const apply = () => {
    onApply?.({ cuisine, ingredient, maxReadyTime, sort });
  };

  return (
    <div>
      <div className="filter-group">
        <label>Cuisine</label>
        <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
          <option value="">Any</option>
          {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="filter-group">
        <label>Ingredient</label>
        <input
          list="ingredient-list"
          placeholder="e.g., chicken"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
        />
        <datalist id="ingredient-list">
          {ingredients.map(i => <option key={i} value={i} />)}
        </datalist>
      </div>
      <div className="filter-group">
        <label>Max Ready Time (minutes)</label>
        <input
          type="number"
          min="0"
          placeholder="e.g., 30"
          value={maxReadyTime}
          onChange={(e) => setMaxReadyTime(e.target.value)}
        />
      </div>
      <div className="filter-group">
        <label>Sort by</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="relevance">Relevance</option>
          <option value="time_asc">Time: Low to High</option>
          <option value="time_desc">Time: High to Low</option>
          <option value="rating_desc">Rating: High to Low</option>
        </select>
      </div>
      <div className="filter-actions">
        <button className="btn-outline" type="button" onClick={onReset}>Reset</button>
        <button className="btn-primary" type="button" onClick={apply}>Apply</button>
      </div>
    </div>
  );
}
