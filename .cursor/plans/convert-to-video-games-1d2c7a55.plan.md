<!-- 1d2c7a55-6f46-4edf-9df5-5b4139f9905e 9474bc7a-bfa6-49f7-8c79-995ba18607d4 -->
# Convert Restaurant Reviews to Video Games Reviews

## Data Model Changes

Update the Firestore data structure from restaurants to games:

- Rename `restaurants` collection to `games`
- Replace `category` field with `genre` (e.g., Action, RPG, Strategy)
- Replace `city` field with `platform` (e.g., PC, PlayStation, Xbox, Nintendo Switch)
- Keep `price` field for price tiers (1-4 representing $ to $$$$)
- Keep `name`, `photo`, `avgRating`, `numRatings`, `sumRating`, `timestamp`

## Core Files to Update

### 1. Firestore Functions (`src/lib/firebase/firestore.js`)

- Rename all `restaurants` collection references to `games`
- Update filter parameters: `category` → `genre`, `city` → `platform`
- Rename functions: `getRestaurants` → `getGames`, `addReviewToRestaurant` → `addReviewToGame`, etc.
- Update comments and variable names

### 2. Random Data Generation (`src/lib/randomData.js`)

- Replace `restaurantNames` with ~40-50 video game titles
- Replace `restaurantCategories` with ~10-13 game genres (Action, RPG, Strategy, FPS, Sports, Racing, Puzzle, Adventure, Platformer, Fighting, Simulation, Horror, Indie)
- Replace `restaurantCities` with ~10-11 platforms (PC, PlayStation 5, Xbox Series X, Nintendo Switch, PlayStation 4, Xbox One, Steam Deck, Mobile, VR, Retro, Multi-platform)
- Update `restaurantReviews` text to be game-related (e.g., "The gameplay was exceptional", "Great graphics and controls")

### 3. Fake Data Generator (`src/lib/fakeRestaurants.js`)

- Rename file to `fakeGames.js`
- Update function name: `generateFakeRestaurantsAndReviews` → `generateFakeGamesAndReviews`
- Update to use genre/platform instead of category/city
- Update photo URLs to use game images (or placeholder game images)

### 4. Components

**Filters.jsx**

- Change "Restaurants" label to "Games"
- Update Category dropdown to Genre with game genres
- Update City dropdown to Platform with gaming platforms
- Update sort text from "Sorted by Rating" to match games context

**Header.jsx**

- Change logo from "Friendly Eats" to "GameRate"
- Update "Add sample restaurants" to "Add sample games"
- Update logo image reference

**Restaurant.jsx → Game.jsx**

- Rename component from `Restaurant` to `Game`
- Update all restaurant variable names to game
- Update imports and function calls

**RestaurantDetails.jsx → GameDetails.jsx**

- Rename component to `GameDetails`
- Update display to show genre and platform instead of category and city
- Update alt text and variable names

**RestaurantListings.jsx → GameListings.jsx**

- Rename component to `GameListings`
- Update all references and function calls

### 5. Pages

**src/app/page.js**

- Update imports to use game functions
- Rename variables from `restaurants` to `games`

**src/app/restaurant/[id]/page.jsx → src/app/game/[id]/page.jsx**

- Move entire directory from `restaurant` to `game`
- Update all imports and function calls
- Update metadata and titles

### 6. Branding & Assets

- Update site title and metadata in `src/app/layout.js`
- Consider updating or noting that logo SVG (`friendly-eats.svg`) should be replaced with game-themed logo
- Update any hardcoded text references to restaurants

## Firestore Configuration

Update Firestore rules and indexes if they reference `restaurants` collection:

- `firestore.rules` - change `/restaurants/` to `/games/`
- `firestore.indexes.json` - update collection names

## Testing Considerations

After conversion, the "Add sample games" feature should populate the database with video game data that can be filtered by genre and platform.

### To-dos

- [ ] Update randomData.js with video game data (titles, genres, platforms, reviews)
- [ ] Rename and update fakeRestaurants.js to fakeGames.js with game data structure
- [ ] Update firestore.js to use games collection and genre/platform fields
- [ ] Update storage.js to reference games instead of restaurants
- [ ] Rename Restaurant components to Game components (Restaurant.jsx, RestaurantDetails.jsx, RestaurantListings.jsx)
- [ ] Update Filters.jsx to use genre and platform instead of category and city
- [ ] Update Header.jsx with GameRate branding and game-related text
- [ ] Update page.js and move restaurant/[id] to game/[id] with all necessary updates
- [ ] Update layout.js with new site title and metadata
- [ ] Update firestore.rules and firestore.indexes.json to use games collection