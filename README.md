# HipVan Frontend Engineer Assignment

A responsive feed UI for a Frontend Engineer position at HipVan.

## Project Overview

This project implements a responsive feed UI with the following features:

- Full-width video banner at the top (autoplays when in view)
- Pinterest-style masonry image grid
- Ads injected at Fibonacci positions
- Pagination with local mock JSON files (current.json, next.json, prev.json)
- Pull-to-refresh on mobile
- Product tags and animated tooltips

## Tech Stack

- **Framework**: React with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier, TypeScript
- **Git Hooks**: Husky, lint-staged, Commitlint

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 7.x or higher
- Unsplash API key (for advertisement images)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd FE-assignment-HipVan

# Install dependencies
npm install
```

### Setting up Unsplash API

1. Create an account at [Unsplash Developers](https://unsplash.com/developers)
2. Register a new application to get an access key
3. Create a `.env` file in the root directory with the following content:

```
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

Replace `your_unsplash_access_key_here` with your actual Unsplash API access key.

### Development

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run start
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── styles/         # Global styles and Tailwind configuration
├── data/           # Mock JSON data for pagination
├── App.tsx         # Main App component
└── main.tsx        # Application entry point
```

## Features

### Video Banner

The banner at the top of the feed plays automatically when it's in the viewport and pauses when scrolled out of view.

### Masonry Grid

The image grid is implemented as a responsive Pinterest-style masonry layout using CSS Grid and column-count for optimal performance.

### Fibonacci Ad Positions

Ads are injected at Fibonacci positions (1, 2, 3, 5, 8...) within the grid to maintain a balance between content and advertisements.

### Pagination

The feed supports pagination through mock JSON files that simulate API responses:

- `current.json`: Initial page data
- `next.json`: Next page data
- `prev.json`: Previous page data

### Pull-to-Refresh

On mobile devices, users can pull down to refresh the feed, providing a native app-like experience.

### Interactive Tags (Bonus)

Product tags can be toggled on images, displaying animated tooltips with product information.

## Code Quality

This project follows best practices for code quality and maintainability:

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for pre-commit validation
- **lint-staged**: Run linters on staged files
- **Commitlint**: Enforce conventional commit messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.
