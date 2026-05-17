import { Request, Response, NextFunction } from "express";
import { CreateClientUseCase } from "../../../usecases/clients/CreateClientUseCase";
import { GetClientUseCase } from "../../../usecases/clients/GetClientUseCase";
import { ListClientsUseCase } from "../../../usecases/clients/ListClientsUseCase";
import { UpdateClientUseCase } from "../../../usecases/clients/UpdateClientUseCase";

export class ClientController {
  constructor(
    private listClients: ListClientsUseCase,
    private createClient: CreateClientUseCase,
    private getClient: GetClientUseCase,
    private updateClient: UpdateClientUseCase
  ) {}

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const clients = await this.listClients.execute();
      res.json(clients);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, whatsapp, document } = req.body;
      const client = await this.createClient.execute({ name, whatsapp, document });
      res.status(201).json(client);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await this.getClient.execute(String(req.params.id));
      res.json(client);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await this.updateClient.execute(String(req.params.id), req.body);
      res.json(client);
    } catch (err) {
      next(err);
    }
  };
}
