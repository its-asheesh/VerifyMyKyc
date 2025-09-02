"use client"

import React, { useMemo, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { motion } from "framer-motion"
import { Check, Plus, Shield } from "lucide-react"
import type { VerificationPricing } from "../../hooks/usePricing"

const fetchVerificationPricing = async (): Promise<VerificationPricing[]> => {
  const res = await axios.get("/api/pricing/verification")
  return res.data as VerificationPricing[]
}

const AdminPricing: React.FC = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useQuery<VerificationPricing[]>({
    queryKey: ["admin-verification-pricing"],
    queryFn: fetchVerificationPricing,
    staleTime: 60_000,
  })

  const [showVoterForm, setShowVoterForm] = useState(false)
  const [showCompanyForm, setShowCompanyForm] = useState(false)
  const [showRcForm, setShowRcForm] = useState(false)

  // Voter ID form state (defaults can be adjusted)
  const [form, setForm] = useState({
    verificationType: "voterid",
    title: "Voter ID Verification",
    description: "Voter verification with direct, captcha, and OCR flows",
    oneTimePrice: 99,
    monthlyPrice: 349,
    yearlyPrice: 3499,
    oneTimeQuota: { count: 1, validityDays: 30 },
    monthlyQuota: { count: 100, validityDays: 30 },
    yearlyQuota: { count: 1200, validityDays: 365 },
    oneTimeFeatures: [
      "Direct Fetch (Boson)",
      "Captcha Flow (Meson)",
      "OCR Data Extraction",
      "Email Support",
    ] as string[],
    monthlyFeatures: [
      "Direct Fetch (Boson)",
      "Captcha Flow (Meson)",
      "OCR Data Extraction",
      "API Access",
      "Priority Support",
      "Bulk Processing",
    ] as string[],
    yearlyFeatures: [
      "Direct Fetch (Boson)",
      "Captcha Flow (Meson)",
      "OCR Data Extraction",
      "API Access",
      "24/7 Support",
      "Bulk Processing",
      "Custom Integration",
      "Dedicated Account Manager",
    ] as string[],
    highlighted: false,
    popular: true,
    color: "indigo",
  })

  // Company form state
  const [companyForm, setCompanyForm] = useState({
    verificationType: "company",
    title: "Company Verification",
    description: "MCA company verification with CIN and DIN lookups",
    oneTimePrice: 149,
    monthlyPrice: 499,
    yearlyPrice: 4999,
    oneTimeQuota: { count: 1, validityDays: 30 },
    monthlyQuota: { count: 200, validityDays: 30 },
    yearlyQuota: { count: 2400, validityDays: 365 },
    oneTimeFeatures: [
      "MCA Company Details",
      "CIN Lookup",
      "Directors (DIN) Lookup",
      "Email Support",
    ] as string[],
    monthlyFeatures: [
      "MCA Company Details",
      "CIN Lookup",
      "Directors (DIN) Lookup",
      "API Access",
      "Priority Support",
      "Bulk Processing",
    ] as string[],
    yearlyFeatures: [
      "MCA Company Details",
      "CIN Lookup",
      "Directors (DIN) Lookup",
      "API Access",
      "24/7 Support",
      "Bulk Processing",
      "Custom Integration",
      "Dedicated Account Manager",
    ] as string[],
    highlighted: false,
    popular: false,
    color: "emerald",
  })

  // RC form state
  const [rcForm, setRcForm] = useState({
    verificationType: "vehicle",
    title: "Vehicle Verification",
    description: "Vehicle RC, eChallan and FASTag verification",
    oneTimePrice: 99,
    monthlyPrice: 399,
    yearlyPrice: 3999,
    oneTimeQuota: { count: 10, validityDays: 30 },
    monthlyQuota: { count: 500, validityDays: 30 },
    yearlyQuota: { count: 5000, validityDays: 365 },
    oneTimeFeatures: [
      "Fetch RC Lite",
      "Basic Verification",
      "Email Support",
    ] as string[],
    monthlyFeatures: [
      "RC Detailed + Challan",
      "Chassis-to-RC Lookup",
      "FASTag Details",
      "API Access",
      "Priority Support",
      "Quota-aware Billing",
    ] as string[],
    yearlyFeatures: [
      "All Monthly Features",
      "24/7 Support",
      "Bulk Processing",
      "Custom Integration",
      "Dedicated Account Manager",
    ] as string[],
    highlighted: false,
    popular: true,
    color: "cyan",
  })

  const hasVoterPricing = useMemo(
    () => (data || []).some((p) => p.verificationType === "voterid"),
    [data]
  )

  const hasCompanyPricing = useMemo(
    () => (data || []).some((p) => p.verificationType === "company"),
    [data]
  )

  const hasRcPricing = useMemo(
    () => (data || []).some((p) => p.verificationType === "vehicle"),
    [data]
  )

  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axios.post("/api/pricing/verification", payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verification-pricing"] })
      setShowVoterForm(false)
      setShowCompanyForm(false)
      setShowRcForm(false)
    },
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Coerce numeric fields
    const payload = {
      ...form,
      oneTimePrice: Number(form.oneTimePrice),
      monthlyPrice: Number(form.monthlyPrice),
      yearlyPrice: Number(form.yearlyPrice),
      oneTimeQuota: {
        count: Number(form.oneTimeQuota.count),
        validityDays: Number(form.oneTimeQuota.validityDays),
      },
      monthlyQuota: {
        count: Number(form.monthlyQuota.count),
        validityDays: Number(form.monthlyQuota.validityDays),
      },
      yearlyQuota: {
        count: Number(form.yearlyQuota.count),
        validityDays: Number(form.yearlyQuota.validityDays),
      },
    }
    addMutation.mutate(payload)
  }

  const onSubmitRc = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...rcForm,
      oneTimePrice: Number(rcForm.oneTimePrice),
      monthlyPrice: Number(rcForm.monthlyPrice),
      yearlyPrice: Number(rcForm.yearlyPrice),
      oneTimeQuota: {
        count: Number(rcForm.oneTimeQuota.count),
        validityDays: Number(rcForm.oneTimeQuota.validityDays),
      },
      monthlyQuota: {
        count: Number(rcForm.monthlyQuota.count),
        validityDays: Number(rcForm.monthlyQuota.validityDays),
      },
      yearlyQuota: {
        count: Number(rcForm.yearlyQuota.count),
        validityDays: Number(rcForm.yearlyQuota.validityDays),
      },
    }
    addMutation.mutate(payload)
  }

  const onSubmitCompany = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...companyForm,
      oneTimePrice: Number(companyForm.oneTimePrice),
      monthlyPrice: Number(companyForm.monthlyPrice),
      yearlyPrice: Number(companyForm.yearlyPrice),
      oneTimeQuota: {
        count: Number(companyForm.oneTimeQuota.count),
        validityDays: Number(companyForm.oneTimeQuota.validityDays),
      },
      monthlyQuota: {
        count: Number(companyForm.monthlyQuota.count),
        validityDays: Number(companyForm.monthlyQuota.validityDays),
      },
      yearlyQuota: {
        count: Number(companyForm.yearlyQuota.count),
        validityDays: Number(companyForm.yearlyQuota.validityDays),
      },
    }
    addMutation.mutate(payload)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin • Verification Pricing</h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage per-verification pricing and quotas used across the app
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!hasVoterPricing && (
                <button
                  onClick={() => {
                    setShowVoterForm((s) => !s)
                    setShowCompanyForm(false)
                    setShowRcForm(false)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" /> Add Voter ID Pricing
                </button>
              )}
              {!hasCompanyPricing && (
                <button
                  onClick={() => {
                    setShowCompanyForm((s) => !s)
                    setShowVoterForm(false)
                    setShowRcForm(false)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" /> Add Company Pricing
                </button>
              )}
              {!hasRcPricing && (
                <button
                  onClick={() => {
                    setShowRcForm((s) => !s)
                    setShowVoterForm(false)
                    setShowCompanyForm(false)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                >
                  <Plus className="w-4 h-4" /> Add RC Pricing
                </button>
              )}
            </div>
          </div>

          {isLoading && (
            <div className="bg-white rounded-xl shadow p-6">Loading pricing…</div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              Failed to load pricing. Please retry.
            </div>
          )}

          {/* List existing verification pricing */}
          {data && data.length > 0 && (
            <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <h2 className="font-semibold">Verification Plans</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">One-time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yearly</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotas</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((p) => (
                      <tr key={p._id}>
                        <td className="px-4 py-3 font-medium text-gray-900">{p.verificationType}</td>
                        <td className="px-4 py-3">₹{p.oneTimePrice}</td>
                        <td className="px-4 py-3">₹{p.monthlyPrice}</td>
                        <td className="px-4 py-3">₹{p.yearlyPrice}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div>
                              <span className="font-medium">One-time</span>: {p.oneTimeQuota?.count ?? 0} • {p.oneTimeQuota?.validityDays ?? 0} days
                            </div>
                            <div>
                              <span className="font-medium">Monthly</span>: {p.monthlyQuota?.count ?? 0} • {p.monthlyQuota?.validityDays ?? 0} days
                            </div>
                            <div>
                              <span className="font-medium">Yearly</span>: {p.yearlyQuota?.count ?? 0} • {p.yearlyQuota?.validityDays ?? 0} days
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Voter ID pricing form */}
          {showVoterForm && !hasVoterPricing && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Add Voter ID Pricing</h3>
              <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">One-time Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={form.oneTimePrice}
                    onChange={(e) => setForm({ ...form, oneTimePrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={form.monthlyPrice}
                    onChange={(e) => setForm({ ...form, monthlyPrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Yearly Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={form.yearlyPrice}
                    onChange={(e) => setForm({ ...form, yearlyPrice: Number(e.target.value) })}
                  />
                </div>
                {/* Quotas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">One-time Count</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={form.oneTimeQuota.count}
                    onChange={(e) => setForm({ ...form, oneTimeQuota: { ...form.oneTimeQuota, count: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">One-time Validity Days</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={form.oneTimeQuota.validityDays}
                    onChange={(e) => setForm({ ...form, oneTimeQuota: { ...form.oneTimeQuota, validityDays: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Count</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={form.monthlyQuota.count}
                    onChange={(e) => setForm({ ...form, monthlyQuota: { ...form.monthlyQuota, count: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Validity Days</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={form.monthlyQuota.validityDays}
                    onChange={(e) => setForm({ ...form, monthlyQuota: { ...form.monthlyQuota, validityDays: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Yearly Count</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={form.yearlyQuota.count}
                    onChange={(e) => setForm({ ...form, yearlyQuota: { ...form.yearlyQuota, count: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Yearly Validity Days</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={form.yearlyQuota.validityDays}
                    onChange={(e) => setForm({ ...form, yearlyQuota: { ...form.yearlyQuota, validityDays: Number(e.target.value) } })}
                  />
                </div>
                <div className="md:col-span-3 flex items-center gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={addMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                  >
                    <Check className="w-4 h-4" /> {addMutation.isPending ? "Saving…" : "Save Voter Pricing"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowVoterForm(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  {addMutation.isError && (
                    <span className="text-sm text-red-600">Failed to save. Ensure voter plan does not already exist.</span>
                  )}
                  {addMutation.isSuccess && (
                    <span className="text-sm text-green-700">Saved!</span>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Add RC pricing form */}
          {showRcForm && !hasRcPricing && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Add RC Verification Pricing</h3>
              <form onSubmit={onSubmitRc} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={rcForm.title}
                    onChange={(e) => setRcForm({ ...rcForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">One-time Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={rcForm.oneTimePrice}
                    onChange={(e) => setRcForm({ ...rcForm, oneTimePrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={rcForm.monthlyPrice}
                    onChange={(e) => setRcForm({ ...rcForm, monthlyPrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Yearly Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={rcForm.yearlyPrice}
                    onChange={(e) => setRcForm({ ...rcForm, yearlyPrice: Number(e.target.value) })}
                  />
                </div>
                {/* Quotas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">One-time Count</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={rcForm.oneTimeQuota.count}
                    onChange={(e) => setRcForm({ ...rcForm, oneTimeQuota: { ...rcForm.oneTimeQuota, count: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">One-time Validity Days</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={rcForm.oneTimeQuota.validityDays}
                    onChange={(e) => setRcForm({ ...rcForm, oneTimeQuota: { ...rcForm.oneTimeQuota, validityDays: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Count</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={rcForm.monthlyQuota.count}
                    onChange={(e) => setRcForm({ ...rcForm, monthlyQuota: { ...rcForm.monthlyQuota, count: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Validity Days</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={rcForm.monthlyQuota.validityDays}
                    onChange={(e) => setRcForm({ ...rcForm, monthlyQuota: { ...rcForm.monthlyQuota, validityDays: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Yearly Count</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={rcForm.yearlyQuota.count}
                    onChange={(e) => setRcForm({ ...rcForm, yearlyQuota: { ...rcForm.yearlyQuota, count: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Yearly Validity Days</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={rcForm.yearlyQuota.validityDays}
                    onChange={(e) => setRcForm({ ...rcForm, yearlyQuota: { ...rcForm.yearlyQuota, validityDays: Number(e.target.value) } })}
                  />
                </div>
                <div className="md:col-span-3 flex items-center gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={addMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-60"
                  >
                    <Check className="w-4 h-4" /> {addMutation.isPending ? "Saving…" : "Save RC Pricing"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRcForm(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  {addMutation.isError && (
                    <span className="text-sm text-red-600">Failed to save. Ensure RC plan does not already exist.</span>
                  )}
                  {addMutation.isSuccess && (
                    <span className="text-sm text-green-700">Saved!</span>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Add Company pricing form */}
          {showCompanyForm && !hasCompanyPricing && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Add Company Verification Pricing</h3>
              <form onSubmit={onSubmitCompany} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={companyForm.title}
                    onChange={(e) => setCompanyForm({ ...companyForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">One-time Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={companyForm.oneTimePrice}
                    onChange={(e) => setCompanyForm({ ...companyForm, oneTimePrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={companyForm.monthlyPrice}
                    onChange={(e) => setCompanyForm({ ...companyForm, monthlyPrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Yearly Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={companyForm.yearlyPrice}
                    onChange={(e) => setCompanyForm({ ...companyForm, yearlyPrice: Number(e.target.value) })}
                  />
                </div>
                {/* Quotas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">One-time Count</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={companyForm.oneTimeQuota.count}
                    onChange={(e) => setCompanyForm({ ...companyForm, oneTimeQuota: { ...companyForm.oneTimeQuota, count: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">One-time Validity Days</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={companyForm.oneTimeQuota.validityDays}
                    onChange={(e) => setCompanyForm({ ...companyForm, oneTimeQuota: { ...companyForm.oneTimeQuota, validityDays: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Count</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={companyForm.monthlyQuota.count}
                    onChange={(e) => setCompanyForm({ ...companyForm, monthlyQuota: { ...companyForm.monthlyQuota, count: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Validity Days</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={companyForm.monthlyQuota.validityDays}
                    onChange={(e) => setCompanyForm({ ...companyForm, monthlyQuota: { ...companyForm.monthlyQuota, validityDays: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Yearly Count</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={companyForm.yearlyQuota.count}
                    onChange={(e) => setCompanyForm({ ...companyForm, yearlyQuota: { ...companyForm.yearlyQuota, count: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Yearly Validity Days</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                    value={companyForm.yearlyQuota.validityDays}
                    onChange={(e) => setCompanyForm({ ...companyForm, yearlyQuota: { ...companyForm.yearlyQuota, validityDays: Number(e.target.value) } })}
                  />
                </div>
                <div className="md:col-span-3 flex items-center gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={addMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                  >
                    <Check className="w-4 h-4" /> {addMutation.isPending ? "Saving…" : "Save Company Pricing"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCompanyForm(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  {addMutation.isError && (
                    <span className="text-sm text-red-600">Failed to save. Ensure company plan does not already exist.</span>
                  )}
                  {addMutation.isSuccess && (
                    <span className="text-sm text-green-700">Saved!</span>
                  )}
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminPricing
