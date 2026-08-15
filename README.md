# MovieRecs — Futuristic Cinematic Streaming & Recommendation Platform

MovieRecs is an ultra-modern, futuristic web application built for discovering, exploring, and streaming popular movies and TV series. Featuring a dark glassmorphic UI, multi-server streaming integrations, TV show episode pickers, and interactive genre filtering.

---

##  Features

-  **Futuristic Dark Glassmorphic UI**: Ultra-modern midnight theme (`#08090d`) with translucent glass panels (`backdrop-blur-xl`), glow effects, and custom sleek scrollbars.
-  **Movies & TV Series Expansion**: Complete support for both Movies and TV Shows (Series), including multi-season episode selectors, season episode grids, and genre pills.
-  **Embedded Video Streaming Players**: Stream movies and TV episodes directly using multiple integrated embed servers (**VidSrc** (default), **VidAPI**, **VAPlayer**, **AutoEmbed**, and **2Embed**) with seamless server switching and IMDb/TMDB ID support.
-  **Auto-Switching Hero Banner**: Highlighting top trending releases with dynamic backdrop overlays, auto-sliding carousel controls, and quick action buttons.
-  **Quick View & Details Modal**: Instant preview of media posters, ratings, synopsis, and episode selection before streaming.
-  **Real-Time Multi-Search**: Search across movies, TV series, and actors with live results and pagination.
-  **User Favorites & Auth**: Save favorite movies and series to your account with Firebase Authentication and Supabase persistence.
-  **Fully Responsive**: Mobile-first layout with custom mobile navigation bar and smooth touch scroll carousels.

---

##  Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Vanilla CSS3 + Tailwind CSS v4, Glassmorphism, Custom Animations
- **State & Data Fetching**: TanStack Query (React Query)
- **API Data Provider**: The Movie Database (TMDB) API
- **Streaming Players**: VidSrc, VidAPI (`https://vidapi.ru/api`), VAPlayer, AutoEmbed, 2Embed
- **Authentication**: Firebase Authentication (Google & Email)
- **Database**: Supabase / Firestore
- **Testing**: Jest & React Testing Library

---

##  Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
# TMDB API Key (https://www.themoviedb.org/)
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key

# VidAPI Embed Base URL
NEXT_PUBLIC_VIDAPI_EMBED_URL=https://vidapi.ru/embed

# Firebase Authentication Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Supabase Storage & DB
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

##  Getting Started

### Prerequisites

- **Node.js**: v20 or later
- **npm** (or yarn/pnpm)

### Installation

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   Copy `.env.example` to `.env.local` and add your TMDB API key and player URLs as shown above.

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) (or default port) in your browser.

4. **Run Unit Tests**:
   ```bash
   npm test
   ```

---

##  UI Architecture

```
+---------------------------------------------------------------------------------+
| [Logo: MovieRecs]  [ Home | Movies | Series | Kids ]   [ Search... ] [ User ]   | <- Glass Nav
+---------------------------------------------------------------------------------+
|                                                                                 |
|  +---------------------------------------------------------------------------+  |
|  |  [ HERO BACKDROP IMAGE ]                                                  |  | <- Auto Hero
|  |  Movie/Show Title (Year) ★ 8.5 [Series]                                   |  |    Banner
|  |  [ Watch Now ]   [ Details ]                                              |  |
|  +---------------------------------------------------------------------------+  |
|                                                                                 |
|   Trending Now       [ Movie 1 ]  [ Movie 2 ]  [ Show 1 ]  [ Show 2 ]         | <- Carousel
|   Trending Shows     [ Series 1 ] [ Series 2 ] [ Series 3 ]                | <- Carousel
|   Trending Movies    [ Movie A ]  [ Movie B ]  [ Movie C ]                 | <- Carousel
|                                                                                 |
|   Explore Catalog                                                              |
|  [ All Popular ] [ Action ] [ Sci-Fi ] [ Horror ] [ Comedy ] [ Kids ]            | <- Genre Pills
|                                                                                 |
|  +--------------+  +--------------+  +--------------+  +--------------+          |
|  | [Poster]     |  | [Poster]     |  | [Poster]     |  | [Poster]     |          | <- Media
|  | Title & Year |  | Title & Year |  | Title & Year |  | Title & Year |          |    Grid
|  +--------------+  +--------------+  +--------------+  +--------------+          |
|                                                                                 |
|                      < Previous      [1] 2 3 ... 10     Next >                  | <- Pagination
+---------------------------------------------------------------------------------+
```
