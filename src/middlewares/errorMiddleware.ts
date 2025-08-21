import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";

export const errorMiddleware: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Captura JSON inválido
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      status: "error",
      message: "JSON inválido no corpo da requisição",
    });
  }

  console.error("Erro inesperado:", err);

  return res.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
  });
};

