import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { HTTPError } from '../http/error';

/**
 * Validation middleware using Zod schemas
 * Provides consistent error handling for validation failures
 */
export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const validatedData = await schema.parseAsync(req.body);
      
      // Replace request body with validated data (sanitized)
      req.body = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into user-friendly messages
        const errors = error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        const errorMessage = errors
          .map((err) => `${err.path ? err.path + ': ' : ''}${err.message}`)
          .join(', ');

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
          error: errorMessage,
        });
      }

      // Handle other errors
      return res.status(500).json({
        success: false,
        message: 'Validation error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
};

/**
 * Validation middleware for query parameters
 */
export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.query);
      req.query = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Query validation failed',
          errors,
        });
      }

      next(new HTTPError('Query validation error', 500));
    }
  };
};

/**
 * Validation middleware for URL parameters
 */
export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.params);
      req.params = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Parameter validation failed',
          errors,
        });
      }

      next(new HTTPError('Parameter validation error', 500));
    }
  };
};

/**
 * Safe error handler for async validators
 */
export const safeValidate = async (
  schema: ZodSchema,
  data: any
): Promise<{ success: boolean; data?: any; errors?: any }> => {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }

    return {
      success: false,
      errors: [{ message: 'Validation error' }],
    };
  }
};

