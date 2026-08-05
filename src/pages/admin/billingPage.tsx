import { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscirptionservcies';
import { useNavigate } from 'react-router';
import { formatCurrency, formatEnumLabel } from '../../utils/formatters';
import { formatFullDate } from '../../utils/dateHelpers';

export default function BillingPage() {
  const { history, loading, currentPlan, subscriptionStatus, expiresAt, isExpired } = useSubscription();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-[var(--text-main)]">Billing</h1>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
        <p className="text-sm text-[var(--text-muted)] mb-1">Current plan</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-[var(--text-main)]">{formatEnumLabel(currentPlan)}</p>
          {currentPlan !== 'enterprise' && (
            <button
              onClick={() => navigate('/premium')}
              className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg px-4 py-2"
            >
              Upgrade
            </button>
          )}
        </div>

        {isExpired && (
          <p className="text-sm text-amber-600 mt-2">
            Your plan expired on {expiresAt ? formatFullDate(expiresAt) : 'unknown date'}. Renew to restore full access.
          </p>
        )}
        {subscriptionStatus === 'rejected' && (
          <p className="text-sm text-red-600 mt-2">Your last payment was rejected. Please resubmit.</p>
        )}
        {subscriptionStatus === 'pending' && (
          <p className="text-sm text-[var(--text-muted)] mt-2">Your payment is under review.</p>
        )}
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
        <h2 className="font-semibold text-[var(--text-main)] mb-4">Payment history</h2>
        {loading ? (
          <p className="text-sm text-[var(--text-muted)]">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No payments submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between text-sm border-t border-[var(--border-subtle)] pt-3">
                <div>
                  <p className="text-[var(--text-main)] font-medium">{formatEnumLabel(h.plan_tier)}</p>
                  <p className="text-[var(--text-muted)] text-xs">{formatFullDate(h.created_at ?? '')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[var(--text-main)]">{formatCurrency(h.amount_paid, h.currency ?? 'NGN')}</p>
                  <span
                    className={`text-xs font-medium ${
                      h.status === 'active' ? 'text-accent-600' : h.status === 'rejected' ? 'text-red-600' : 'text-amber-600'
                    }`}
                  >
                    {formatEnumLabel(h.status ?? 'pending')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}