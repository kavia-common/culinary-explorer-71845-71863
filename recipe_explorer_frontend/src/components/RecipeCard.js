import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Displays a recipe in the grid with image, title, badges and actions.
 */
export default function RecipeCard({ recipe, onOpen }) {
  const {
    id,
    title,
    description,
    imageUrl,
    cuisine,
    category,
    readyInMinutes
  } = recipe;

  return (
    <article className="card">
      <div
        className="thumb"
        style={{ backgroundImage: `url(${imageUrl || placeholderFor(title)})` }}
        aria-label={`${title} image`}
      />
      <div className="meta">
        <div className="badges">
          {category ? <span className="badge">{category}</span> : null}
          {cuisine ? <span className="badge">{cuisine}</span> : null}
          {Number.isFinite(readyInMinutes) ? <span className="badge">{readyInMinutes} min</span> : null}
        </div>
        <h3 className="title">{title}</h3>
        {description ? <p className="desc">{description}</p> : null}
      </div>
      <div className="button-row">
        <button className="btn" onClick={onOpen}>View Details</button>
      </div>
    </article>
  );
}

function placeholderFor(text) {
  const encoded = encodeURIComponent(text || 'Recipe');
  return `https://source.unsplash.com/800x600/?food,${encoded}`;
}
