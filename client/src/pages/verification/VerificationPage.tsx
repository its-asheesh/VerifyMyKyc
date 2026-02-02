"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";

// Import all verification sections
import { AadhaarSection } from "../../components/verification/AadhaarSection";
import { PanSection } from "../../components/verification/PanSection";
import { DrivingLicenseSection } from "../../components/verification/DrivingLicenseSection";
import { VoterSection } from "../../components/verification/VoterSection";
import { GstinSection } from "../../components/verification/GstinSection";
import { EpfoSection } from "../../components/verification/EpfoSection";
import { CompanySection } from "../../components/verification/CompanySection";
import { BankAccountSection } from "../../components/verification/BankAccountSection";
import { RcSection } from "../../components/verification/RcSection";
import { PassportSection } from "../../components/verification/PassportSection";
import { CcrvSection } from "../../components/verification/CcrvSection";

const VerificationPage: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const productId = searchParams.get("productId") || "";

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const renderSection = () => {
        switch (type?.toLowerCase()) {
            case "aadhaar":
                return <AadhaarSection productId={productId} />;
            case "pan":
                return <PanSection productId={productId} />;
            case "drivinglicense":
                return <DrivingLicenseSection productId={productId} />;
            case "voterid":
                return <VoterSection productId={productId} />;
            case "gstin":
                return <GstinSection productId={productId} />;
            case "company":
                return <CompanySection productId={productId} />;
            case "epfo":
                return <EpfoSection productId={productId} />;
            case "bankaccount":
            case "bank-account":
                return <BankAccountSection productId={productId} />;
            case "vehicle":
                return <RcSection productId={productId} />;
            case "passport":
                return <PassportSection productId={productId} />;
            case "ccrv":
                return <CcrvSection productId={productId} />;
            default:
                return (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900">Service Not Found</h2>
                        <p className="text-gray-600 mt-2">The requested verification service could not be found.</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse Products
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="h-screen overflow-y-auto bg-gray-50 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Fixed Close Button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 right-6 z-50 p-2 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full shadow-md transition-all hover:scale-105"
                aria-label="Close"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                    {renderSection()}
                </motion.div>
            </main>
        </div>
    );
};

export default VerificationPage;
