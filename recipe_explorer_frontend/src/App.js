import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import './App.css';
import './index.css';
import {
  fetchCategories,
  fetchCuisines,
  fetchIngredients,
  searchRecipes,
  getRecipeById
} from './services/api';
import Navbar from './components/Navbar';
import FiltersSidebar from './components/FiltersSidebar';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import Footer from './components/Footer';

// PUBLIC_INTERFACE
function AppShell() {
  /** Main page state: categories, search, filters, pagination, result data. */
  const [categories, setCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  // Derived query/filter values from URL params for shareable state.
  const query = params.get('q') || '';
  const category = params.get('category') || 'All';
  const cuisine = params.get('cuisine') || '';
  const ingredient = params.get('ingredient') || '';
  const maxReadyTime = params.get('maxReadyTime') || '';
  const sort = params.get('sort') || 'relevance';
  const page = parseInt(params.get('page') || '1', 10);

  // Load filter lists on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [cats, cuis, ings] = await Promise.all([
          fetchCategories(),
          fetchCuisines(),
          fetchIngredients()
        ]);
        if (!mounted) return;
        setCategories(['All', ...cats]);
        setCuisines(cuis);
        setIngredients(ings.slice(0, 200)); // cap to avoid huge lists
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Fetch recipes when search or filters change
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await searchRecipes({
          q: query,
          category: category === 'All' ? '' : category,
          cuisine,
          ingredient,
          maxReadyTime,
          sort,
          page,
          pageSize: 24
        });
        if (!mounted) return;
        setRecipes(res.items || []);
        setTotal(res.total || 0);
      } catch (e) {
        if (!mounted) return;
        console.error(e);
        setError('Failed to load recipes. Please try again.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [query, category, cuisine, ingredient, maxReadyTime, sort, page]);

  // Handle search submit from navbar
  const onSearch = (text, field) => {
    const p = new URLSearchParams(params);
    p.set('q', text || '');
    p.set('page', '1');
    p.set('sort', 'relevance');
    if (field && field !== 'keyword') p.set('field', field); else p.delete('field');
    setParams(p, { replace: true });
  };

  // Handle category change from navbar
  const onSelectCategory = (cat) => {
    const p = new URLSearchParams(params);
    p.set('category', cat);
    p.set('page', '1');
    setParams(p, { replace: true });
  };

  // Handle filters change from sidebar
  const onApplyFilters = (f) => {
    const p = new URLSearchParams(params);
    if (f.cuisine) p.set('cuisine', f.cuisine); else p.delete('cuisine');
    if (f.ingredient) p.set('ingredient', f.ingredient); else p.delete('ingredient');
    if (f.maxReadyTime) p.set('maxReadyTime', String(f.maxReadyTime)); else p.delete('maxReadyTime');
    if (f.sort) p.set('sort', f.sort); else p.delete('sort');
    p.set('page', '1');
    setParams(p, { replace: true });
  };

  const onResetFilters = () => {
    const p = new URLSearchParams(params);
    ['cuisine','ingredient','maxReadyTime','sort','page'].forEach(k => p.delete(k));
    p.set('page', '1');
    setParams(p, { replace: true });
  };

  // Modal handling
  const openRecipe = async (id) => {
    setSelectedRecipeId(id);
    setModalOpen(true);
    try {
      const data = await getRecipeById(id);
      setSelectedRecipe(data);
    } catch (e) {
      console.error(e);
    }
  };
  const closeRecipe = () => {
    setModalOpen(false);
    setSelectedRecipe(null);
    setSelectedRecipeId(null);
  };

  const resultCountText = useMemo(() => {
    if (loading) return 'Loading...';
    return `${total} results`;
  }, [loading, total]);

  return (
    <div className="app-shell">
      <div className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <div className="logo">🍽</div>
            Recipe Explorer
          </div>
          <div className="category-scroll" aria-label="Recipe categories">
            {categories.map((c) => (
              <button
                key={c}
                className={`chip ${c === category ? 'active' : ''}`}
                onClick={() => onSelectCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <Navbar
            initialQuery={query}
            onSearch={onSearch}
          />
        </div>
      </div>

      <main className="content">
        <aside className="sidebar" aria-label="Filters">
          <h4>Filters</h4>
          <FiltersSidebar
            cuisines={cuisines}
            ingredients={ingredients}
            values={{ cuisine, ingredient, maxReadyTime, sort }}
            onApply={onApplyFilters}
            onReset={onResetFilters}
          />
        </aside>

        <section>
          <div className="toolbar">
            <div className="result-count">{resultCountText}</div>
          </div>
          <div className="grid" role="list">
            {error && <div role="alert">{error}</div>}
            {!loading && recipes.length === 0 && !error && (
              <div>No recipes found. Try different keywords or filters.</div>
            )}
            {recipes.map(r => (
              <div role="listitem" key={r.id}>
                <RecipeCard
                  recipe={r}
                  onOpen={() => openRecipe(r.id)}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {modalOpen && (
        <RecipeModal
          recipe={selectedRecipe}
          loading={!selectedRecipe && !!selectedRecipeId}
          onClose={closeRecipe}
        />
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /**
   * App entry with BrowserRouter.
   */
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  );
}
