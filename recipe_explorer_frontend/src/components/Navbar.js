import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Navbar component with search input and field selector.
 */
export default function Navbar({ initialQuery = '', onSearch }) {
  const [text, setText] = useState(initialQuery);
  const [field, setField] = useState('keyword');

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(text.trim(), field);
  };

  return (
    <form className="searchbar" role="search" onSubmit={submit}>
      <span role="img" aria-label="search">🔎</span>
      <input
        aria-label="Search"
        placeholder="Search recipes by keyword, ingredient, or cuisine..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select aria-label="Search type" value={field} onChange={(e) => setField(e.target.value)}>
        <option value="keyword">Keyword</option>
        <option value="ingredient">Ingredient</option>
        <option value="cuisine">Cuisine</option>
      </select>
      <button className="btn" type="submit">Search</button>
    </form>
  );
}
