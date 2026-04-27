export const IRONPAY_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_IRONPAY_API_URL || "https://api.ironpayapp.com.br/api/public/v1",
  apiToken: process.env.IRONPAY_API_TOKEN || "",
};

export interface IronPayTransaction {
  transaction_hash: string;
  status: "pending" | "paid" | "cancelled" | "expired" | "refunded";
  amount: number;
  payment_method: "pix" | "credit_card" | "boleto";
  qr_code?: string;
  qr_code_base64?: string;
  pix_copy_paste?: string;
  created_at: string;
  expires_at?: string;
  paid_at?: string;
}

export interface CreateTransactionRequest {
  amount: number;
  description: string;
  customer_name?: string;
  customer_email?: string;
  customer_document?: string;
  correlation_id?: string;
  payment_method?: "pix" | "credit_card" | "boleto";
  expires_in_minutes?: number;
}

export async function createIronPayTransaction(
  data: CreateTransactionRequest
): Promise<IronPayTransaction> {
  const amountInCents = Math.round(data.amount * 100);
  
  const response = await fetch(`${IRONPAY_CONFIG.baseUrl}/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: IRONPAY_CONFIG.apiToken,
    },
    body: JSON.stringify({
      api_token: IRONPAY_CONFIG.apiToken,
      amount: amountInCents,
      description: data.description,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_document: data.customer_document,
      correlation_id: data.correlation_id || `order_${Date.now()}`,
      payment_method: data.payment_method || "pix",
      expires_in_minutes: data.expires_in_minutes || 1440,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create transaction");
  }

  return response.json();
}

export async function getIronPayTransaction(
  transactionHash: string
): Promise<IronPayTransaction> {
  const response = await fetch(
    `${IRONPAY_CONFIG.baseUrl}/transaction/${transactionHash}`,
    {
      headers: {
        Authorization: IRONPAY_CONFIG.apiToken,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get transaction");
  }

  return response.json();
}

export async function getIronPayTransactionByCorrelation(
  correlationId: string
): Promise<IronPayTransaction> {
  const response = await fetch(
    `${IRONPAY_CONFIG.baseUrl}/transaction/correlation/${correlationId}`,
    {
      headers: {
        Authorization: IRONPAY_CONFIG.apiToken,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get transaction by correlation");
  }

  return response.json();
}

export function formatCurrencyBR(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceId: null,
    checkoutUrl: null,
    features: ["5 generations/month", "Basic templates", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29.90,
    priceId: "pro_monthly",
    checkoutUrl: "https://go.ironpayapp.com.br/bxqocxphfm",
    features: [
      "Unlimited generations",
      "All templates",
      "Priority support",
      "API access",
      "Analytics dashboard",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    price: 59.90,
    priceId: "creator_monthly",
    checkoutUrl: "https://go.ironpayapp.com.br/i71ha",
    features: [
      "Everything in Pro",
      "5 team seats",
      "White-label",
      "Custom integrations",
      "Dedicated support",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: 89.90,
    priceId: "team_monthly",
    checkoutUrl: "https://go.ironpayapp.com.br/zmu4z",
    features: [
      "Everything in Creator",
      "Unlimited team seats",
      "SSO access",
      "Audit logs",
      "SLA guarantee",
    ],
  },
];