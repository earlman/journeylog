# Travel Log Application

## Overview
This is a travel log application migrated from Figma to Replit. It displays a mobile-responsive travel diary entry about the Philippines with a modern dark theme design.

## Project Architecture
- **Frontend**: React with TypeScript, using Wouter for routing
- **Backend**: Express.js server with PostgreSQL database
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with custom fonts (Tungsten, Inconsolata)
- **UI Components**: Radix UI components via shadcn/ui
- **Build Tool**: Vite for development and bundling

## Features
- Interactive homescreen with amcharts world map focused on Southeast Asia
- Country selection cards with visited status indicators
- Mobile-first travel log interface with story-like image slider
- Dynamic image filters (normal, warm, cool, bright effects)
- Travel highlights, budget tips, and advice sections
- Navigation between homescreen and travel logs
- Dark theme design with custom color scheme

## Recent Changes
- December 25, 2024: Migrated from Figma to Replit environment
- Added PostgreSQL database with travel logs, travel images, and users tables
- Implemented database storage layer replacing in-memory storage
- Created API endpoints for managing travel logs and images
- Added automatic database seeding functionality
- Enhanced story-like image slider with database-driven content and visual filters
- July 26, 2025: Created interactive homescreen with amcharts world map
- Added country selection grid with visit status tracking
- Implemented routing between homescreen and travel log pages
- Application server running on port 5000 with proper client/server separation

## User Preferences
- None specified yet

## Development Notes
- Uses custom fonts: Tungsten-Medium and Inconsolata
- References figma assets in `/figmaAssets/` directory
- Mobile-responsive design (393px width target)
- Dark color scheme with #263240 background and #f9e897 accent color