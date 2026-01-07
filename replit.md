# Vet2Ceo Mission Generator

## Overview

A mission generator web application designed for veteran entrepreneurs transitioning to business ownership. The app provides daily, actionable missions based on three user inputs: available time, goal type, and preferred platform. Built with a military-tactical design aesthetic emphasizing clarity, efficiency, and mission-oriented functionality.

The application features three main sections:
- **Mission Generator**: Core functionality for generating personalized daily missions
- **Template Library**: Pre-built mission templates organized by category (Business, Fitness, Learning, Networking)
- **Success Gallery**: Photo showcase of veteran success stories

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming (dark mode default)
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **Build Tool**: esbuild for production bundling with selective dependency bundling

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Validation**: Zod schemas generated from Drizzle schemas via `drizzle-zod`
- **Storage Abstraction**: Interface-based storage layer (`IStorage`) with in-memory implementation for development

### Database Schema
- **users**: Basic authentication with id, username, password
- **missionTemplates**: Pre-built templates with title, description, category, timeMinutes, platform, missionText
- **generatedMissions**: User-generated missions tracking missionText, timeMinutes, goal, platform, missionNumber
- **photos**: Gallery photos with veteranName, businessName, imageUrl, caption, achievement

### Design System
- **Theme**: Military-tactical aesthetic with dark mode optimization
- **Typography**: Inter (primary), JetBrains Mono (monospace)
- **Color System**: HSL-based CSS variables with semantic naming (primary, secondary, destructive, etc.)
- **Component Style**: shadcn/ui "new-york" style variant

## External Dependencies

### Database
- PostgreSQL (configured via `DATABASE_URL` environment variable)
- Drizzle Kit for schema migrations (`npm run db:push`)

### UI Libraries
- Radix UI primitives (dialog, select, toast, etc.)
- Lucide React for icons
- Embla Carousel for carousels
- Vaul for drawer components
- cmdk for command palette
- react-day-picker for calendar

### Build & Development
- Vite with React plugin
- Replit-specific plugins for development (cartographer, dev-banner, runtime-error-modal)
- esbuild for server bundling

### Data & Validation
- TanStack React Query for data fetching
- Zod for runtime validation
- react-hook-form with @hookform/resolvers for form handling