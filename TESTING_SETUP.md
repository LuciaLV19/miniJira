# Testing Setup - Installation Guide

Este proyecto está configurado con Vitest para pruebas unitarias e integración. Siga los pasos a continuación para completar la configuración.

This project is configured with Vitest for unit and integration testing. Follow the steps below to complete the configuration.

## Dependencias Requeridas / Requered dependencies

### Frontend

```bash
cd frontend

# Instalar dependencias de testing / Install testing dependencies
pnpm add -D @testing-library/react @testing-library/jest-dom @vitest/ui jsdom
```

### Backend

```bash
cd backend

# Instalar dependencias de testing / Install testing dependencies
pnpm add -D vitest @vitest/coverage-v8
```

## Pasos de Configuración / Setup steps

### 1. Frontend Setup

```bash
cd frontend
pnpm install
pnpm add -D @testing-library/react @testing-library/jest-dom @vitest/ui jsdom
```

### 2. Backend Setup

```bash
cd backend
pnpm install
pnpm add -D vitest @vitest/coverage-v8
```

### 3. Root Setup

```bash
# En la raíz del proyecto / At the root of the project
pnpm install
```

## Comandos Disponibles / Available Commands

### Frontend

```bash
cd frontend

# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage

# UI mode (interactive)
pnpm test -- --ui
```

### Backend

```bash
cd backend

# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Root

```bash
# Run all tests
pnpm test

# Run specific workspace
pnpm --dir frontend test
pnpm --dir backend test
```

## Configuración Actual

### Frontend (`frontend/vitest.config.ts`)

- ✅ Vitest configured
- ✅ jsdom environment
- ✅ Coverage reporting enabled

### Backend (`backend/vitest.config.ts`)

- ✅ Vitest configured
- ✅ Node environment
- ✅ Coverage reporting enabled

## Tests Creados

### Frontend Tests

- ✅ `useProjectStore.test.ts` - Store tests
- ✅ `axios.test.ts` - API client tests
- ✅ `LoginForm.test.tsx` - Component tests

### Backend Tests

- ✅ `controllers/authController.test.js` - Auth controller tests
- ✅ `controllers/projectController.test.js` - Project controller tests
- ✅ `controllers/taskController.test.js` - Task controller tests
- ✅ `middleware/authMiddleware.test.js` - Auth middleware tests

## Coverage Targets

Current thresholds (can be adjusted in vitest.config.ts):

- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

## Próximos Pasos / Next steps

1. **Instalar dependencias pendientes** / Install pending dependencies
   - @testing-library/react
   - @testing-library/jest-dom
   - jsdom

2. **Ejecutar tests** / Run tests

   ```bash
   pnpm test:coverage
   ```

3. **Revisar coverage report** / Review coverage report
   - Frontend: `frontend/coverage/index.html`
   - Backend: `backend/coverage/index.html`

4. **Agregar más tests** para mejorar cobertura / Add more tests to improve coverage
   - Crear tests para componentes React adicionales
   - Crear tests para modelos de base de datos
   - Crear tests de integración

5. **Configurar CI/CD** (GitHub Actions) / Configure CI/CD
   - Ejecutar tests automáticamente en pull requests
   - Bloquear merge si tests fallan
   - Ver cobertura en CI

## Troubleshooting

### "Cannot find module '@testing-library/react'"

```bash
pnpm add -D @testing-library/react @testing-library/jest-dom
```

### "jsdom is not installed"

```bash
pnpm add -D jsdom
```

### Tests timeout

Aumentar timeout en vitest.config.ts:

```typescript
test: {
  testTimeout: 20000, // 20 segundos
}
```

## Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Vitest Coverage](https://vitest.dev/guide/coverage)
