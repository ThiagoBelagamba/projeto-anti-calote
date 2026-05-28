import { AppError } from "./AppError";

interface PgError extends Error {
  code?: string;
  constraint?: string;
}

export function isPgUniqueViolation(err: unknown, constraint?: string): boolean {
  const pg = err as PgError;
  if (pg?.code !== "23505") return false;
  if (constraint && pg.constraint !== constraint) return false;
  return true;
}

export function mapPgUniqueToAppError(err: unknown): AppError | null {
  if (!isPgUniqueViolation(err)) return null;

  const constraint = (err as PgError).constraint ?? "";

  if (constraint.includes("document") || constraint === "students_document_unique") {
    return new AppError("CPF já cadastrado", 409);
  }
  if (constraint.includes("students") && constraint.includes("email")) {
    return new AppError("Email já cadastrado", 409);
  }
  if (constraint.includes("email")) {
    return new AppError("Email já cadastrado como administrador", 409);
  }

  return new AppError("Registro duplicado", 409);
}
