import { Router } from "express";
import { env } from "../../../config/env";
import { PgChargeRepository } from "../../database/repositories/PgChargeRepository";
import { PgClientRepository } from "../../database/repositories/PgClientRepository";
import { PgDashboardRepository } from "../../database/repositories/PgDashboardRepository";
import { PgMessageLogRepository } from "../../database/repositories/PgMessageLogRepository";
import { PgStudentRepository } from "../../database/repositories/PgStudentRepository";
import { PgSubscriptionRepository } from "../../database/repositories/PgSubscriptionRepository";
import { AsaasClientService } from "../../services/AsaasClientService";
import { EvolutionApiService } from "../../services/EvolutionApiService";
import { CreateChargeUseCase } from "../../../usecases/charges/CreateChargeUseCase";
import { ListChargesUseCase } from "../../../usecases/charges/ListChargesUseCase";
import { SendPaymentReminderUseCase } from "../../../usecases/charges/SendPaymentReminderUseCase";
import { CreateClientUseCase } from "../../../usecases/clients/CreateClientUseCase";
import { GetClientUseCase } from "../../../usecases/clients/GetClientUseCase";
import { ListClientsUseCase } from "../../../usecases/clients/ListClientsUseCase";
import { UpdateClientUseCase } from "../../../usecases/clients/UpdateClientUseCase";
import { GetDashboardSummaryUseCase } from "../../../usecases/dashboard/GetDashboardSummaryUseCase";
import { GetPaymentStatusUseCase } from "../../../usecases/checkout/GetPaymentStatusUseCase";
import { RegisterAndSubscribeUseCase } from "../../../usecases/checkout/RegisterAndSubscribeUseCase";
import { SendSubscriptionReminderUseCase } from "../../../usecases/checkout/SendSubscriptionReminderUseCase";
import { PgWebhookAuditRepository } from "../../database/repositories/PgWebhookAuditRepository";
import { DetectAsaasPaymentTypeUseCase } from "../../../usecases/webhooks/DetectAsaasPaymentTypeUseCase";
import { DispatchAsaasWebhookUseCase } from "../../../usecases/webhooks/DispatchAsaasWebhookUseCase";
import { ProcessSubscriptionWebhookUseCase } from "../../../usecases/webhooks/ProcessSubscriptionWebhookUseCase";
import { ProcessWebhookUseCase } from "../../../usecases/webhooks/ProcessWebhookUseCase";
import { CheckoutController } from "../controllers/CheckoutController";
import { ChargeController } from "../controllers/ChargeController";
import { ClientController } from "../controllers/ClientController";
import { DashboardController } from "../controllers/DashboardController";
import { DevController } from "../controllers/DevController";
import { WebhookController } from "../controllers/WebhookController";
import { webhookVerifier } from "../middlewares/webhookVerifier";

const clientRepo = new PgClientRepository();
const chargeRepo = new PgChargeRepository();
const messageLogRepo = new PgMessageLogRepository();
const dashboardRepo = new PgDashboardRepository();
const asaasService = new AsaasClientService();
const evolutionService = new EvolutionApiService();

const userId = env.defaultUserId;

const clientController = new ClientController(
  new ListClientsUseCase(clientRepo, userId),
  new CreateClientUseCase(clientRepo, asaasService, userId),
  new GetClientUseCase(clientRepo),
  new UpdateClientUseCase(clientRepo)
);

const chargeController = new ChargeController(
  new ListChargesUseCase(chargeRepo, userId),
  new CreateChargeUseCase(chargeRepo, clientRepo, asaasService),
  new SendPaymentReminderUseCase(chargeRepo, messageLogRepo, asaasService, evolutionService)
);

const studentRepo = new PgStudentRepository();

const dashboardController = new DashboardController(
  new GetDashboardSummaryUseCase(dashboardRepo, studentRepo, userId)
);
const subscriptionRepo = new PgSubscriptionRepository();

const checkoutController = new CheckoutController(
  new RegisterAndSubscribeUseCase(studentRepo, subscriptionRepo, asaasService),
  new GetPaymentStatusUseCase(subscriptionRepo, studentRepo, asaasService),
  new SendSubscriptionReminderUseCase(
    studentRepo,
    subscriptionRepo,
    asaasService,
    evolutionService
  )
);

const processChargeWebhook = new ProcessWebhookUseCase(
  chargeRepo,
  clientRepo,
  messageLogRepo,
  evolutionService
);
const processSubscriptionWebhook = new ProcessSubscriptionWebhookUseCase(
  subscriptionRepo,
  studentRepo
);

const webhookController = new WebhookController(
  new DetectAsaasPaymentTypeUseCase(chargeRepo, subscriptionRepo),
  new DispatchAsaasWebhookUseCase(processChargeWebhook, processSubscriptionWebhook),
  new PgWebhookAuditRepository()
);

const devController = new DevController(evolutionService);

import { AuthController } from "../controllers/AuthController";
import { LeadController } from "../controllers/LeadController";

const authController = new AuthController();
const leadController = new LeadController();

export function createRoutes(): Router {
  const router = Router();

  router.get("/clients", clientController.list);
  router.post("/clients", clientController.create);
  router.get("/clients/:id", clientController.getById);
  router.patch("/clients/:id", clientController.update);

  router.get("/charges", chargeController.list);
  router.post("/charges", chargeController.create);
  router.post("/charges/:id/send-reminder", chargeController.sendReminder);

  router.get("/dashboard/summary", dashboardController.summary);

  router.get("/checkout/plans", checkoutController.plans);
  router.post("/checkout/register-and-subscribe", checkoutController.registerAndSubscribeHandler);
  router.get("/checkout/payment-status", checkoutController.paymentStatus);
  router.post(
    "/checkout/students/:studentId/send-reminder",
    checkoutController.sendReminder
  );

  router.post("/webhooks/asaas", webhookVerifier, webhookController.asaas);

  if (env.nodeEnv === "development") {
    router.post("/dev/test-whatsapp", devController.testWhatsApp);
  }

  router.post("/auth/login", authController.login.bind(authController));
  router.post("/leads", leadController.create.bind(leadController));

  return router;
}
