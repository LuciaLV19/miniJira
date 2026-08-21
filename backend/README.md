# ⚙️ MiniJira — Backend API & Services

[Español](#español) | [English](#english)

---

## Español

Servidor **RESTful** para la plataforma de gestión de tareas **MiniJira**. Gestiona la autenticación de usuarios mediante **JWT y bcryptjs**, la validación de datos con **Zod**, la persistencia de información en **MongoDB** mediante **Mongoose** y el manejo centralizado de errores mediante middleware de Express.

### 🏗️ Arquitectura del Servidor

```text
backend/
├── controllers/       # Lógica de negocio para autenticación, proyectos y tareas
├── middleware/        # Middlewares de Express (Auth JWT, validación Zod, errores)
├── models/            # Modelos de Mongoose (User, Project, Task)
├── routes/            # Definición de las rutas y endpoints de Express
├── schemas/           # Esquemas de validación mediante Zod
├── tests/             # Tests unitarios y de integración con Vitest
├── index.js           # Punto de entrada y arranque del servidor Express
└── .env.example       # Plantilla de variables de entorno
```

### ⚡ Tecnologías y Herramientas

- **Node.js + Express 5:** Servidor y API REST para gestionar las operaciones de la aplicación.
- **MongoDB + Mongoose:** Base de datos NoSQL y modelado de datos mediante esquemas y modelos.
- **JWT:** Autenticación basada en tokens para proteger los recursos de la API.
- **bcryptjs:** Hashing seguro de contraseñas antes de almacenarlas.
- **Zod:** Validación y comprobación de los datos recibidos en las peticiones.
- **CORS:** Control de los orígenes permitidos para las peticiones del frontend.
- **dotenv:** Gestión de variables de entorno.
- **Vitest:** Framework utilizado para ejecutar las pruebas unitarias y de integración.

### 🔑 Variables de Entorno

El backend requiere un archivo `.env` en la raíz de la carpeta `/backend`.

Basándote en `.env.example`, configura las siguientes variables:

- **`PORT`**: Puerto en el que se ejecuta el servidor backend (por ejemplo, `3000`).
- **`MONGO_URI`**: Cadena de conexión a MongoDB local o MongoDB Atlas.
- **`JWT_SECRET`**: Clave secreta utilizada para firmar y verificar los tokens JWT.
- **`CLIENT_URL`**: URL del frontend permitida por la configuración de CORS.

Ejemplo:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/kanban_db
JWT_SECRET=tu_secreto_jwt
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Importante:** El archivo `.env` contiene información sensible y no debe incluirse en el repositorio. Utiliza `.env.example` como plantilla.

### 🛠️ Scripts Disponibles

Ejecuta los siguientes comandos desde la carpeta `/backend`:

```bash
# Iniciar servidor en modo desarrollo
pnpm run dev

# Iniciar servidor en producción
pnpm start

# Ejecutar tests
pnpm run test

# Ejecutar tests en modo watch
pnpm run test:watch

# Generar informe de cobertura de código
pnpm run test:coverage
```

### 📡 Endpoints de la API REST

#### 🔐 Autenticación — `/api/auth`

- `POST /api/auth/register` — Registrar un nuevo usuario. Los datos son validados mediante Zod.
- `POST /api/auth/login` — Iniciar sesión y obtener un token JWT. Los datos son validados mediante Zod.

#### 📁 Proyectos — `/api/projects`

- `GET /api/projects` — Obtener los proyectos del usuario autenticado.
- `POST /api/projects` — Crear un nuevo proyecto o tablero. Requiere autenticación y validación mediante Zod.
- `PUT /api/projects/:projectId` — Actualizar los datos de un proyecto. Requiere autenticación y validación mediante Zod.
- `DELETE /api/projects/:projectId` — Eliminar un proyecto. Requiere autenticación.

#### ✅ Tareas — `/api/projects/:projectId/tasks`

- `GET /api/projects/:projectId/tasks` — Obtener las tareas asociadas a un proyecto. Requiere autenticación.
- `POST /api/projects/:projectId/tasks` — Crear una nueva tarea dentro de un proyecto. Requiere autenticación y validación mediante Zod.
- `PUT /api/projects/:projectId/tasks/:taskId` — Actualizar los datos de una tarea. Requiere autenticación y validación mediante Zod.
- `DELETE /api/projects/:projectId/tasks/:taskId` — Eliminar una tarea. Requiere autenticación.

### 🔐 Autenticación y Seguridad

La API utiliza **JSON Web Tokens (JWT)** para gestionar las sesiones de los usuarios.

Los endpoints protegidos utilizan el middleware `protect`, que verifica el token JWT enviado mediante la cabecera:

```http
Authorization: Bearer <TOKEN>
```

Las contraseñas de los usuarios se almacenan utilizando un hash generado mediante **bcryptjs**.

Los datos recibidos por los endpoints que requieren validación pasan previamente por los esquemas definidos con **Zod**.

### 🧪 Testing

El proyecto utiliza **Vitest** para las pruebas unitarias y de integración.

Los tests pueden ejecutarse mediante:

```bash
# Ejecutar tests
pnpm run test

# Ejecutar tests en modo watch
pnpm run test:watch

# Generar informe de cobertura
pnpm run test:coverage
```

El informe de cobertura se genera mediante el provider `@vitest/coverage-v8`.

---

## English

**RESTful API server** for the **MiniJira** task management platform. Handles user authentication using **JWT and bcryptjs**, input validation with **Zod**, data persistence in **MongoDB** through **Mongoose**, and centralized error handling through Express middleware.

### 🏗️ Server Architecture

```text
backend/
├── controllers/       # Business logic for authentication, projects, and tasks
├── middleware/        # Express middleware (JWT Auth, Zod validation, error handling)
├── models/            # Mongoose models (User, Project, Task)
├── routes/            # Express route and endpoint definitions
├── schemas/           # Zod validation schemas
├── tests/             # Unit and integration tests with Vitest
├── index.js           # Main Express server entry point
└── .env.example       # Environment variables template
```

### ⚡ Tech Stack & Features

- **Node.js + Express 5:** Server and REST API for managing application operations.
- **MongoDB + Mongoose:** NoSQL database and data modeling through schemas and models.
- **JWT:** Token-based authentication for protecting API resources.
- **bcryptjs:** Secure password hashing before storing user credentials.
- **Zod:** Input validation and schema checking for incoming requests.
- **CORS:** Controls allowed origins for frontend requests.
- **dotenv:** Environment variable management.
- **Vitest:** Testing framework used for unit and integration tests.

### 🔑 Environment Variables

The backend requires a `.env` file in the root of the `/backend` directory.

Configure the following variables based on `.env.example`:

- **`PORT`**: Port used by the backend server (e.g., `3000`).
- **`MONGO_URI`**: MongoDB connection string for a local database or MongoDB Atlas.
- **`JWT_SECRET`**: Secret key used to sign and verify JWT tokens.
- **`CLIENT_URL`**: Frontend URL allowed by the CORS configuration.

Example:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/kanban_db
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Important:** The `.env` file contains sensitive information and must not be committed to the repository. Use `.env.example` as a template.

### 🛠️ Available Scripts

Run these commands inside the `/backend` directory:

```bash
# Start the server in development mode
pnpm run dev

# Start the server in production
pnpm start

# Run tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Generate a code coverage report
pnpm run test:coverage
```

### 📡 REST API Reference

#### 🔐 Authentication — `/api/auth`

- `POST /api/auth/register` — Register a new user account. Input is validated using Zod.
- `POST /api/auth/login` — Authenticate a user and issue a JWT token. Input is validated using Zod.

#### 📁 Projects — `/api/projects`

- `GET /api/projects` — Fetch projects belonging to the authenticated user.
- `POST /api/projects` — Create a new project or board. Requires authentication and Zod validation.
- `PUT /api/projects/:projectId` — Update a project's data. Requires authentication and Zod validation.
- `DELETE /api/projects/:projectId` — Delete a project. Requires authentication.

#### ✅ Tasks — `/api/projects/:projectId/tasks`

- `GET /api/projects/:projectId/tasks` — Fetch tasks associated with a project. Requires authentication.
- `POST /api/projects/:projectId/tasks` — Create a new task within a project. Requires authentication and Zod validation.
- `PUT /api/projects/:projectId/tasks/:taskId` — Update a task's data. Requires authentication and Zod validation.
- `DELETE /api/projects/:projectId/tasks/:taskId` — Delete a task. Requires authentication.

### 🔐 Authentication & Security

The API uses **JSON Web Tokens (JWT)** to manage user sessions.

Protected endpoints use the `protect` middleware, which verifies the JWT token sent through the following header:

```http
Authorization: Bearer <TOKEN>
```

User passwords are stored using a hash generated with **bcryptjs**.

Request data for endpoints requiring validation is checked against schemas defined with **Zod** before reaching the corresponding controllers.

### 🧪 Testing

The project uses **Vitest** for unit and integration testing.

Tests can be executed using:

```bash
# Run tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Generate a coverage report
pnpm run test:coverage
```

Code coverage is generated using the `@vitest/coverage-v8` provider.
