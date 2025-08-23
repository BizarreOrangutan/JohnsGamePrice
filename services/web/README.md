# JohnsGamePrice - Web Frontend

A modern React TypeScript frontend for game price comparison, built with Vite for optimal development experience and performance.

## 🚀 Features

- **Game Search**: Real-time autocomplete search with game images and metadata
- **Modern UI**: Material-UI components with dark/light theme support
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Performance**: Optimized with Vite's fast build system and HMR

## 📁 Project Structure

```
web/
├── src/
│   ├── modules/
│   │   ├── core/                    # Core application components
│   │   │   ├── components/          # Reusable UI components
│   │   │   │   ├── AppAppBar.tsx    # Main navigation bar
│   │   │   │   ├── GameSearchBar.tsx # Game search with autocomplete
│   │   │   │   ├── GameSearchOption.tsx # Search result display
│   │   │   │   ├── DarkModeToggle.tsx # Theme switcher
│   │   │   │   └── NavDrawer.tsx    # Navigation drawer
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   │   └── useGameSearch.ts # Game search logic with debouncing
│   │   │   ├── utils/               # Utility functions
│   │   │   │   ├── gameSearchService.ts # API service for game search
│   │   │   │   ├── Router.tsx       # Application routing
│   │   │   │   └── routes.tsx       # Route definitions
│   │   │   └── theme/               # Material-UI theme configuration
│   │   ├── error/                   # Error handling components
│   │   │   └── ErrorBoundary.tsx    # Error boundary wrapper
│   │   └── pages/                   # Page components
│   │       ├── Home.tsx             # Landing page
│   │       └── NotFound.tsx         # 404 page
│   ├── App.tsx                      # Root application component
│   └── main.tsx                     # Application entry point
├── public/                          # Static assets
├── package.json                     # Dependencies and scripts
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript configuration
├── Dockerfile                       # Container configuration
└── README.md                        # This documentation
```

## 🛠 Tech Stack

- **React 19**: Latest React with modern features
- **TypeScript 5.8**: Type-safe JavaScript with latest features
- **Vite 7**: Next-generation frontend build tool
- **Material-UI 7**: Modern React component library
- **React Router 7**: Declarative routing for React
- **Bun**: Fast JavaScript runtime and package manager

## 🚀 Quick Start

### **Local Development**

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Start development server**:
   ```bash
   bun run dev
   ```

3. **Access the application**:
   - **Local**: `http://localhost:3000`
   - **Network**: `http://0.0.0.0:3000`

### **Production Build**

1. **Build the application**:
   ```bash
   bun run build
   ```

2. **Preview production build**:
   ```bash
   bun run start
   ```

### **Docker Deployment**

1. **Build the image**:
   ```bash
   docker build -t johnsgameprice-web .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 -e VITE_API_URL=http://localhost:8080 johnsgameprice-web
   ```

## 🎯 Core Components

### **GameSearchBar**

A reusable autocomplete search component with game image previews:

```tsx
import type { GameSearchResult } from '../utils/gameSearchService';

interface GameSearchBarProps {
  placeholder?: string;
  debounceMs?: number;
  minWidth?: number | string;
  onGameSelect?: (game: GameSearchResult | null) => void;
  variant?: 'standard' | 'outlined' | 'filled';
  size?: 'small' | 'medium';
  disabled?: boolean;
  showError?: boolean;
}
```

### **useGameSearch Hook**

Custom hook for game search with debouncing and error handling:

```tsx
const { searchOptions, loading, error, searchValue, setSearchValue } = useGameSearch(500);
```

### **gameSearchService**

API service with environment-aware URL handling:

```tsx
export const gameSearchService = {
  async searchGames(query: string): Promise<GameSearchResult[]>
};
```

## 🔧 Configuration

### **Environment Variables**

Create a `.env.local` file for local development:

```bash
VITE_API_URL=http://localhost:8080
```

### **API Integration**

The frontend communicates with the API Gateway service:

- **Development**: Uses proxy or direct API calls to `localhost:8080`
- **Production**: Uses environment-specific API URLs
- **Docker**: Handles container networking automatically

## 🎨 Theming

The application supports both light and dark themes using Material-UI's theming system:

- **Theme Toggle**: Available in the app bar
- **Persistent**: Theme preference is saved to localStorage
- **System Aware**: Respects system theme preferences

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices with progressive enhancement
- **Breakpoints**: Material-UI's standard breakpoints (xs, sm, md, lg, xl)
- **Touch Friendly**: Optimized for touch interactions

## 🚀 Performance

- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Automatic image and asset optimization
- **Fast Refresh**: Instant updates during development

## 🔧 Development

### **Available Scripts**

```bash
# Development server with HMR
bun run dev

# Production build
bun run build

# Preview production build
bun run start

# Docker development server
bun run dockerdev
```

### **Code Quality**

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React-specific rules
- **Prettier**: Code formatting
- **Import Type**: Consistent use of `import type` for type-only imports

## 🏗 Architecture

### **Modular Structure**

- **Modules**: Feature-based organization
- **Separation of Concerns**: Clear separation between UI, logic, and data
- **Reusability**: Components designed for reuse across the application
- **Type Safety**: Full TypeScript coverage with proper type imports

### **State Management**

- **Local State**: React hooks for component state
- **Custom Hooks**: Shared logic extraction
- **Context**: For global state (theme, etc.)

## 🔗 Integration

### **API Gateway Connection**

The web application connects to the API Gateway service which provides:

- **Game Search**: Real-time game search with metadata and images
- **Price Data**: Game pricing information from multiple sources
- **Error Handling**: Graceful error responses and fallbacks

### **Service Communication**

```
Web Frontend (React) 
    ↓ HTTP/REST
API Gateway (Bun/TypeScript)
    ↓ HTTP/REST  
Price Fetcher (Python/FastAPI)
    ↓ HTTP/REST
ITAD API (External)
```

## 🚀 Future Enhancements

- [ ] **User Authentication**: Login/register functionality
- [ ] **Game Details Pages**: Comprehensive game information
- [ ] **Price Tracking**: Save and track game prices
- [ ] **Wishlist**: User game wishlist functionality
- [ ] **Price Alerts**: Notifications for price drops
- [ ] **Comparison Tool**: Side-by-side game comparison
- [ ] **PWA Support**: Progressive Web App capabilities

## 📝 License

This project is part of the JohnsGamePrice application suite.
