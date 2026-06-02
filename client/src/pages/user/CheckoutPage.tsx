import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Shield, Clock, Users } from "lucide-react"
import { BackButton } from "../../components/common/BackButton"
import CouponInput from "../../components/common/CouponInput"
import type { CouponValidationResponse } from "../../services/api/couponApi"
import { useAppSelector } from "../../redux/hooks"
import { loadRazorpay } from "../../utils/loadRazorpay"
import type { RootState } from "../../redux/store"

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth)

  // Get data from navigation state
  const {
    selectedVerifications = [],
    selectedServices = [], // Add support for selectedServices from product pages
    billingPeriod: initialBillingPeriod = 'monthly',
    productInfo,
    tierInfo,
    planDetails, // Plan details from homepage
    returnTo
  } = location.state || {}

  // Debug the navigation state


  // Combine selectedVerifications and selectedServices
  const allSelectedServices = [...selectedVerifications, ...selectedServices]

  // Route guard: redirect unauthenticated users to login with intended state
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          message: 'Please login to continue to checkout',
          redirectTo: '/checkout',
          nextState: location.state || {}
        }
      })
    }
  }, [isAuthenticated, navigate, location.state])

  // Set initial state based on passed data
  const [billingPeriod] = useState<'one-time' | 'monthly' | 'yearly'>(
    initialBillingPeriod || 'monthly'
  )
  const [paymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResponse | null>(null)

  // Calculate totals based on selected services or plan details
  const calculateTotals = () => {
    let subtotal = 0
    let billingDiscount = 0
    let couponDiscount = 0
    let total = 0

    // If we have plan details from homepage, use that
    if (planDetails) {
      // Extract price from plan details (remove ₹ symbol if present)
      const priceString = planDetails.price.toString().replace('₹', '')
      subtotal = parseFloat(priceString)
    }
    // If we have tier info from product page, use that
    else if (tierInfo) {
      subtotal = parseFloat(tierInfo.price)
    } else {
      // Calculate from selected verifications
      allSelectedServices.forEach(() => {
        // Use fixed pricing for now - you can integrate with backend pricing later
        const basePrice = 200 // Base price per service
        switch (billingPeriod) {
          case 'one-time':
            subtotal += basePrice * 0.8 // 20% discount for one-time
            break
          case 'monthly':
            subtotal += basePrice
            break
          case 'yearly':
            subtotal += basePrice * 12 * 0.85 // 15% discount for yearly
            break
        }
      })
    }

    // Apply discount for yearly billing with multiple services (only for custom selections)
    if (billingPeriod === 'yearly' && allSelectedServices.length > 1 && !planDetails) {
      billingDiscount = subtotal * 0.15 // 15% discount for yearly multi-service
    }

    // Apply coupon discount if available
    if (appliedCoupon) {
      couponDiscount = appliedCoupon.discount
    }

    total = subtotal - billingDiscount - couponDiscount

    // Format all amounts to 2 decimal places
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round((billingDiscount + couponDiscount) * 100) / 100,
      total: Math.round(total * 100) / 100
    }
  }

  const { subtotal, discount, total } = calculateTotals()

  // Determine service type and category for coupon validation
  const getServiceInfo = () => {
    // First, check if we have selected services from product pages
    if (allSelectedServices.length > 0) {
      // For verifications, use the first verification type
      const serviceType = allSelectedServices[0]
      let category = 'personal' // default category

      // Map verification types to categories
      if (['gstin', 'mca', 'company'].includes(serviceType)) {
        category = 'business'
      } else if (['aadhaar', 'pan', 'drivinglicense'].includes(serviceType)) {
        category = 'personal'
      }

      return { serviceType, category }
    }
    // Then check for product info from product pages
    else if (productInfo) {
      // Extract verification type from product title
      const getVerificationType = (productTitle: string): string => {
        const title = productTitle.toLowerCase()
        // Important: detect company/MCA first to avoid matching 'pan' inside 'company'
        if (title.includes('company') || title.includes('mca') || title.includes('cin') || title.includes('din')) return 'company'
        if (title.includes('pan')) return 'pan'
        if (title.includes('aadhaar')) return 'aadhaar'
        if (title.includes('driving license') || title.includes('drivinglicense')) return 'drivinglicense'
        if (title.includes('gstin')) return 'gstin'
        return ''
      }

      const serviceType = getVerificationType(productInfo.title)
      if (serviceType) {
        let category = 'personal'
        if (['gstin', 'mca', 'company'].includes(serviceType)) {
          category = 'business'
        } else if (['aadhaar', 'pan', 'drivinglicense'].includes(serviceType)) {
          category = 'personal'
        }
        return { serviceType, category }
      }
    }
    // Then check for plan details from homepage
    else if (planDetails) {
      // For plans, check if they have included verifications
      if (planDetails.includesVerifications && planDetails.includesVerifications.length > 0) {
        // Use the first verification type from the plan's included verifications
        const serviceType = planDetails.includesVerifications[0]
        let category = 'personal' // default category

        // Map verification types to categories
        if (['gstin', 'mca', 'company'].includes(serviceType)) {
          category = 'business'
        } else if (['aadhaar', 'pan', 'drivinglicense'].includes(serviceType)) {
          category = 'personal'
        }

        return { serviceType, category }
      } else {
        // If no specific verifications, use the plan name as service type
        return {
          serviceType: planDetails.planName.toLowerCase().replace(/\s+/g, '-'),
          category: 'plan'
        }
      }
    }

    return { serviceType: undefined, category: undefined }
  }

  const { serviceType, category } = getServiceInfo()



  const handleCheckout = async () => {
    setIsProcessing(true)

    try {
      // 1️⃣ Create order in backend
      const orderData = {
        orderType: planDetails ? 'plan' : 'verification',
        serviceName: planDetails ? planDetails.planName : 'Custom Verification Service',
        serviceDetails: planDetails ? {
          planName: planDetails.planName,
          planType: billingPeriod,
          features: planDetails.features
        } : {
          verificationType: allSelectedServices.join(', '),
          features: allSelectedServices.map((type: string) => `${type} verification`)
        },
        totalAmount: subtotal,
        finalAmount: total,
        billingPeriod,
        paymentMethod,
        ...(appliedCoupon && {
          couponApplied: {
            couponId: appliedCoupon.coupon.id,
            code: appliedCoupon.coupon.code,
            discount: appliedCoupon.discount,
            discountType: appliedCoupon.coupon.discountType,
            discountValue: appliedCoupon.coupon.discountValue
          }
        })
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) throw new Error('Order creation failed')

      const { data } = await response.json()
      const order = data.order
      const { razorpayOrderId, amount, currency } = data

      // 2️⃣ Load Razorpay
      const Razorpay = await loadRazorpay()
      if (!Razorpay) {
        setIsProcessing(false)
        return
      }

      // 3️⃣ Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // Your Razorpay key from env
        amount: amount, // in paise
        currency: currency,
        name: 'Your App Name',
        description: order.serviceName,
        order_id: razorpayOrderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/orders/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order.orderId  // your internal orderId
              })
            });

            if (verifyRes.ok) {
              // ✅ Payment verified and order activated
              const returnToParam = returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ''
              navigate(`/payment-success?orderId=${order.orderId}&amount=${total}&service=${encodeURIComponent(order.serviceName)}${returnToParam}`, {
                state: { selectedPlan: planDetails?.planName, billingPeriod, total, orderId: order.orderId, returnTo }
              });
            } else {
              const data = await verifyRes.json();
              alert(`Payment verification failed: ${data.message}`);
              navigate('/payment-failed');
            }
          } catch (error) {
            console.error('Verification failed:', error);
            alert('Payment verification failed. Please contact support.');
            navigate('/payment-failed');
          }
        },
        prefill: {
          name: '', // optionally fill from user profile
          email: '',
          contact: ''
        },
        theme: { color: '#5B21B6' }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (Razorpay as any)(options)
      rzp.open()
      setIsProcessing(false)

    } catch (error) {
      console.error('Checkout error:', error)
      setIsProcessing(false)
      alert('Payment failed. Please try again.')
    }
  }


  const getVerificationIcon = (verificationType: string) => {
    switch (verificationType) {
      case 'aadhaar':
        return '🆔'
      case 'pan':
        return '💳'
      case 'drivinglicense':
        return '🚗'
      case 'gstin':
        return '🏢'
      case 'company':
        return '🏢'
      default:
        return '📄'
    }
  }

  const getVerificationName = (verificationType: string) => {
    switch (verificationType) {
      case 'aadhaar':
        return 'Aadhaar Verification'
      case 'pan':
        return 'PAN Verification'
      case 'drivinglicense':
        return 'Driving License Verification'
      case 'gstin':
        return 'GSTIN Verification'
      case 'company':
        return 'Company Verification'
      default:
        return verificationType
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <BackButton className="mb-0" />
            <div className="h-6 w-px bg-gray-200"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">

            {/* Order Details Section */}
            <section>
              {allSelectedServices.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</span>
                    <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {allSelectedServices.map((serviceType: string) => (
                      <div key={serviceType} className="flex items-start gap-4 p-6 hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
                          {getVerificationIcon(serviceType)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{getVerificationName(serviceType)}</h3>
                          <p className="text-sm text-gray-600 mt-1">Professional verification service with API access</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                              <Check className="w-3 h-3" />
                              Instant Result
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                              <Shield className="w-3 h-3" />
                              Verified
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : planDetails ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</span>
                    <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{planDetails.planName}</h3>
                        <p className="text-gray-500 mt-1">{planDetails.description || 'Professional plan subscription'}</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-2xl font-bold text-gray-900">{planDetails.price}</span>
                        <span className="text-sm text-gray-500 capitalize">/{billingPeriod}</span>
                      </div>
                    </div>

                    {planDetails.features && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Included Features:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {planDetails.features.map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </section>

            {/* Coupon Section */}
            <section>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">2</span>
                  <h2 className="text-lg font-bold text-gray-900">Offers & Discounts</h2>
                </div>
                <div className="p-6">
                  <CouponInput
                    orderAmount={subtotal}
                    onCouponApplied={setAppliedCoupon}
                    onCouponRemoved={() => setAppliedCoupon(null)}
                    appliedCoupon={appliedCoupon}
                    serviceType={serviceType}
                    category={category}
                  />
                </div>
              </motion.div>
            </section>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg sticky top-24 overflow-hidden"
            >
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && !appliedCoupon && (
                  <div className="flex justify-between items-center text-green-600 text-sm">
                    <span>Savings ({billingPeriod})</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                {appliedCoupon && appliedCoupon.coupon && (
                  <div className="flex justify-between items-center text-green-600 text-sm bg-green-50 p-2 rounded-lg border border-green-100">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Coupon ({appliedCoupon.coupon.code})
                    </span>
                    <span>-₹{appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-base font-semibold text-gray-900">Total Amount</span>
                    <span className="text-3xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-xs text-gray-500 text-right">Billed annually</p>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform active:scale-[0.98] ${isProcessing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25'
                    }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Pay Securely</span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 py-2 opacity-60 grayscale">
                  {/* Placeholder for payment icons if needed, or just text */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Shield className="w-3 h-3" />
                    <span>SSL Encrypted Payment</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">100% Secure Guarantee</p>
                    <p className="text-xs text-gray-500 mt-0.5">Your payment information is encrypted and processed securely.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trust Signals */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-blue-600">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-gray-600">Instant Access</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-purple-600">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-gray-600">24/7 Support</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-green-600">
                  <Shield className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-gray-600">Data Privacy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

