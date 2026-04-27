"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Check, X, Zap, Crown, Users, Building2 } from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";
import { PRICING_PLANS, formatCurrencyBR } from "@/lib/ironpay";

const iconMap = {
  Zap: Zap,
  Crown: Crown,
  Users: Users,
  Building2: Building2,
};

export default function PricingPage() {
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);

  const planIcons = [Zap, Crown, Users, Building2];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-14">
          <h1 className="text-3xl font-semibold text-zinc-50 mb-3">Simple, Transparent Pricing</h1>
          <p className="text-zinc-500 text-lg">Start free, upgrade when you scale</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {PRICING_PLANS.map((plan, index) => {
            const Icon = planIcons[index];
            return (
              <div key={plan.id} className={`card relative ${plan.id === "pro" ? "border-violet-500/40" : ""}`}>
                {plan.id === "pro" && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-violet-600 rounded-full text-xs font-medium text-white">
                    Most Popular
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${plan.id === "pro" ? "bg-violet-600" : "bg-zinc-800"}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-50">{plan.name}</h3>
                    <p className="text-xs text-zinc-600">
                      {plan.id === "free" ? "Para começar" : plan.id === "pro" ? "Para indie hackers" : plan.id === "creator" ? "Para criadores" : "Para equipes"}
                    </p>
                  </div>
                </div>
                
                <div className="mb-5">
                  <span className="text-3xl font-semibold text-zinc-50">
                    {plan.price === 0 ? "R$0" : formatCurrencyBR(plan.price)}
                  </span>
                  <span className="text-zinc-500">{plan.price !== 0 && "/mês"}</span>
                </div>
                
                <div className="space-y-2.5 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-zinc-400">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setCheckoutPlan(plan.id)}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    plan.id === "pro"
                      ? "bg-violet-600 text-white hover:bg-violet-700"
                      : plan.price === 0
                        ? "bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10"
                        : "bg-white text-zinc-900 hover:bg-zinc-200"
                  }`}
                >
                  {plan.price === 0 ? "Começar Grátis" : `Assinar ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-zinc-300 mb-2">Pagamento seguro via PIX</h2>
            <p className="text-sm text-zinc-500">Processado pela IronPay - confirmação instantânea</p>
          </div>
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2 text-zinc-500">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              <span>IronPay</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-zinc-300 text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="text-base font-medium text-zinc-300 mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">Sim! Você pode cancelar sua assinatura a qualquer momento. Você continuará com acesso até o final do período de cobrança.</p>
            </div>
            <div className="card">
              <h3 className="text-base font-medium text-zinc-300 mb-2">Quais métodos de pagamento são aceitos?</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">Aceitamos PIX (via IronPay), cartão de crédito e débito. O PIX é processado instantaneamente.</p>
            </div>
            <div className="card">
              <h3 className="text-base font-medium text-zinc-300 mb-2">Oferecem reembolso?</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">Sim! Oferecemos garantia de 7 dias para todos os planos pagos.</p>
            </div>
            <div className="card">
              <h3 className="text-base font-medium text-zinc-300 mb-2">Posso fazer upgrade depois?</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.</p>
            </div>
          </div>
        </div>
      </main>

      <CheckoutModal
        isOpen={!!checkoutPlan}
        onClose={() => setCheckoutPlan(null)}
        planId={checkoutPlan || ""}
      />
    </div>
  );
}