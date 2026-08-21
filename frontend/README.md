# 🎨 MiniJira — Frontend Client

[Español](#español) | [English](#english)

---

## Español

Cliente SPA (Single Page Application) para la plataforma de gestión de tareas **MiniJira**. Diseñado con una interfaz temática **Cyberpunk/Neon** utilizando **React 18**, **TypeScript**, **Tailwind CSS** y **Zustand** para la gestión del estado global.

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

* **React 18 + TypeScript:** Tipado estricto y componentes funcionales reutilizables.
* **Vite:** Herramienta de compilación y servidor de desarrollo rápido.
* **Zustand:** Gestión de estado global para proyectos, tareas y sesión de usuario.
* **Tailwind CSS:** Framework de estilos utility-first configurado con una estética neón/cyberpunk.
* **Axios:** Cliente HTTP con interceptores para la gestión automática del token JWT mediante `Authorization: Bearer <TOKEN>`.
* **Vitest + React Testing Library:** Herramientas utilizadas para la configuración y ejecución de pruebas unitarias de componentes y stores.

### 🛠️ Scripts Disponibles

Ejecuta los siguientes comandos desde la carpeta `/frontend`:

```bash
# Iniciar servidor de desarrollo
pnpm run dev

# Ejecutar pruebas unitarias
pnpm run test

# Abrir la interfaz interactiva de Vitest
pnpm run test:ui

# Compilar la aplicación para producción (genera /dist)
pnpm run build
```

### 🔐 Gestión de Estado Global (Zustand)

* **useAuthStore:** Gestiona el token JWT, los datos del usuario autenticado y las acciones de login/logout.
* **useProjectStore:** Gestiona el estado de los proyectos, tableros, columnas y tareas, permitiendo una actualización reactiva de la interfaz.

---

## English

SPA (Single Page Application) client for the **MiniJira** task management platform. Built with a **Cyberpunk/Neon** UI theme using **React 18**, **TypeScript**, **Tailwind CSS**, and **Zustand** for global state management.

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

* **React 18 + TypeScript:** Strict typing and reusable functional components.
* **Vite:** Fast frontend tooling, build system, and development server.
* **Zustand:** Lightweight global state management for projects, tasks, and user sessions.
* **Tailwind CSS:** Utility-first CSS framework configured with a neon/cyberpunk aesthetic.
* **Axios:** HTTP client with interceptors for automatic JWT authentication through `Authorization: Bearer <TOKEN>`.
* **Vitest + React Testing Library:** Tools used for configuring and running unit tests for components and stores.

### 🛠️ Available Scripts

Run these commands inside the `/frontend` directory:

```bash
# Start the development server
pnpm run dev

# Run unit tests
pnpm run test

# Open the Vitest interactive UI
pnpm run test:ui

# Build the application for production (generates /dist)
pnpm run build
```

### 🔐 Global State Management (Zustand)

* **useAuthStore:** Manages JWT tokens, authenticated user data, and login/logout actions.
* **useProjectStore:** Manages projects, boards, columns, and task state, enabling reactive UI updates.
