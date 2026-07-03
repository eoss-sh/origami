# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Next.js 15.4.6 template project using the App Router with TypeScript and Tailwind CSS. Currently a clean starting point bootstrapped with `create-next-app`.

## Development Commands
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Current Project Structure
```
app/
├── favicon.ico
├── globals.css      # Global styles with Tailwind
├── layout.tsx       # Root layout with Geist fonts
└── page.tsx         # Home page

docs/
├── architecture.md  # Empty - to be populated
└── examples/        # Empty directory for future examples
```

## Tech Stack
- **Framework**: Next.js 15.4.6 (App Router)
- **Language**: TypeScript 5+ with strict mode
- **Styling**: Tailwind CSS 4+ (PostCSS-based) and Shadcn UI
- **Animation**: Motion
- **State Management**: Zustand (for global state) + React hooks (for local state)
- **Data Fetching**:TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Testing**: Jest + Testing Library + Playwright
- **Database**: Supabase DB
- **Authentication**: Supabase Auth
- **E-Mail**: Resend
- **AI**: AI SDK and Llamaindex
- **Vector DB**: Pinecone

## Coding Standards

### TypeScript
- Use strict mode TypeScript
- Prefer type assertions over `any`
- Use interface for object shapes, type for unions/intersections
- Export types from dedicated `types/` files or `types` Folder with seperate Files. 

### Component Patterns
```typescript
// Prefer this pattern for components
interface ComponentProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Component({ title, children, className }: ComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### File Naming
- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase starting with `use` (`useUserData.ts`)
- Utils: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- Types: PascalCase with descriptive suffixes (`UserProfileProps`, `ApiResponse`)

### Recommended Folder Structure
As the project grows, follow this structure:
```
app/                   # Next.js App Router (current)
├── (auth)/           # Route groups for auth pages
├── api/              # API routes
├── globals.css       # Global styles
├── layout.tsx        # Root layout
└── page.tsx          # Home page

components/           # Reusable UI components (to be created)
├── ui/              # Base UI components (shadcn/ui style)  
├── forms/           # Form-specific components
└── layout/          # Layout components

lib/                 # Utility functions (to be created)
├── utils.ts         # General utilities
├── validations.ts   # Zod schemas  
└── api.ts           # API client setup

types/               # TypeScript type definitions (to be created)
hooks/               # Custom React hooks (to be created)
constants/           # Application constants (to be created)
```

## Custom Commands

### /setup-page
Create a new Next.js page with:
1. Proper TypeScript interface for params/searchParams
2. Metadata export
3. Basic component structure
4. Loading and error boundaries if needed

### /create-component
Create a new component with:
1. TypeScript interface for props
2. Proper export/import pattern
3. Basic Tailwind structure
4. Storybook story if applicable

### /add-api-route
Create a new API route with:
1. Proper HTTP method handlers
2. Input validation with Zod
3. Error handling
4. TypeScript types for request/response

### /setup-hook
Create a custom hook with:
1. Proper TypeScript return types
2. Error handling
3. Loading states
4. Memoization where appropriate

### /check-docs
Before starting any task:
1. Review relevant documentation in `docs/`
2. Identify existing patterns to follow
3. Note any architectural constraints
4. Suggest which docs to reference

### /update-docs
After completing a feature:
1. Update relevant documentation
2. Add examples if introducing new patterns
3. Update architecture docs if system changed

## Code Quality Requirements

### Before Committing
Always run these commands and ensure they pass:
```bash
npm run lint         # ESLint with Next.js rules
npm run build        # Production build (includes TypeScript compilation)
```

### Note on Testing
Testing frameworks are not currently configured. When adding tests, update this section with the appropriate test commands.

### Testing Standards
- Unit tests for utility functions (aim for 90%+ coverage)
- Component tests for complex UI logic
- Integration tests for API routes
- E2E tests for critical user flows
- Use MSW for API mocking in tests

### Performance Requirements
- Core Web Vitals should be in "Good" range
- Images must use next/image with proper optimization
- Use dynamic imports for heavy components
- Implement proper loading states and error boundaries

## API Patterns

### Route Handlers
```typescript
// app/api/users/route.ts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    
    // Implementation
    return Response.json({ users, pagination });
  } catch (error) {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Client-Side Data Fetching
- Use SWR or TanStack Query for server state
- Implement proper error boundaries
- Use optimistic updates where appropriate
- Cache API responses appropriately

## Styling Guidelines

### Tailwind CSS
- Use the `cn()` utility for conditional classes
- Create component variants using class-variance-authority
- Follow mobile-first responsive design
- Use Tailwind's built-in dark mode support

### Component Styling Pattern
```typescript
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

## Deployment & Environment

### Environment Variables
- Use `.env.local` for development
- Prefix client-side variables with `NEXT_PUBLIC_`
- Validate environment variables at build time
- Document all required environment variables

### Deployment Checklist
1. All tests passing
2. Build succeeds without warnings
3. Environment variables configured
4. Database migrations applied
5. Performance metrics within acceptable range

## Security Guidelines
- Validate all user inputs with Zod
- Use CSRF protection for forms
- Implement proper authentication checks
- Sanitize data before database operations
- Use HTTPS in production
- Implement rate limiting for API routes

## Documentation Requirements
- README with setup instructions
- API documentation for custom endpoints
- Component documentation with examples
- Deployment guide
- Architecture decision records (ADRs) for major decisions

## Git Workflow
- Use conventional commits
- Create feature branches from main
- Require PR reviews before merging
- Run CI/CD pipeline on all PRs
- Keep commits atomic and well-described

## Common Issues & Solutions

### Performance
- Use `next/dynamic` for heavy components
- Implement proper image optimization
- Use React.memo() for expensive re-renders
- Consider server components vs client components carefully

### SEO
- Implement proper meta tags using Next.js metadata API
- Use structured data where appropriate
- Ensure proper heading hierarchy
- Implement OpenGraph tags

Remember: Always think about the user experience, code maintainability, and team productivity when making architectural decisions.