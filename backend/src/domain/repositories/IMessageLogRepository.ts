export interface IMessageLogRepository {
  exists(chargeId: string, ruleType: string): Promise<boolean>;
  create(chargeId: string, ruleType: string): Promise<void>;
}
