import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Check, CreditCard, Shield, Clock, Users } from "lucide-react"
import CouponInput from "../components/common/CouponInput"
import type { CouponValidationResponse } from "../services/api/couponApi"
import { useAppSelector } from "../redux/hooks"
import {loadRazorpay} from "../utils/loadRazorpay"

interface CheckoutPageProps {}

const CheckoutPage: React.FC<CheckoutPageProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  
  // Get data from navigation state
  const {
    selectedVerifications = [],
    selectedServices = [], // Add support for selectedServices from product pages
    billingPeriod: initialBillingPeriod = 'monthly',
    productInfo,
    tierInfo,
    planDetails // Plan details from homepage
  } = location.state || {}
  
  // Debug the navigation state
  console.log('=== NAVIGATION STATE DEBUG ===')
  console.log('location.state:', location.state)
  console.log('selectedVerifications:', selectedVerifications)
  console.log('selectedServices:', selectedServices)
  console.log('productInfo:', productInfo)
  console.log('tierInfo:', tierInfo)
  console.log('planDetails:', planDetails)
  
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
  const [billingPeriod, setBillingPeriod] = useState<'one-time' | 'monthly' | 'yearly'>(
    initialBillingPeriod || 'monthly'
  )
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card')
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
      allSelectedServices.forEach((serviceType: string) => {
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

  // Debug logging for coupon validation
  console.log('Coupon validation debug:', {
    planDetails,
    selectedVerifications,
    selectedServices,
    allSelectedServices,
    serviceType,
    category,
    includesVerifications: planDetails?.includesVerifications,
    productInfo: productInfo ? {
      title: productInfo.title,
      id: productInfo.id
    } : undefined
  })

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
      navigate(`/payment-success?orderId=${order.orderId}&amount=${total}&service=${encodeURIComponent(order.serviceName)}`, {
        state: { selectedPlan: planDetails?.planName, billingPeriod, total, orderId: order.orderId }
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

    const rzp = new Razorpay(options)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-1">Complete your verification service purchase</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Services */}
            {allSelectedServices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Selected Services</h2>
                <div className="space-y-4">
                  {allSelectedServices.map((serviceType: string) => (
                    <div key={serviceType} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <span className="text-2xl">{getVerificationIcon(serviceType)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{getVerificationName(serviceType)}</h3>
                        <p className="text-sm text-gray-600">Included in your plan</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Billing Period Selection */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Period</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'one-time', label: 'One-Time', description: 'Pay once for lifetime access' },
                  { id: 'monthly', label: 'Monthly', description: 'Billed monthly' },
                  { id: 'yearly', label: 'Yearly', description: 'Save 15% with yearly billing' }
                ].map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setBillingPeriod(period.id as any)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      billingPeriod === period.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">{period.label}</h3>
                      <p className="text-sm text-gray-600">{period.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div> */}

            {/* Coupon Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply Coupon</h2>
              <CouponInput
                orderAmount={subtotal}
                onCouponApplied={setAppliedCoupon}
                onCouponRemoved={() => setAppliedCoupon(null)}
                appliedCoupon={appliedCoupon}
                serviceType={serviceType}
                category={category}
              />
            </motion.div>

            {/* Payment Method */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-4">
                {[
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'upi', label: 'UPI Payment', icon: Shield },
                  { id: 'netbanking', label: 'Net Banking', icon: Users }
                ].map((method) => {
                  const IconComponent = method.icon
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium text-gray-900">{method.label}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div> */}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {planDetails ? planDetails.name : 'Subtotal'}
                  </span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && !appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({billingPeriod === 'yearly' ? 'Yearly' : 'Monthly'} Savings)</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                {appliedCoupon && appliedCoupon.coupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount ({appliedCoupon.coupon.code})</span>
                    <span>-₹{appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-sm text-gray-500 text-right">
                      Billed annually
                    </p>
                  )}
                </div>
              </div>

              {/* Plan Features - Show when plan details are available */}
              {planDetails && (
                <div className="space-y-3 mb-6">
                  <h3 className="font-medium text-gray-900">Plan Features:</h3>
                  {planDetails.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Additional Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>99.9% Accuracy Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>3 Second Verification</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span>Bank-Grade Security</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay ₹${total.toFixed(2)}`
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

