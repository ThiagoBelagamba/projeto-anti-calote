import axios, { AxiosInstance } from "axios";
import { env } from "../../config/env";
import { parseAsaasAxiosError } from "../../shared/asaasErrors";

export interface CreateCustomerParams {
  name: string;
  cpfCnpj: string;
  email?: string;
  mobilePhone?: string;
}

export interface CreatePixChargeParams {
  customerId: string;
  value: number;
  dueDate: string;
  description: string;
}

export interface AsaasCustomerResponse {
  id: string;
  deleted?: boolean;
}

export interface AsaasCustomerListResponse {
  data: AsaasCustomerResponse[];
}

export interface AsaasPaymentResponse {
  id: string;
  status: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  pixCopyAndPaste?: string;
  encodedImage?: string;
  subscription?: string;
}

export interface CreditCardInput {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface CreditCardHolderInfoInput {
  name: string;
  email: string;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  phone: string;
}

export interface CreateSubscriptionParams {
  customerId: string;
  value: number;
  cycle: "MONTHLY" | "YEARLY";
  description: string;
  creditCard: CreditCardInput;
  creditCardHolderInfo: CreditCardHolderInfoInput;
}

export interface AsaasSubscriptionResponse {
  id: string;
  status: string;
}

export interface AsaasPaymentStatusResponse {
  id: string;
  status: string;
  confirmedDate?: string;
}

export class AsaasClientService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.asaasApiUrl,
      headers: {
        access_token: env.asaasApiKey,
        "Content-Type": "application/json",
      },
    });
  }

  async findCustomerByDocument(cpfCnpj: string): Promise<string | null> {
    try {
      const digits = cpfCnpj.replace(/\D/g, "");
      const { data } = await this.client.get<AsaasCustomerListResponse>("/customers", {
        params: { cpfCnpj: digits, limit: 1 },
      });
      const customer = data.data?.[0];
      if (customer?.id && !customer.deleted) {
        return customer.id;
      }
      return null;
    } catch (err) {
      throw parseAsaasAxiosError(err);
    }
  }

  async createCustomer(params: CreateCustomerParams): Promise<string> {
    try {
      const { data } = await this.client.post<AsaasCustomerResponse>("/customers", {
        name: params.name,
        cpfCnpj: params.cpfCnpj.replace(/\D/g, ""),
        email: params.email,
        mobilePhone: params.mobilePhone?.replace(/\D/g, ""),
      });
      return data.id;
    } catch (err) {
      throw parseAsaasAxiosError(err);
    }
  }

  async createPixCharge(params: CreatePixChargeParams): Promise<{
    paymentId: string;
    pixPayload: string;
    paymentUrl: string | null;
  }> {
    const { data } = await this.client.post<AsaasPaymentResponse>("/payments", {
      customer: params.customerId,
      billingType: "PIX",
      value: params.value,
      dueDate: params.dueDate,
      description: params.description,
    });

    let pixPayload = data.pixCopyAndPaste || "";

    if (!pixPayload && data.id) {
      try {
        const pixResponse = await this.client.get<{ payload: string }>(
          `/payments/${data.id}/pixQrCode`
        );
        pixPayload = pixResponse.data.payload || "";
      } catch {
        pixPayload = "";
      }
    }

    return {
      paymentId: data.id,
      pixPayload,
      paymentUrl: this.resolvePaymentPageUrl(data),
    };
  }

  async getPayment(paymentId: string): Promise<AsaasPaymentResponse> {
    const { data } = await this.client.get<AsaasPaymentResponse>(
      `/payments/${paymentId}`
    );
    return data;
  }

  /** Link da fatura Asaas (página de pagamento), sem código PIX na URL. */
  resolvePaymentPageUrl(payment: AsaasPaymentResponse): string | null {
    return payment.invoiceUrl || payment.bankSlipUrl || null;
  }

  async listPaymentsBySubscription(
    subscriptionId: string,
    status?: string
  ): Promise<AsaasPaymentResponse[]> {
    const params: Record<string, string | number> = {
      subscription: subscriptionId,
      limit: 10,
    };
    if (status) params.status = status;

    const { data } = await this.client.get<{ data: AsaasPaymentResponse[] }>(
      "/payments",
      { params }
    );
    return data.data ?? [];
  }

  async resolveSubscriptionPaymentUrl(
    asaasSubscriptionId: string,
    asaasPaymentId?: string | null
  ): Promise<string | null> {
    if (asaasPaymentId) {
      const payment = await this.getPayment(asaasPaymentId);
      const url = this.resolvePaymentPageUrl(payment);
      if (url) return url;
    }

    for (const status of ["OVERDUE", "PENDING", undefined]) {
      const payments = await this.listPaymentsBySubscription(
        asaasSubscriptionId,
        status
      );
      for (const payment of payments) {
        const url = this.resolvePaymentPageUrl(payment);
        if (url) return url;
      }
    }

    return null;
  }

  async createSubscriptionWithCard(params: CreateSubscriptionParams): Promise<{
    subscriptionId: string;
    paymentId: string | null;
    status: string;
    invoiceUrl?: string;
  }> {
    try {
      return await this.createSubscriptionWithCardInternal(params);
    } catch (err) {
      throw parseAsaasAxiosError(err);
    }
  }

  private async createSubscriptionWithCardInternal(
    params: CreateSubscriptionParams
  ): Promise<{
    subscriptionId: string;
    paymentId: string | null;
    status: string;
    invoiceUrl?: string;
  }> {
    const { data } = await this.client.post<AsaasSubscriptionResponse>("/subscriptions", {
      customer: params.customerId,
      billingType: "CREDIT_CARD",
      value: params.value,
      cycle: params.cycle,
      description: params.description,
      creditCard: {
        holderName: params.creditCard.holderName,
        number: params.creditCard.number.replace(/\s/g, ""),
        expiryMonth: params.creditCard.expiryMonth,
        expiryYear: params.creditCard.expiryYear,
        ccv: params.creditCard.ccv,
      },
      creditCardHolderInfo: {
        name: params.creditCardHolderInfo.name,
        email: params.creditCardHolderInfo.email,
        cpfCnpj: params.creditCardHolderInfo.cpfCnpj.replace(/\D/g, ""),
        postalCode: params.creditCardHolderInfo.postalCode.replace(/\D/g, ""),
        addressNumber: params.creditCardHolderInfo.addressNumber,
        phone: params.creditCardHolderInfo.phone.replace(/\D/g, ""),
      },
    });

    let paymentId: string | null = null;
    let invoiceUrl: string | undefined;

    try {
      const paymentsRes = await this.client.get<{ data: AsaasPaymentResponse[] }>(
        "/payments",
        { params: { subscription: data.id, limit: 1 } }
      );
      const firstPayment = paymentsRes.data.data?.[0];
      if (firstPayment) {
        paymentId = firstPayment.id;
        invoiceUrl = firstPayment.invoiceUrl;
      }
    } catch {
      // payment may not be listed immediately
    }

    return {
      subscriptionId: data.id,
      paymentId,
      status: data.status,
      invoiceUrl,
    };
  }

  async getPaymentStatus(paymentId: string): Promise<{
    confirmed: boolean;
    status: string;
  }> {
    const { data } = await this.client.get<AsaasPaymentStatusResponse>(
      `/payments/${paymentId}`
    );
    const confirmed =
      data.status === "RECEIVED" ||
      data.status === "CONFIRMED" ||
      !!data.confirmedDate;
    return { confirmed, status: data.status };
  }
}
