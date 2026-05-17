import { NextFunction, Request, Response } from "express";
import { env } from "../../../config/env";

export function webhookVerifier(req: Request, res: Response, next: NextFunction): void {
  if (env.asaasWebhookSkipVerify) {
    next();
    return;
  }

  if (!env.asaasWebhookToken) {
    next();
    return;
  }

  const token =
    req.headers["asaas-access-token"] ||
    req.headers["x-asaas-token"] ||
    req.query.token;

  if (token !== env.asaasWebhookToken) {
    res.status(401).json({ error: "Token de webhook inválido" });
    return;
  }

  next();
}
