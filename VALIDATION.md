# Data Validation Strategy

## Overview

El proyecto utiliza **Zod** para validación de datos en todas las solicitudes HTTP. Esta estrategia garantiza que todos los datos sean válidos antes de procesar las solicitudes.

## Architecture

### Middleware de Validación

El middleware `validate.js` intercepta las solicitudes y valida `req.body` contra un schema Zod antes de pasar a los controladores.

```typescript
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues,
        });
      }
      next(error);
    }
  };
};
```

### Schemas Disponibles

#### Authentication (`validators/schemas.js`)

- `registerSchema` - Validar registro de usuario
- `loginSchema` - Validar login

#### Projects

- `createProjectSchema` - Validar creación de proyecto
- `updateProjectSchema` - Validar actualización de proyecto

#### Tasks

- `createTaskSchema` - Validar creación de tarea
- `updateTaskSchema` - Validar actualización de tarea

## Usage

### Aplicar Validación en Routes

```javascript
import express from "express";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/schemas.js";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Aplicar validación antes del controlador
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);

export default router;
```

## Validation Rules

### User Registration

- **username**: Mínimo 3 caracteres
- **email**: Formato de email válido
- **password**: Mínimo 6 caracteres

### User Login

- **email**: Formato de email válido
- **password**: Requerido (mínimo 1 carácter)

### Project Creation

- **name**: Requerido, máximo 100 caracteres
- **description**: Opcional, máximo 500 caracteres

### Task Creation

- **title**: Requerido, máximo 200 caracteres
- **description**: Opcional, máximo 1000 caracteres
- **status**: Enum (TODO, IN_PROGRESS, DONE), default: TODO
- **priority**: Enum (LOW, MEDIUM, HIGH, URGENT), default: LOW (opcional)

## Error Handling

Cuando la validación falla, se retorna un error 400 con los siguientes detalles:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "code": "too_small",
      "minimum": 6,
      "type": "string",
      "path": ["password"],
      "message": "String must contain at least 6 character(s)"
    }
  ]
}
```

## Best Practices

1. **Validación estricta**: Siempre validar entrada del usuario
2. **Mensajes claros**: Proporcionar mensajes de error descriptivos
3. **Tipos seguros**: Usar enums para campos con opciones limitadas
4. **Composición de schemas**: Reutilizar schemas comunes

## Frontend Integration

El frontend recibe errores de validación con estructura clara:

```typescript
interface ValidationError {
  message: string;
  errors: {
    code: string;
    path: string[];
    message: string;
  }[];
}
```

## Future Improvements

1. **Validación asincrónica**: Para verificaciones en BD (ej: email único)
2. **Custom validators**: Validators específicos del negocio
3. **Documentación OpenAPI**: Auto-generar docs de validación
4. **Testing**: Tests para todos los schemas

## Resources

- [Zod Documentation](https://zod.dev/)
- [Zod Examples](https://zod.dev/docs/examples)
