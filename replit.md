# Replit.md - Poem Generator Application

## Overview

This is a full-stack poem generator application built with React, TypeScript, Express, and Drizzle ORM. The application allows users to generate personalized poems for various events and occasions using OpenAI's GPT-4o for AI-powered text generation. It features a modern UI built with shadcn/ui components and Tailwind CSS styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for client-side routing
- **AI Integration**: TensorFlow.js for client-side AI capabilities

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: PostgreSQL session store (connect-pg-simple)
- **API Design**: RESTful endpoints under `/api` prefix
- **Development**: Hot reload with Vite middleware integration

### Build System
- **Development**: Node.js with tsx for TypeScript execution
- **Production**: Vite build for client, esbuild for server bundling
- **TypeScript**: Strict mode with path aliases for clean imports

## Key Components

### Database Schema
Located in `shared/schema.ts`:
- **Users Table**: User authentication with username/password
- **Poems Table**: Stores generated poems with metadata (event type, names, style, content, timestamp)
- **Validation**: Zod schemas for type safety and validation

### Frontend Components
- **PoemGenerator**: Form component for poem generation requests
- **PoemDisplay**: Displays generated poems with formatting and actions
- **RecentPoems**: Shows previously generated poems
- **UI Components**: Full shadcn/ui component library integration

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **Route Handlers**: RESTful API endpoints for poem operations
- **AI Agent**: Server-side OpenAI integration for poem generation
- **AI Service**: Client-side TensorFlow.js placeholder for future enhancements

### API Endpoints
- `POST /api/poems/generate` - Generate new poem
- `GET /api/poems/recent` - Fetch recent poems
- `GET /api/poems/:id` - Get specific poem by ID

## Data Flow

1. **Poem Generation**: User fills form → Frontend validates → API request → OpenAI GPT-4o generation → Database storage → Response display
2. **Recent Poems**: Component mount → Query recent poems → Display list with metadata
3. **State Management**: TanStack Query handles caching, background updates, and error states
4. **Form Validation**: React Hook Form + Zod for client-side validation before API calls
5. **AI Generation**: Backend AIAgent handles OpenAI API calls with fallback templates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database queries
- **openai**: OpenAI GPT-4o API integration
- **@tensorflow/tfjs**: Client-side AI capabilities (future use)
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **wouter**: Lightweight routing

### Development Tools
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution
- **drizzle-kit**: Database migrations
- **tailwindcss**: Styling framework

## Deployment Strategy

### Database Setup
- PostgreSQL database required (configured for Neon)
- Environment variable `DATABASE_URL` must be set
- Schema migrations handled by Drizzle Kit

### Build Process
1. Client build: `vite build` (outputs to `dist/public`)
2. Server build: `esbuild` bundles to `dist/index.js`
3. Production start: `node dist/index.js`

### Environment Configuration
- **Development**: Uses Vite dev server with Express middleware
- **Production**: Serves static files from `dist/public`
- **Database**: Requires `DATABASE_URL` environment variable
- **AI Service**: Requires `OPENAI_API_KEY` environment variable for poem generation

### Key Features
- **Children's Poems Section**: Dedicated category with 5 themes (Animals, Toys, Characters, Nature, Activities)
- **Multiselect Functionality**: Animals and Toys themes support selecting multiple items for combined poems
- **Learning Poems**: Educational content covering 10 topics (Numbers, Alphabet, Colors, Seasons, Body Parts, Family, Emotions, Safety, Healthy Habits, Good Manners)
- **Smart UI Logic**: Theme-specific selection interfaces that adapt based on event type
- **Enhanced AI Prompts**: Age-appropriate, educational content generation for children and learning categories
- **Color-coded Badges**: Visual indicators for different themes and learning topics
- **Comprehensive Fallback System**: Quality template poems when AI quota is exceeded
- Server-side rendering setup for production
- Hot module replacement in development
- Type-safe database operations
- Responsive design with mobile support
- Toast notifications for user feedback
- Copy-to-clipboard functionality
- Poem regeneration capabilities

### Recent Updates (August 2025)
- Added multiselect capability for Animals and Toys themes in children's poems
- Implemented Learning Poems category with 10 educational topics
- Enhanced database schema with childrenOptions array and learningTopic fields
- Updated AI agent with specialized prompts for educational content
- Added comprehensive fallback templates for children's and learning poems
- Improved UI with theme-specific selection interfaces and visual feedback

The application follows modern full-stack development practices with strong TypeScript integration, comprehensive UI components, and scalable architecture patterns. The children's education focus makes it ideal for parents, teachers, and educational content creators.