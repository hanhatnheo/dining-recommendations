# Explore&Eat
# Description

With this web app, users can choose an attraction from a map interface and then find nearby restaurants to simplify the process of pairing popular attractions next to popular restaurants quickly for things like dates, vacations, etc. It allows users to find information about the best attractions in their preferred zip-code, and helps them filter restaurants with complex parameters like combinations of average rating, ambience, value, and distance to attractions. We also highlight a series of leader boards, such as the best attraction-restaurant combinations in ZIP codes across the world. Users can also see a randomly-generated attraction and restaurant each day. 

Link to public website: [exploreeat.vercel.app](https://exploreeat.vercel.app)

Snapshot of website: <img width="1432" alt="Screen Shot 2024-05-06 at 9 26 42 PM" src="https://github.com/hanhatnheo/dining-recommendations/assets/96493224/753b1e12-baf6-4cac-8e45-628d2a56efde">

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (LTS version)
- npm or Yarn

## Installation

To install this project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/hanhatnheo/dining-recommendations.git
   ```
2. Unzip the folder.
3. Open a new terminal and cd into the frontend folder:
   ```bash
   cd dining-recommendations
   cd frontend
   ```
4. Open a new terminal and cd into the server folder:
   ```bash
   cd dining-recommendations
   cd server
   ```
5. Install dependencies in both terminals:
   ```bash
   npm install
   ```
   or if you use Yarn:
   ```bash
   yarn install
   ```
Note, given recent React update, you might need to run the below command instead to resolve conflicts:
   ```bash
   npm install --legacy-peer-deps
   ```

## Configuration

To use Mapbox in this project, you need to set up an API key:

1. Obtain a Mapbox API key from [Mapbox](https://mapbox.com/).

2. Create a `.env` file in the root of your project (frontend directory) and add your Mapbox API key:
   ```plaintext
   VITE_MAPBOX=your_mapbox_access_token_here
   ```

## Running the project

To run this project locally:

```bash
npm run dev
```

or if you use Yarn:

```bash
yarn dev
```

This will start the development server on `http://localhost:5173`.

You would also need to navigate to server directory and start the server on `http://localhost:8080`. To do so,
```bash
npm start
```

or if you use Yarn:

```bash
yarn run start
```

## Teat the project (front end)
```bash
npm run test
```

if you want more verbose code coverage information:

```bash
npm run report
```

## Building and running for production

To build the project for production:

```bash
npm run build
```

or if you use Yarn:

```bash
yarn build
```

To preview the production build:

```bash
npm run serve
```

or if you use Yarn:

```bash
yarn serve
```

## Technical Overview

- Frontend: Vite, React.js, Material UI, Mapbox (React MapGL) 
- Backend: Node.js, Express 
- SQL Database: MySQL
- Data preprocessing/NLP: Python, Geocoders & Nominatim, Latent Dirichlet Allocation / Aspect-based sentiment analysis

Our application is built on the React-Express-SQL stack. The front-end website is built in React, using Material-UI for many components. We used the MapBox (React MapGL) to render an interactive map that displayed attractions and restaurants, visualizing their relative distance and respective information. We retrieved geographical boundary information from point coordinates to build data for the map.

The backend is built with Node.js and Express. Express routes each incoming query to a controller function, which parses the input and calls an appropriate handler to retrieve data from the backend. We selected MySQL because of its compatibility and ease of setup. The server/database is hosted on Amazon RDS and the backend communicates with it through SQL queries.

Extensive frontend testing is done with [vitest](https://vitest.dev), with code coverage > 87%.

We have dockerized the application, with the server (backend) hosted on fly.io. The website is then deployed on Vercel.

## Data Sources
[Yelp Businesses](https://www.yelp.com/dataset):
Our first dataset is a set of businesses listed on Yelp, with 1,000,000+ rows and 56 attributes. A plurality of these businesses are Restaurants / Food (54,618 / 24,777), making this dataset suitable for our purposes. Business latitudes / longitudes center in North America.This dataset is how we recommend restaurants which fit a user's search queries, namely its location, quality according to star ratings, number of reviews, and our own metric and proximity to tourist attractions.

[Yelp Reviews](https://www.yelp.com/dataset):
We have a dataset of business reviews with 6,990,280 rows over 9 attributes. This dataset was used to define a more sophisticated restaurant scoring system than Yelp's star system and is regularly joined with Restaurants to show the users some reviews for a restaurant.

[OpenStreetMap Tourist Attractions](https://hub.arcgis.com/datasets/openstreetmap::openstreetmap-tourist-attractions-for-north-america-1/explore):
This dataset of user-contributed tourist attractions in North America contains 261,610 rows with 31 attributes. The most common attraction types are "Information" (60,834), "Camp_pitch" (42,899), and "Camp_site" (33,024). OpenStreetMap data is at the "heart" of our application, as the first page the user visits has them select attractions by clicking on map markers, from which they then discover nearby restaurants.

Total database storage: Approximately 4GB.
