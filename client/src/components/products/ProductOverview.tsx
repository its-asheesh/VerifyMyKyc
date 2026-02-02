"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Star,
  Users,
  Zap,
  Shield,
} from "lucide-react";
import type { Product } from "../../types/product";

import { useQuery } from "@tanstack/react-query";
import { reviewApi } from "../../services/api/reviewApi";
import { useVerificationPricing } from "../../hooks/usePricing";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchActiveServices } from "../../redux/slices/orderSlice";
import { getProductContent } from "../../data/productContent";
import { ProductShortHighlights } from "./ProductShortHighlights";

interface ProductOverviewProps {
  product: Product;
}

export const ProductOverview: React.FC<ProductOverviewProps> = ({ product }) => {
  const [buyPromptOpen, setBuyPromptOpen] = useState(false);
  const [awaitingAccessCheck, setAwaitingAccessCheck] = useState(false);
  const buyPromptTimerRef = React.useRef<number | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { activeServices } = useAppSelector((state) => state.orders);

  // Ensure we have user's active services when authenticated
  React.useEffect(() => {
    if (isAuthenticated && !activeServices) {
      dispatch(fetchActiveServices());
    }
  }, [isAuthenticated, activeServices, dispatch]);

  // Extract lowercase identifiers for matching
  const title = product.title.toLowerCase();
  const categoryName = product.category.name.toLowerCase();

  // Detection logic for verification types
  const isAadhaarProduct = title.includes("aadhaar") || categoryName.includes("aadhaar");
  const isPanProduct = /\bpan\b/.test(title) || /\bpan\b/.test(categoryName);
  const isDrivingLicenseProduct = title.includes("driving") || categoryName.includes("driving");
  const isVoterProduct = title.includes("voter") || categoryName.includes("voter");
  const isGstinProduct =
    title.includes("gstin") ||
    categoryName.includes("gstin") ||
    title.includes("gst") ||
    categoryName.includes("gst");
  const isCompanyProduct =
    title.includes("company") ||
    categoryName.includes("company") ||
    title.includes("mca") ||
    title.includes("cin") ||
    title.includes("din");
  const isEpfoProduct = title.includes("epfo") || title.includes("uan") || categoryName.includes("epfo");
  const isBankProduct =
    title.includes("bank") ||
    categoryName.includes("bank") ||
    title.includes("bank account") ||
    categoryName.includes("bank account") ||
    title.includes("bankaccount") ||
    title.includes("ifsc") ||
    title.includes("upi");
  const isRcProduct =
    (product.id || "").toLowerCase() === "vehicle" ||
    title.includes("registration certificate") ||
    /\bvehicle\b/.test(title);
  const isPassportProduct =
    (product.id || "").toLowerCase() === "passport" ||
    title.includes("passport") ||
    /\bpassport\b/.test(title);
  const isCcrvProduct =
    (product.id || "").toLowerCase() === "ccrv" ||
    title.includes("criminal") ||
    title.includes("ccrv") ||
    title.includes("court record") ||
    categoryName.includes("criminal") ||
    categoryName.includes("ccrv");

  // ✅ Define getVerificationType BEFORE it's used
  const getVerificationType = (prod: Product): string => {
    const id = (prod.id || "").toLowerCase();
    const validTypes = [
      'aadhaar',
      'pan',
      'drivinglicense',
      'gstin',
      'company',
      'voterid',
      'bank-account',
      'vehicle',
      'passport',
      'ccrv',
      'epfo'
    ];
    if (validTypes.includes(id)) return id;

    const t = (prod.title || '').toLowerCase();
    if (t.includes('company') || t.includes('mca') || t.includes('cin') || t.includes('din')) return 'company';
    if (t.includes('pan')) return 'pan';
    if (t.includes('aadhaar')) return 'aadhaar';
    if (t.includes('driving license') || t.includes('drivinglicense')) return 'drivinglicense';
    if (t.includes('gstin')) return 'gstin';
    if (t.includes('voter')) return 'voterid';
    if (t.includes('bank account') || t.includes('bankaccount') || t.includes('banking')) return 'bankaccount';
    if (t.includes('vehicle') || t.includes('registration certificate')) return 'vehicle';
    if (t.includes('passport')) return 'passport';
    if (t.includes('criminal') || t.includes('ccrv') || t.includes('court record')) return 'ccrv';
    if (t.includes('epfo') || t.includes('uan')) return 'epfo';
    return 'other';
  };

  const verificationType = getVerificationType(product);

  // Fetch reviews
  const { data: reviewsData } = useQuery({
    queryKey: ["product-reviews", product.id],
    queryFn: () => reviewApi.getProductReviews(product.id, { page: 1, limit: 1 }),
    staleTime: 30_000,
  });

  const avg = reviewsData?.stats?.avgRating ?? 0;
  const count = reviewsData?.stats?.count ?? 0;
  const avgDisplay = count > 0 ? avg.toFixed(1) : "0.0";

  // Generate a consistent random number between 500-1000 for each product based on product ID
  // If actual users exceed 1000, show actual count instead
  const generateUserCount = (productId: string, actualUsers?: number): string => {
    // If actual users exist and exceed 1000, use actual count
    if (actualUsers !== undefined && actualUsers > 1000) {
      return actualUsers.toLocaleString()
    }

    // Otherwise, generate consistent random number between 500-1000
    // Use product ID as seed for consistent random number
    let hash = 0
    for (let i = 0; i < productId.length; i++) {
      const char = productId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    // Generate number between 500 and 1000
    const randomNum = Math.abs(hash) % 501 + 500
    return randomNum.toLocaleString()
  }

  // Check if product has actual user count (from stats or analytics)
  const actualUsers = (product as any).userCount || (product as any).stats?.userCount || undefined
  const userCount = generateUserCount(product.id, actualUsers)

  // Fetch pricing
  const { data: pricingData } = useVerificationPricing(verificationType);

  // Handle Buy Now
  const handleBuyNow = () => {
    // Don't allow purchase if product is inactive
    if (!product.isActive) {
      return;
    }

    if (!pricingData) {
      console.error("Pricing data not available");
      return;
    }

    const oneTimePrice = Number(pricingData.oneTimePrice);
    if (isNaN(oneTimePrice) || oneTimePrice <= 0) {
      console.error("Invalid price:", pricingData.oneTimePrice);
      return;
    }

    const tierInfo = {
      service: verificationType,
      label: product.title,
      price: oneTimePrice, // ✅ Numeric price
      billingPeriod: "one-time",
      originalPrice: oneTimePrice,
      discount: 0,
    };

    navigate("/checkout", {
      state: {
        selectedPlan: "one-time",
        billingPeriod: "one-time",
        selectedServices: [verificationType],
        productInfo: {
          id: product.id,
          title: product.title,
          description: product.description,
          image: product.image,
          category: product.category.name,
        },
        tierInfo,
        totalAmount: oneTimePrice, // ✅ Pass amount as number
        returnTo: `/products/${product.id}`,
      },
    });
  };

  // Navigate to verification page
  const navigateToVerification = () => {
    navigate(`/verification/${verificationType}?productId=${product.id}`);
  };

  // Determine if user has active access for THIS product's verification type
  const hasActiveAccessForProduct = (services: typeof activeServices | null | undefined): boolean => {
    if (!services) return false;
    const now = new Date();

    // 1) Active verification order matching this verification type
    const verOk = (services.verifications || []).some((v) => {
      const notExpired = !v.endDate || new Date(v.endDate) > now;
      const isActive = v.status === "active" && notExpired;
      if (!isActive) return false;
      const vt = (v.serviceDetails?.verificationType || "").toLowerCase();
      return vt.includes(verificationType);
    });

    if (verOk) return true;

    // 2) Active plan that includes this verification in its features (best-effort)
    const planOk = (services.plans || []).some((p) => {
      const notExpired = !p.endDate || new Date(p.endDate) > now;
      const isActive = p.status === "active" && notExpired;
      if (!isActive) return false;
      const features = p.serviceDetails?.features || [];
      return features.some((f) => (f || "").toLowerCase().includes(verificationType));
    });

    return planOk;
  };

  // Handle Try Demo / Start Verification CTA
  const handleTryDemo = () => {
    // Don't allow access if product is inactive
    if (!product.isActive) {
      return;
    }

    // Ensure active services are loaded before deciding access
    if (isAuthenticated && !activeServices) {
      setAwaitingAccessCheck(true);
      dispatch(fetchActiveServices());
      // Fallback: if services don't load in time, show popup so user isn't blocked
      if (buyPromptTimerRef.current) {
        window.clearTimeout(buyPromptTimerRef.current);
      }
      buyPromptTimerRef.current = window.setTimeout(() => {
        if (awaitingAccessCheck && !activeServices) {
          setBuyPromptOpen(true);
          setAwaitingAccessCheck(false);
        }
      }, 1500);
      return; // wait for state to update; decide in effect below
    }

    const bypassAccess = isAadhaarProduct || isCcrvProduct; // Temporary: allow Aadhaar/CCRV without plan
    const hasAccess = bypassAccess ? true : hasActiveAccessForProduct(activeServices);

    if (!hasAccess) {
      setBuyPromptOpen(true);
      return;
    }

    navigateToVerification();
  };

  // When we were waiting for services to load, decide what to do once loaded
  React.useEffect(() => {
    if (!awaitingAccessCheck || !activeServices) return;

    // Don't allow access if product is inactive
    if (!product.isActive) {
      setAwaitingAccessCheck(false);
      return;
    }

    // Clear fallback timer if any
    if (buyPromptTimerRef.current) {
      window.clearTimeout(buyPromptTimerRef.current);
      buyPromptTimerRef.current = null;
    }

    setAwaitingAccessCheck(false);

    const bypassAccess = isAadhaarProduct || isCcrvProduct;
    const hasAccess = bypassAccess ? true : hasActiveAccessForProduct(activeServices);

    if (!hasAccess) setBuyPromptOpen(true);
    else navigateToVerification();
  }, [awaitingAccessCheck, activeServices, product.isActive]);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (buyPromptTimerRef.current) {
        window.clearTimeout(buyPromptTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left: Product Image */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-lg">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-56 object-contain"
          />
        </div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right: Product Details */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-6"
      >
        {/* Category Badge and Ratings */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
            <Shield className="w-4 h-4" />
            {product.category.name}
          </div>

          {/* Ratings - Compact Inline */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(avg)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                    }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {count > 0 ? avgDisplay : "0.0"}
            </span>
            {count > 0 && (
              <span className="text-xs text-gray-500">
                ({count})
              </span>
            )}
          </div>
        </div>



        {/* Title */}
        {/* <h2 className="text-3xl font-bold text-gray-900">{product.title}</h2> */}

        {/* Description */}
        {/* <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p> */}

        {/* Short Highlights - replaces Key Services */}
        {(() => {
          const productContent = getProductContent(product.id);
          if (productContent?.shortHighlights) {
            return <ProductShortHighlights highlights={productContent.shortHighlights} />;
          }
          // Fallback to services if no content data
          if (product.services && product.services.length > 0) {
            return (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Key Services</h3>
                <div className="grid grid-cols-1 gap-3">
                  {product.services?.slice(0, 4).map((services, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{services}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Stats */}
        {/* <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{avgDisplay}</div>
            <div className="text-sm text-gray-600">
              Rating{count > 0 ? ` • ${count} reviews` : ""}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userCount}</div>
            <div className="text-sm text-gray-600">Users</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
        </div> */}

        {/* CTA Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${product.isActive && !isCcrvProduct
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            onClick={handleBuyNow}
            disabled={!product.isActive || isCcrvProduct}
          >
            {isCcrvProduct ? "Coming Soon" : (product.isActive
              ? pricingData
                ? `Buy Now - ₹${Number(pricingData.oneTimePrice).toFixed(2)}`
                : "Buy Now"
              : "Coming Soon")}
          </button>
          <button
            className={`px-6 py-3 border rounded-xl font-bold transition-all duration-300 ${product.isActive && !isCcrvProduct
              ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white shadow-sm hover:shadow-md"
              : "border-gray-200 text-gray-400 cursor-not-allowed"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleTryDemo}
            disabled={
              !product.isActive ||
              isCcrvProduct ||
              !(
                isAadhaarProduct ||
                isPanProduct ||
                isDrivingLicenseProduct ||
                isVoterProduct ||
                isGstinProduct ||
                isCompanyProduct ||
                isBankProduct ||
                isRcProduct ||
                isPassportProduct ||
                isCcrvProduct ||
                isEpfoProduct
              )
            }
          >
            {isCcrvProduct ? "Coming Soon" : (product.isActive ? "Start Verification" : "Coming Soon")}
          </button>
        </div>
      </motion.div>

      {/* Modals */}


      {/* Elegant Buy Prompt (inline on product page) */}
      {buyPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setBuyPromptOpen(false)}
            >
              ✕
            </button>
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">💡</div>
              <h3 className="text-xl font-semibold text-gray-900">You don’t have an active plan</h3>
              <p className="text-gray-600">Purchase a verification to get started instantly.</p>
              <div className="pt-2 flex gap-3 justify-center">
                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setBuyPromptOpen(false)}
                >
                  Not now
                </button>
                <button
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  onClick={() => {
                    // Reuse Buy Now logic if pricing available; otherwise send minimal info
                    if (pricingData) {
                      const oneTimePrice = Number(pricingData.oneTimePrice);
                      const tierInfo = {
                        service: verificationType,
                        label: product.title,
                        price: isNaN(oneTimePrice) ? 0 : oneTimePrice,
                        billingPeriod: "one-time",
                        originalPrice: isNaN(oneTimePrice) ? 0 : oneTimePrice,
                        discount: 0,
                      };
                      navigate("/checkout", {
                        state: {
                          selectedPlan: "one-time",
                          billingPeriod: "one-time",
                          selectedServices: [verificationType],
                          productInfo: {
                            id: product.id,
                            title: product.title,
                            description: product.description,
                            image: product.image,
                            category: product.category.name,
                          },
                          tierInfo,
                          totalAmount: isNaN(oneTimePrice) ? undefined : oneTimePrice,
                          returnTo: `/products/${product.id}`,
                        },
                      });
                    } else {
                      navigate("/checkout", {
                        state: {
                          selectedPlan: "one-time",
                          billingPeriod: "one-time",
                          selectedServices: [verificationType],
                          productInfo: {
                            id: product.id,
                            title: product.title,
                          },
                          returnTo: `/products/${product.id}`,
                        },
                      });
                    }
                  }}
                >
                  Buy Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};