import React from "react"
import { useLocation, Link } from "react-router-dom"

interface CheckoutState {
  verificationType?: string
  planId?: string
  planName?: string
  billingCycle?: "onetime" | "monthly" | "yearly"
  price?: number
  currency?: string
  [key: string]: any
}

const CheckoutPage: React.FC = () => {
  const location = useLocation()
  const state = (location.state || {}) as CheckoutState

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-semibold text-gray-900">Checkout</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-4">
          <div className="text-sm text-gray-600">Verification</div>
          <div className="text-lg font-medium text-gray-900">{state.verificationType || "Selected Service"}</div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm text-gray-600">Plan</div>
            <div className="font-medium">{state.planName || state.planId || "Selected Plan"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Billing</div>
            <div className="font-medium capitalize">{state.billingCycle || "onetime"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Price</div>
            <div className="font-medium">
              {state.currency || "₹"}
              {typeof state.price === "number" ? state.price.toFixed(2) : "-"}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Link to="/pricing" className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
            Back to Pricing
          </Link>
          <Link to="/payment-success" className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
            Proceed (Demo)
          </Link>
        </div>
      </div>

      {Object.keys(state).length > 0 && (
        <pre className="mt-6 overflow-x-auto rounded bg-gray-50 p-3 text-xs text-gray-700">
          {JSON.stringify(state, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default CheckoutPage
