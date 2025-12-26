# Salah Time - Islamic Prayer App

## Overview

Salah Time (صلاة تايم) is a comprehensive Islamic mobile-first web application built with React and Express. The app provides prayer times calculation, Qibla direction compass, Quran reading, and Islamic remembrances (Athkar). It's designed primarily for Arabic-speaking users with full RTL (right-to-left) support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React Context for app-wide settings (PrayerProvider)
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Animations**: Framer Motion for page transitions and UI animations
- **Fonts**: Cairo (UI text) and Amiri (Quran/Arabic calligraphy)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with tsx for development, esbuild for production
- **API Pattern**: RESTful routes prefixed with `/api`
- **Build System**: Vite for frontend, custom esbuild script for server bundling

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` - shared between client and server
- **Current Schema**: Basic users table with UUID primary keys
- **Client-side Storage**: localStorage for user preferences, reading progress, and cached data

### Key Features Implementation
1. **Prayer Times**: Uses the `adhan` library for accurate Islamic prayer time calculations with multiple calculation methods (Umm Al-Qura, Muslim World League, etc.)
2. **Qibla Compass**: Device orientation API integration for compass functionality
3. **Quran Reader**: Local surah metadata with verse display, bookmark tracking
4. **Athkar (Remembrances)**: Static data for morning/evening/prayer supplications with counters
5. **Location Services**: Geolocation API for automatic location detection, mosque finder with caching

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/  # UI components (shadcn + custom)
│   │   ├── pages/       # Route pages (home, quran, athkar, qibla, settings)
│   │   ├── lib/         # Utilities, contexts, and data files
│   │   └── hooks/       # Custom React hooks
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data access layer (in-memory + DB interface)
│   └── static.ts     # Static file serving for production
├── shared/           # Shared types and schemas
│   └── schema.ts     # Drizzle database schema
└── migrations/       # Database migrations
```

### Development vs Production
- **Development**: Vite dev server with HMR, tsx for server
- **Production**: Static build served by Express, bundled server with esbuild

## External Dependencies

### Core Libraries
- **adhan**: Islamic prayer times calculation library
- **drizzle-orm**: Type-safe SQL ORM for PostgreSQL
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library

### UI Framework
- **@radix-ui/***: Headless UI primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-built component collection
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework

### Database
- **PostgreSQL**: Primary database (requires DATABASE_URL environment variable)
- **connect-pg-simple**: Session storage for Express

### Build Tools
- **Vite**: Frontend bundler and dev server
- **esbuild**: Server bundler for production
- **drizzle-kit**: Database migration tool

### Replit-specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development indicator