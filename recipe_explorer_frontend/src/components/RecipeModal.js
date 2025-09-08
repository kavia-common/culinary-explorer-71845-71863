import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Modal to show full recipe details and instructions.
 */
export default function RecipeModal({ recipe, loading, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close">✕</button>
        <div
          className="media"
          style={{ backgroundImage: `url(${(recipe && (recipe.imageUrl || '')) || ''})` }}
        />
        <div className="body">
          {loading && <div>Loading...</div>}
          {!loading && recipe && (
            <>
              <h2>{recipe.title}</h2>
              <p className="sub">{recipe.summary || recipe.description}</p>
              <div className="tags">
                {recipe.category ? <span className="tag">{recipe.category}</span> : null}
                {recipe.cuisine ? <span className="tag">{recipe.cuisine}</span> : null}
                {Number.isFinite(recipe.readyInMinutes) ? <span className="tag">{recipe.readyInMinutes} min</span> : null}
                {Number.isFinite(recipe.servings) ? <span className="tag">{recipe.servings} servings</span> : null}
              </div>
              <div className="section">
                <h4>Ingredients</h4>
                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                  <ul>
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx}>{formatIngredient(ing)}</li>
                    ))}
                  </ul>
                ) : <p>No ingredients listed.</p>}
              </div>
              <div className="section">
                <h4>Instructions</h4>
                {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
                  <ol>
                    {recipe.instructions.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                ) : recipe.instructionsText ? (
                  <p>{recipe.instructionsText}</p>
                ) : <p>No instructions provided.</p>}
              </div>
              {recipe.nutrition && (
                <div className="section">
                  <h4>Nutrition</h4>
                  <p>{formatNutrition(recipe.nutrition)}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function formatIngredient(ing) {
  if (typeof ing === 'string') return ing;
  const { quantity, unit, name } = ing || {};
  return [quantity, unit, name].filter(Boolean).join(' ');
}
function formatNutrition(n) {
  if (typeof n === 'string') return n;
  const parts = [];
  if (n?.calories) parts.push(`${n.calories} kcal`);
  if (n?.protein) parts.push(`${n.protein} protein`);
  if (n?.carbs) parts.push(`${n.carbs} carbs`);
  if (n?.fat) parts.push(`${n.fat} fat`);
  return parts.join(' • ');
}
