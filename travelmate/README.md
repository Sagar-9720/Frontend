# TravelMate

This README provides an overview of the code and features implemented in this folder so far.

## Project Overview
TravelMate is a modern travel companion web app built with React, TypeScript, Vite, and Tailwind CSS. It helps users discover destinations, manage trips, and maintain travel journals.

## Main Features & Structure

- **App.tsx**: Main entry point. Sets up routing, authentication context, and layout (Navbar, Footer).
- **components/Layout**:
  - `Navbar.tsx`: Responsive navigation bar with user profile, logout, and links to Home, Destinations, Trips, and Travel Journal.
  - `Footer.tsx`: Branded footer with social links and quick navigation.
- **contexts/AuthContext.tsx**: Authentication context. Handles login, registration, OAuth, profile updates, and session management.
- **pages**:
  - `Home.tsx`: Landing page. Shows featured destinations and popular trips.
  - `Auth/Login.tsx`: Login form with email/password and OAuth options.
  - `Auth/Register.tsx`: Registration form with validation and OAuth.
  - `Destinations.tsx`: Search and list travel destinations. Fetches weather data for each destination.
  - `TravelJournal.tsx`: CRUD for travel journal entries. Linked to user authentication.
- **services/api.ts**: Mock API service for destinations, trips, weather, and journal entries.
- **types/index.ts**: TypeScript interfaces for User, Destination, Trip, TravelJournal, etc.

## Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- React Hook Form
- React Hot Toast

## How It Works
- Users can browse destinations, view trip details, and maintain a travel journal.
- Authentication is handled via context and localStorage.
- Mock API simulates backend data for development.

## Next Steps
- Connect to a real backend
- Add more pages (profile, trip booking, admin)
- Improve UI/UX and mobile responsiveness

---
For details on each file/component, see the code comments and structure above.
