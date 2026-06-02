// src/components/auth/AuthCardLayout.tsx
import React from "react";
import { motion } from "framer-motion";
import AuthSideIllustration from "./AuthSideIllustration";

interface AuthCardLayoutProps {
  animationData: any;
  children: React.ReactNode;
  header?: React.ReactNode;
  leftHeader?: React.ReactNode;
  rightHeader?: React.ReactNode;
}

const AuthCardLayout: React.FC<AuthCardLayoutProps> = ({ animationData, children, header, leftHeader, rightHeader }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-2xl p-6 md:p-8"
        >
          {header && <div className="mb-6 lg:mb-8">{header}</div>}
          {(leftHeader || rightHeader) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-4 lg:mb-6">
              <div className="order-first lg:order-none">{leftHeader}</div>
              <div className="lg:col-span-1">{rightHeader}</div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="order-first lg:order-none h-full">
              <AuthSideIllustration animationData={animationData} />
            </div>
            <div className="lg:col-span-1 h-full">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthCardLayout;


