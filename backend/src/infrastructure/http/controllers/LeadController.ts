import { Request, Response } from "express";
import { CreateLeadUseCase } from "../../../usecases/leads/CreateLeadUseCase";

export class LeadController {
  async create(req: Request, res: Response) {
    try {
      const useCase = new CreateLeadUseCase();
      const lead = await useCase.execute(req.body);
      res.status(201).json(lead);
    } catch (error: any) {
      console.error("Lead creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
