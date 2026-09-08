# Testing Strategy - miniJira

## Overview

Este documento detalla la estrategia de testing para el proyecto miniJira, incluyendo pruebas unitarias, de integración y cobertura de código.

This document details the testing strategy for the miniJira project, including unit, integration, and code coverage testing.

## Stack de Testing

### Frontend

- **Framework**: Vitest
- **Assertion Library**: Vitest built-in
- **Environment**: jsdom
- **Coverage Provider**: v8

### Backend

- **Framework**: Vitest
- **Assertion Library**: Vitest built-in
- **Environment**: node
- **Coverage Provider**: v8

## Running Tests

### Frontend

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Backend

```bash
cd backend

# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Root level

```bash
# Run all tests (frontend and backend)
pnpm test

# Run with coverage
pnpm test:coverage
```

## Test Structure

### Frontend Tests

- `src/store/useProjectStore.test.ts` - Tests for Zustand project store
- `src/api/axios.test.ts` - Tests for API client configuration
- `src/components/**/*.test.tsx` - Component tests

### Backend Tests

- `controllers/authController.test.js` - Authentication controller tests
- `controllers/projectController.test.js` - Project controller tests
- `controllers/taskController.test.js` - Task controller tests
- `middleware/authMiddleware.test.js` - Authentication middleware tests

## Coverage Goals

### Minimum Coverage Thresholds

- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

### Current Coverage

Run `pnpm test:coverage` to see current coverage metrics.

## Writing Tests

### Best Practices

1. **Test Naming**: Use descriptive names that explain what is being tested

   ```typescript
   it("should create a project and add it to state", async () => {});
   ```

2. **AAA Pattern**: Arrange, Act, Assert

   ```typescript
   // Arrange
   const data = { name: "Test" };

   // Act
   const result = await createProject(data);

   // Assert
   expect(result).toEqual(expected);
   ```

3. **Mock External Dependencies**

   ```typescript
   vi.mock("../api/axios");

   beforeEach(() => {
     vi.mocked(api.post).mockResolvedValue({ data: {...} });
   });
   ```

4. **Clean State Between Tests**
   ```typescript
   beforeEach(() => {
     vi.clearAllMocks();
     store.reset();
   });
   ```

## Test Categories

### Unit Tests

- Testing individual functions in isolation
- Mocking external dependencies
- Fast execution
- High code coverage

### Integration Tests

- Testing multiple components working together
- Testing API calls end-to-end
- Slower execution
- Real database interactions (when needed)

## CI/CD Integration

Tests should be run automatically on:

1. Pull requests
2. Commits to main branch
3. Pre-deployment checks

See `.github/workflows/` for CI/CD configuration.

## Debugging Tests

### Run Single Test File

```bash
pnpm test -- src/store/useProjectStore.test.ts
```

### Run Tests Matching Pattern

```bash
pnpm test -- --grep "createProject"
```

### Debug Mode

```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs --run
```

## Coverage Reports

After running tests with coverage:

- HTML Report: `coverage/index.html`
- LCOV Report: `coverage/lcov.info`
- Text Report: Console output

## Future Improvements

1. **E2E Testing**: Add Playwright or Cypress for end-to-end tests
2. **Performance Testing**: Add benchmarks for critical operations
3. **Visual Regression**: Add visual regression testing for UI components
4. **Load Testing**: Add k6 or Artillery for load testing
5. **Mutation Testing**: Add Stryker to verify test quality

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Vitest Matchers](https://vitest.dev/api/expect.html)
