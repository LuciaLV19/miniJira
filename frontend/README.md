# 🎨 MiniJira — Frontend Client

[Español](#español) | [English](#english)

---

## Español

Cliente SPA (Single Page Application) para la plataforma de gestión de tareas **MiniJira**. Diseñado con una interfaz temática **Cyberpunk/Neon** utilizando **React 19**, **TypeScript**, **Tailwind CSS** y **Zustand** para la gestión del estado global.

### 📦 Estructura del Código Fuente

```text
frontend/src/
├── api/          # Configuración de Axios e interceptores de JWT
├── components/   # Componentes modulares de la interfaz (Auth, Boards, Tasks, Modals)
├── store/        # Stores de Zustand (useProjectStore, useAuthStore)
├── types/        # Interfaces y tipos globales de TypeScript
├── views/        # Vistas y páginas principales de la aplicación
└── index.css     # Estilos globales y clases personalizadas de Tailwind
```

### ⚡ Tecnologías y Herramientas

- **React 19 + TypeScript:** Tipado estricto y componentes funcionales reutilizables.
- **Vite:** Herramienta de compilación y servidor de desarrollo rápido.
- **React Router:** Gestión de rutas y navegación dentro de la aplicación SPA.
- **Zustand:** Gestión de estado global para proyectos, tareas y sesión de usuario.
- **Tailwind CSS:** Framework de estilos utility-first configurado con una estética neón/cyberpunk.
- **Axios:** Cliente HTTP con interceptores para la gestión automática del token JWT mediante `Authorization: Bearer <TOKEN>`.
- **Vitest:** Framework utilizado para la ejecución de pruebas unitarias y de integración.

### 🛠️ Scripts Disponibles

Ejecuta los siguientes comandos desde la carpeta `/frontend`:

```bash
# Iniciar servidor de desarrollo
pnpm run dev

# Ejecutar pruebas
pnpm run test

# Ejecutar pruebas en modo watch
pnpm run test:watch

# Generar informe de cobertura
pnpm run test:coverage

# Comprobar errores de ESLint
pnpm run lint

# Compilar la aplicación para producción
pnpm run build

# Previsualizar la aplicación compilada
pnpm run preview
```

### 🔐 Gestión de Estado Global (Zustand)

- **useAuthStore:** Gestiona el token JWT, los datos del usuario autenticado y las acciones de login/logout.
- **useProjectStore:** Gestiona el estado de los proyectos, tableros, columnas y tareas, permitiendo una actualización reactiva de la interfaz.

---

## English

SPA (Single Page Application) client for the **MiniJira** task management platform. Built with a **Cyberpunk/Neon** UI theme using **React 19**, **TypeScript**, **Tailwind CSS**, and **Zustand** for global state management.

### 📦 Source Code Structure

```text
frontend/src/
├── api/          # Axios configuration and JWT interceptors
├── components/   # Modular UI components (Auth, Boards, Tasks, Modals)
├── store/        # Zustand stores (useProjectStore, useAuthStore)
├── types/        # Global TypeScript interfaces and types
├── views/        # Main application views and pages
└── index.css     # Global styles and custom Tailwind utilities
```

### ⚡ Tech Stack & Features

- **React 19 + TypeScript:** Strict typing and reusable functional components.
- **Vite:** Fast frontend tooling, build system, and development server.
- **React Router:** Client-side routing and navigation for the SPA.
- **Zustand:** Lightweight global state management for projects, tasks, and user sessions.
- **Tailwind CSS:** Utility-first CSS framework configured with a neon/cyberpunk aesthetic.
- **Axios:** HTTP client with interceptors for automatic JWT authentication through `Authorization: Bearer <TOKEN>`.
- **Vitest:** Testing framework used for running unit and integration tests.

### 🛠️ Available Scripts

Run these commands inside the `/frontend` directory:

```bash
# Start the development server
pnpm run dev

# Run tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Generate a code coverage report
pnpm run test:coverage

# Run ESLint
pnpm run lint

# Build the application for production
pnpm run build

# Preview the production build
pnpm run preview
```

### 🔐 Global State Management (Zustand)

- **useAuthStore:** Manages JWT tokens, authenticated user data, and login/logout actions.
- **useProjectStore:** Manages projects, boards, columns, and task state, enabling reactive UI updates.
