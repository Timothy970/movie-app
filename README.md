# A Movie Recommendation App


MovieRecs is a sleek and modern web application built to help users discover popular and trending movies. Users can search for specific titles, view detailed information including cast and ratings, and manage their session with a simple authentication system.


## ✨ Features


  Browse Popular Movies: View a paginated list of the most popular movies from The Movie Database (TMDB).
  Detailed Movie View: Click on any movie to see detailed information, including its poster, overview, rating, cast, and crew.
  Real-time Search: Instantly search for movies by title or keyword.
  User Authentication: Simple and secure login
  Responsive Design: A fully responsive and mobile-first user interface.
  Loading & Error States: Smooth user experience with skeleton loaders while fetching data.
  Efficient Caching: API requests are cached to reduce loading times and minimize network requests.


## 🛠️ Tech Stack
Next.js
TypeScript
Tailwind CSS
TanStack Query (React Query)
NextAuth.js




# DESIGNS
### Screen 1: Home Page (Movie Listing)


This is the main screen users will see after logging in. It displays a list of popular or recommended movies and provides the main navigation and search tools.


#### Visual Layout


+--------------------------------------------------------------------------+
| [Logo: MovieRecs]      [ Search for a movie...          ]  [User Avatar] |  <- Header
+--------------------------------------------------------------------------+
|                                                                          |
|  <H1>Popular Movies</H1>                                                   |
|                                                                          |
|  +-----------------+  +-----------------+  +-----------------+  +-----------------+
|  | [Movie Poster]  |  | [Movie Poster]  |  | [Movie Poster]  |  | [Movie Poster]  |  <- Movie
|  |                 |  |                 |  |                 |  |                 |     Grid
|  | Movie Title 1   |  | Movie Title 2   |  | Movie Title 3   |  | Movie Title 4   |
|  +-----------------+  +-----------------+  +-----------------+  +-----------------+
|                                                                          |
|  +-----------------+  +-----------------+  +-----------------+  +-----------------+
|  | [Movie Poster]  |  | [Movie Poster]  |  | [Movie Poster]  |  | [Movie Poster]  |
|  |                 |  |                 |  |                 |  |                 |
|  | Movie Title 5   |  | Movie Title 6   |  | Movie Title 7   |  | Movie Title 8   |
|  +-----------------+  +-----------------+  +-----------------+  +-----------------+
|                                                                          |
|                     < Previous      [1] 2 3 ... 10     Next >             <- Pagination
|                                                                          |
+--------------------------------------------------------------------------+


### ⏳ Screen 2: Home Page - Loading State


This screen shows what the user sees while the initial list of movies is being fetched from the API. Using a skeleton screen provides a better user experience than a simple spinner.


#### Visual Layout


+--------------------------------------------------------------------------+
| [Logo: MovieRecs]      [ Search for a movie...          ]  [User Avatar] |
+--------------------------------------------------------------------------+
|                                                                          |
|  <H1>Popular Movies</H1>                                                   |
|                                                                          |
|  +-----------------+  +-----------------+  +-----------------+  +-----------------+
|  |                 |  |                 |  |                 |  |                 |  <- Skeleton
|  | [Shimmering Box]|  | [Shimmering Box]|  | [Shimmering Box]|  | [Shimmering Box]|     Cards
|  | [Shimmering Bar]|  | [Shimmering Bar]|  | [Shimmering Bar]|  | [Shimmering Bar]|
|  +-----------------+  +-----------------+  +-----------------+  +-----------------+
|                                                                          |
|  +-----------------+  +-----------------+  +-----------------+  +-----------------+
|  |                 |  |                 |  |                 |  |                 |
|  | [Shimmering Box]|  | [Shimmering Box]|  | [Shimmering Box]|  | [Shimmering Box]|
|  | [Shimmering Bar]|  | [Shimmering Bar]|  | [Shimmering Bar]|  | [Shimmering Bar]|
|  +-----------------+  +-----------------+  +-----------------+  +-----------------+
|                                                                          |
+--------------------------------------------------------------------------+




### Screen 3: Movie Details Page


This page displays comprehensive information about a single movie selected from the home page.


#### Visual Layout


+--------------------------------------------------------------------------+
| [Logo: MovieRecs]      [ Search for a movie...          ]  [User Avatar] |
+--------------------------------------------------------------------------+
|                                                                          |
|  < Back to list                                                          |
|                                                                          |
|  +----------------------------------------------------------------------+
|  |                                                                      |
|  |                      [Backdrop Image]                                |
|  |                                                                      |
|  +----------------------------------------------------------------------+
|                                                                          |
|  +-----------------+  <H1>Movie Title (2025)</H1>                         |
|  | [Movie Poster]  |                                                    |
|  |                 |  Rating: ★★★★★ (8.5/10)                             |
|  |                 |                                                    |
|  +-----------------+  <H3>Overview</H3>                                   |
|                       [Lorem ipsum dolor sit amet, consectetur           |
|                       adipiscing elit. Sed do eiusmod tempor incididunt  |
|                       ut labore et dolore magna aliqua...]               |
|                                                                          |
|  <H3>Cast</H3>                                                            |
|                                                                          |
|  [ < ] +-----------+ +-----------+ +-----------+ +-----------+ [ > ]      <- Horizontally
|        | [Actor Pic] | | [Actor Pic] | | [Actor Pic] | | [Actor Pic] |         Scrollable
|        | Actor Name  | | Actor Name  | | Actor Name  | | Actor Name  |
|        | Character   | | Character   | | Character   | | Character   |
|        +-----------+ +-----------+ +-----------+ +-----------+
|                                                                          |
+--------------------------------------------------------------------------+


## Getting Started


To get a local copy up and running, follow these simple steps.


### Prerequisites


Make sure you have the following installed on your machine:


   [Node.js] (v20 or later)
   [npm] (or yarn)


### Installation
1.  Install dependencies:


    ```bash
    npm install
    ```


3.  Set up environment variables:
    Create a file named `.env.local` in the root of your project and add the following variables. You can use the `.env.example` file as a template.


    ```env
    # .env.local


    # Get your free API key from https://www.themoviedb.org/
    NEXT_PUBLIC_TMDB_API_KEY=YOUR_TMDB_API_KEY


    # NextAuth.js Configuration
    # Generate a secret using: `openssl rand -base64 32` in your terminal
    NEXTAUTH_SECRET=YOUR_GENERATED_SECRET
    NEXTAUTH_URL=http://localhost:3000


    # Google Auth Provider (optional)
    # Get credentials from Google Cloud Console: https://console.cloud.google.com/
    GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
    ```


4.  Run the development server:


    ```bash
    npm run dev
    ```



