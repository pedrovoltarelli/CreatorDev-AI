"use client";

import { X } from "lucide-react";
import { PRICING_PLANS } from "@/lib/ironpay";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
}

export default function CheckoutModal({ isOpen, onClose, planId }: CheckoutModalProps) {
  const plan = PRICING_PLANS.find((p) => p.id === planId);

  if (!isOpen || !plan) return null;

  const handleCheckout = () => {
    if (plan.checkoutUrl) {
      window.open(plan.checkoutUrl, "_blank");
    }
  };

  if (plan.price === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-50">{plan.name} Plan</h2>
            <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-300">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-zinc-400 mb-4">
            Você está no plano gratuito! Aproveite 5 gerações por mês.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-white text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-50">
            Assinar {plan.name}
          </h2>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-3xl font-bold text-zinc-50">
            R$ {plan.price.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-sm text-zinc-500">
            por mês • {plan.name} Plan
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-zinc-400">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </div>
          ))}
        </div>

        <button
          onClick={handleCheckout}
          className="w-full py-3 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors mb-3"
        >
          Ir para Checkout
        </button>

        <p className="text-xs text-zinc-600 text-center">
          Pagamento seguro via IronPay
        </p>
      </div>
    </div>
  );
}