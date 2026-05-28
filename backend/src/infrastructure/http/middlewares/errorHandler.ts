import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/AppError";
import { mapPgUniqueToAppError } from "../../../shared/pgErrors";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message, message: err.message });
    return;
  }

  const pgError = mapPgUniqueToAppError(err);
  if (pgError) {
    res.status(pgError.statusCode).json({
      error: pgError.message,
      message: pgError.message,
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: "Erro interno do servidor",
    message: "Erro interno do servidor",
  });
}
