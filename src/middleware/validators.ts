import { Request, Response, NextFunction } from 'express';
import validator from 'express-validator';
const { validationResult, check, body } = validator;

/**
 * Validación para el nombre del producto
 */
export const nombreValidator = check('nombre')
  .trim()
  .notEmpty().withMessage('El nombre es requerido')
  .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres');

/**
 * Validación para la descripción del producto (opcional)
 */
export const descripcionValidator = check('descripcion')
  .optional()
  .isString().withMessage('La descripción debe ser un texto')
  .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres');

/**
 * Validación para el precio del producto
 */
export const precioValidator = check('precio')
  .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
  .notEmpty().withMessage('El precio es requerido');

/**
 * Validación para el stock del producto
 */
export const stockValidator = check('stock')
  .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo')
  .notEmpty().withMessage('El stock es requerido');

/**
 * Validación para la categoría del producto
 */
export const categoriaValidator = check('categoria')
  .notEmpty().withMessage('La categoría es requerida')
  .isString().withMessage('La categoría debe ser un texto')
  .isLength({ min: 2, max: 50 }).withMessage('La categoría debe tener entre 2 y 50 caracteres');

/**
 * Validación para el ID del proveedor
 */
export const proveedorIdValidator = check('proveedorId')
  .isInt().withMessage('El ID del proveedor debe ser un número entero')
  .notEmpty().withMessage('El ID del proveedor es requerido');

/**
 * Middleware para validar errores de validación
 */
export const validarErrores = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array()
    });
  }
  next();
};

/**
 * Validador completo para productos
 */
export const productoValidator = [
  nombreValidator,
  descripcionValidator,
  precioValidator,
  stockValidator,
  categoriaValidator,
  proveedorIdValidator,
  validarErrores
];

/**
 * Validador completo para proveedores
 */
export const proveedorValidator = [
  check('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  check('telefono')
    .optional()
    .isString().withMessage('El teléfono debe ser un texto')
    .isLength({ max: 20 }).withMessage('El teléfono no puede exceder 20 caracteres'),
  check('email')
    .optional()
    .isEmail().withMessage('El email debe ser un email válido')
    .normalizeEmail(),
  check('direccion')
    .optional()
    .isString().withMessage('La dirección debe ser un texto')
    .isLength({ max: 200 }).withMessage('La dirección no puede exceder 200 caracteres'),
  validarErrores
];

export default validarErrores;