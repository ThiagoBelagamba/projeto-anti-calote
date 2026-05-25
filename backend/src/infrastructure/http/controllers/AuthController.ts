import { Request, Response } from "express";
import { LoginUseCase } from "../../../usecases/auth/LoginUseCase";

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const useCase = new LoginUseCase();
      
      const result = await useCase.execute({ email, password });
      res.json(result);
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        res.status(401).json({ error: error.message });
        return;
      }
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
