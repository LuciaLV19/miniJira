<pre>
 █▀▀ █▀▀█ ▀█▀ █▀▀▄   █▀▀█ █  █ █  █ █▀▀▄ █▀▀ █▀▀█
 █ █ █▄▄▀  █  █  █   █▄▄▀ █  █ █▀▀█ █  █ █▀▀ █▄▄▀
 ▀▀▀ ▀─▀▀ ▀▀▀ ▀▀▀     ▀─▀▀ ▀▀▀▀ ▀  ▀ ▀  ▀ ▀▀▀ ▀─▀▀
</pre>

# 🚀 MiniJira — Cyberpunk Kanban Board

[Español](#español) | [English](#english)

---

## Español

Aplicación **Fullstack** de gestión de proyectos y tareas basada en un sistema **Kanban**, con una estética **Cyberpunk/Neon**. Construida con una arquitectura MERN moderna utilizando **React 19, Node.js, Express y MongoDB**, junto con **TypeScript, JWT, Zod y Vitest**.

### 🛠️ Stack Tecnológico

| Capa                | Tecnologías                                                                    |
| :------------------ | :----------------------------------------------------------------------------- |
| **Frontend**        | React 19, TypeScript, Vite, Tailwind CSS, Zustand, Axios, React Router, Vitest |
| **Backend**         | Node.js, Express, MongoDB, Mongoose, Zod, JWT, Vitest                          |
| **Infraestructura** | Vercel (Frontend), Render/Railway (Backend), MongoDB Atlas                     |

---

### 🚀 Inicio Rápido

#### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/mini-jira.git
cd mini-jira
```

#### 2. Instalar dependencias

Instala las dependencias de cada servicio:

```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

#### 3. Configurar Variables de Entorno

Crea un archivo `.env` dentro de `/backend` utilizando `.env.example` como plantilla:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/kanban_db
JWT_SECRET=tu_secreto_jwt
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Importante:** No subas el archivo `.env` al repositorio. Contiene información sensible, especialmente `JWT_SECRET` y las credenciales de la base de datos.

#### 4. Ejecutar la Aplicación

Abre dos terminales para iniciar ambos servicios:

**Terminal 1 — Backend**

```bash
cd backend
pnpm run dev
```

**Terminal 2 — Frontend**

```bash
cd frontend
pnpm run dev
```

Una vez iniciados los servicios:

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:3000`

---

### 📁 Estructura del Proyecto

```text
mini-jira/
├── backend/          # API REST con Express, MongoDB y Zod
│   └── README.md     # Documentación del backend
├── frontend/         # Cliente React con TypeScript y Zustand
│   └── README.md     # Documentación del frontend
├── TESTING.md        # Guía de ejecución de pruebas
└── README.md         # Documentación principal del proyecto
```

Para obtener información específica sobre cada parte del proyecto, consulta la documentación correspondiente del **backend** y **frontend**.

---

### 🧪 Testing

El proyecto utiliza **Vitest** para las pruebas unitarias y de integración.

Los tests se ejecutan de forma independiente en cada workspace:

**Backend**

```bash
cd backend
pnpm run test
```

**Frontend**

```bash
cd frontend
pnpm run test
```

Para generar un informe de cobertura:

```bash
# Backend
cd backend
pnpm run test:coverage
```

```bash
# Frontend
cd frontend
pnpm run test:coverage
```

Consulta `TESTING.md` para obtener información adicional sobre la estrategia y ejecución de las pruebas.

---

## English

Fullstack **Kanban project and task management application** with a **Cyberpunk/Neon** aesthetic. Built with a modern MERN architecture using **React 19, Node.js, Express, and MongoDB**, together with **TypeScript, JWT, Zod, and Vitest**.

### 🛠️ Tech Stack

| Layer              | Technologies                                                                   |
| :----------------- | :----------------------------------------------------------------------------- |
| **Frontend**       | React 19, TypeScript, Vite, Tailwind CSS, Zustand, Axios, React Router, Vitest |
| **Backend**        | Node.js, Express, MongoDB, Mongoose, Zod, JWT, Vitest                          |
| **Infrastructure** | Vercel (Frontend), Render/Railway (Backend), MongoDB Atlas                     |

---

### 🚀 Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mini-jira.git
cd mini-jira
```

#### 2. Install Dependencies

Install the dependencies for each service:

```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

#### 3. Environment Variables

Create a `.env` file inside `/backend` based on the `.env.example` template:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/kanban_db
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Important:** Do not commit the `.env` file to the repository. It contains sensitive information, including `JWT_SECRET` and database credentials.

#### 4. Run the Application

Open two separate terminals to start both services:

**Terminal 1 — Backend**

```bash
cd backend
pnpm run dev
```

**Terminal 2 — Frontend**

```bash
cd frontend
pnpm run dev
```

Once both services are running:

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:3000`

---

### 📁 Project Structure

```text
mini-jira/
├── backend/          # REST API with Express, MongoDB, and Zod
│   └── README.md     # Backend documentation
├── frontend/         # React client with TypeScript and Zustand
│   └── README.md     # Frontend documentation
├── TESTING.md        # Testing guide
└── README.md         # Main project documentation
```

For more detailed information about each part of the application, refer to the **backend** and **frontend** documentation.

---

### 🧪 Testing

The project uses **Vitest** for unit and integration testing.

Tests are executed independently in each workspace:

**Backend**

```bash
cd backend
pnpm run test
```

**Frontend**

```bash
cd frontend
pnpm run test
```

To generate a code coverage report:

```bash
# Backend
cd backend
pnpm run test:coverage
```

```bash
# Frontend
cd frontend
pnpm run test:coverage
```

See `TESTING.md` for additional information about the project's testing strategy and test execution.
