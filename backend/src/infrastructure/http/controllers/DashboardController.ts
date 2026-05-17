import { Request, Response, NextFunction } from "express";
import { GetDashboardSummaryUseCase } from "../../../usecases/dashboard/GetDashboardSummaryUseCase";

export class DashboardController {
  constructor(private getSummary: GetDashboardSummaryUseCase) {}

  summary = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await this.getSummary.execute();
      res.json(summary);
    } catch (err) {
      next(err);
    }
  };
}
