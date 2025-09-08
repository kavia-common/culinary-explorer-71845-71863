/**
 * Recipe API service layer.
 * Uses REACT_APP_API_BASE for the backend base URL.
 *
 * Expected endpoints (GET):
 * - /categories -> string[]
 * - /cuisines -> string[]
 * - /ingredients -> string[]
 * - /recipes/search?q=&category=&cuisine=&ingredient=&maxReadyTime=&sort=&page=&pageSize= -> { items: Recipe[], total: number }
 * - /recipes/:id -> Recipe
 *
 * PUBLIC_INTERFACE
 * All functions return JSON parsed values.
 */

const BASE = process.env.REACT_APP_API_BASE || '';

async function get(url, params) {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
  const res = await fetch(`${BASE}${url}${qs}`, {
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function fetchCategories() {
  if (!BASE) return ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'Vegetarian'];
  try {
    return await get('/categories');
  } catch {
    return ['Breakfast', 'Lunch', 'Dinner', 'Dessert'];
  }
}

// PUBLIC_INTERFACE
export async function fetchCuisines() {
  if (!BASE) return ['American', 'Italian', 'Mexican', 'Indian', 'Chinese', 'French', 'Thai'];
  try {
    return await get('/cuisines');
  } catch {
    return ['American', 'Italian', 'Mexican'];
  }
}

// PUBLIC_INTERFACE
export async function fetchIngredients() {
  if (!BASE) return ['chicken', 'tomato', 'garlic', 'onion', 'rice', 'beef', 'pepper', 'cheese', 'egg'];
  try {
    return await get('/ingredients');
  } catch {
    return ['chicken', 'tomato', 'garlic', 'onion'];
  }
}

// PUBLIC_INTERFACE
export async function searchRecipes({ q, category, cuisine, ingredient, maxReadyTime, sort, page = 1, pageSize = 24 }) {
  if (!BASE) {
    // Fallback: generate mock-like results for demo
    const items = Array.from({ length: 12 }, (_, i) => {
      const id = `${page}-${i + 1}`;
      return {
        id,
        title: demoTitle(q, cuisine, ingredient, i),
        description: 'A delicious recipe that is easy to cook and perfect for any occasion.',
        imageUrl: `https://source.unsplash.com/800x600/?food,meal,${i + 3}`,
        cuisine: cuisine || ['Italian', 'Mexican', 'American'][i % 3],
        category: category || ['Dinner', 'Lunch', 'Dessert'][i % 3],
        readyInMinutes: 15 + (i % 5) * 10
      };
    });
    return { items, total: 120 };
  }
  return get('/recipes/search', {
    q, category, cuisine, ingredient, maxReadyTime, sort, page, pageSize
  });
}

// PUBLIC_INTERFACE
export async function getRecipeById(id) {
  if (!BASE) {
    // Fallback demo data
    return {
      id,
      title: `Tasty Demo Recipe #${id}`,
      description: 'A flavorful dish to satisfy your cravings.',
      summary: 'Rich, hearty, and ready in under 30 minutes.',
      imageUrl: `https://source.unsplash.com/1000x800/?food,plate,${id}`,
      cuisine: 'Italian',
      category: 'Dinner',
      readyInMinutes: 30,
      servings: 4,
      ingredients: [
        { quantity: '200', unit: 'g', name: 'pasta' },
        { quantity: '2', unit: 'cloves', name: 'garlic' },
        { quantity: '1', unit: 'cup', name: 'tomato sauce' },
        { quantity: 'to taste', unit: '', name: 'salt & pepper' }
      ],
      instructions: [
        'Boil pasta in salted water until al dente.',
        'Sauté garlic in olive oil until fragrant.',
        'Add tomato sauce and simmer for 10 minutes.',
        'Combine pasta and sauce, then serve hot.'
      ],
      nutrition: { calories: 520, protein: '18g', carbs: '72g', fat: '16g' }
    };
  }
  return get(`/recipes/${id}`);
}

function demoTitle(q, cuisine, ingredient, i) {
  const parts = [];
  if (cuisine) parts.push(cuisine);
  if (ingredient) parts.push(ingredient);
  parts.push(q || 'Chef');
  parts.push('Special');
  return parts.join(' ') + ' ' + (i + 1);
}
