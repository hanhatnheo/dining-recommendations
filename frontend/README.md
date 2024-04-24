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
2. Navigate to the project directory:
   ```bash
   cd dining-recommendations
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   or if you use Yarn:
   ```bash
   yarn install
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

You would also need to navigate to server directory and start the server on `http://localhost:8080`.

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
