import { Request, Response, NextFunction } from "express";
import { EvolutionApiService } from "../../services/EvolutionApiService";

export class DevController {
  constructor(private evolutionService: EvolutionApiService) {}

  testWhatsApp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone, text } = req.body;
      await this.evolutionService.sendMessage(
        phone,
        text || "Teste Anti-Calote - Evolution API OK"
      );
      res.json({ message: "Mensagem enviada" });
    } catch (err) {
      next(err);
    }
  };
}
