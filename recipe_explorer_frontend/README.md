# Recipe Explorer Frontend

A modern, clean React application for exploring, searching, and viewing food recipes. It supports browsing by category, searching by keyword/ingredient/cuisine, filtering, and viewing detailed instructions. Responsive design with a light theme and the following palette:
- Primary: #27ae60
- Accent:  #e67e22
- Secondary: #2d3436

## Features
- Browse recipes by category (top chips)
- Search by keyword, ingredient, or cuisine
- Filter by cuisine, ingredient, time, sort
- View detailed recipe modal with ingredients, instructions, and nutrition
- Responsive grid and layout
- REST API integration with environment-configurable base URL

## Getting Started
- Install: `npm install`
- Run dev: `npm start`
- Build: `npm run build`

## Environment
Create `.env` in this folder (do not commit secrets). Example:

```
REACT_APP_API_BASE=https://your-recipes-api.example.com
```

When `REACT_APP_API_BASE` is not provided, the app uses demo data so you can preview UI without a backend.

## Expected API
- GET /categories -> string[]
- GET /cuisines -> string[]
- GET /ingredients -> string[]
- GET /recipes/search?q=&category=&cuisine=&ingredient=&maxReadyTime=&sort=&page=&pageSize= -> `{ items: Recipe[], total: number }`
- GET /recipes/:id -> `Recipe`

Recipe type (example):
```
{
  "id": "abc123",
  "title": "Pasta Pomodoro",
  "description": "A classic Italian favorite",
  "summary": "Quick and delightful",
  "imageUrl": "https://...",
  "cuisine": "Italian",
  "category": "Dinner",
  "readyInMinutes": 25,
  "servings": 4,
  "ingredients": [{"quantity":"200","unit":"g","name":"pasta"}],
  "instructions": ["Step 1...", "Step 2..."],
  "nutrition": {"calories":520,"protein":"18g","carbs":"72g","fat":"16g"}
}
```

## Layout
- Navigation bar with brand, categories, and search
- Sidebar filters
- Recipe grid/list
- Modal recipe details
- Footer with credits

## Accessibility
- Semantic roles and labels on search, lists, and modal
- Keyboard and screen reader friendly

## License
MIT
