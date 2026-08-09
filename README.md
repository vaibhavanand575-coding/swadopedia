# Swadopedia

An atlas of India's regional kitchens — browse states, discover dishes.

## Structure

```
swadopedia-app/
  backend/    Spring Boot 3 / Java 17 REST API (port 8081)
  frontend/   Angular 17 standalone-component app (port 4200)
```

## How to run

### Prerequisites (you already have these installed)
- Java 17+
- Maven
- Node 18+
- Angular CLI (`npm install -g @angular/cli`)

### 1. Start the backend

```bash
cd backend
mvn spring-boot:run
```

Starts on `http://localhost:8081`. Leave this terminal open.

Endpoints:
- `GET /api/states` — list all states (summary tiles)
- `GET /api/states/{id}` — full state detail with dishes

### 2. Start the frontend

In a separate terminal:

```bash
cd frontend
npm install
ng serve
```

Open `http://localhost:4200` in your browser.

## What's inside

**12 Indian states**, each with 3 signature dishes:

| State | Region | Sample dishes |
|-------|--------|---------------|
| Punjab | North | Butter chicken, Sarson da saag, Amritsari kulcha |
| Gujarat | West | Dhokla, Undhiyu, Thepla |
| West Bengal | East | Macher jhol, Shorshe ilish, Rosogolla |
| Telangana | South | Hyderabadi biryani, Mirchi ka salan, Double ka meetha |
| Kerala | South | Appam with stew, Fish moilee, Puttu and kadala |
| Rajasthan | North | Dal baati churma, Laal maas, Ghevar |
| Tamil Nadu | South | Chettinad chicken, Sambar, Filter coffee |
| Maharashtra | West | Misal pav, Puran poli, Vada pav |
| Uttar Pradesh | North | Lucknowi kebab, Kadhi chawal, Petha |
| Goa | West | Fish curry rice, Vindaloo, Bebinca |
| Bihar | East | Litti chokha, Sattu paratha, Thekua |
| Madhya Pradesh | Central | Poha, Dal bafla, Bhutte ka kees |

## App flow

1. Home page shows state tiles in a grid (name, region, tagline, dish count)
2. Click a tile to see that state's detail page
3. Detail page has a hero banner and cards for each dish (name, description, spice level)
4. Back arrow returns to the state grid

## Image sources

State landmark and dish photos are sourced from **Wikimedia Commons** (Creative Commons licensed). The URLs use the `Special:FilePath` redirect format, which is permanent and stable. If any specific image fails to load, the UI falls back to a neutral background color — you can swap the URL in `StateService.java` for a different Wikimedia Commons filename or your own hosted image.

## Other apps in this repo

- **`site-generator/`** — a separate app: search local businesses by country/city/sector, pick
  one from the top 5 matches, and run a 10-stage pipeline that researches it, pulls brand
  imagery, and generates a demo website. See `site-generator/README.md`.

## Next steps (good portfolio extensions)

- Add a search/filter bar on the home page (by region or state name)
- Add more states and dishes
- Connect to a real database (Postgres + Spring Data JPA)
- Add a "favorites" feature with user accounts
- Deploy with Docker Compose
- Add unit tests (JUnit backend, Jasmine/Karma frontend)
