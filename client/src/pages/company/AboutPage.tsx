"use client";

import type React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "../../components/common/PageHeader";
import {
  Users,
  Target,
  Award,
  Globe,
  ShieldCheck,
  Briefcase,
  Car,
  FileCheck,
  IdCard,
} from "lucide-react";

const AboutPage: React.FC = () => {
  const stats = [
    { icon: Users, value: "10,000+", label: "Verified Users" },
    { icon: Globe, value: "India", label: "Headquartered in New Delhi" },
    { icon: Award, value: "99.9%", label: "Accuracy Rate" },
    { icon: Target, value: "50+", label: "Professionals" },
  ];

  const services = [
    {
      icon: IdCard,
      title: "Identity Verification",
      desc: "Verify Aadhaar, PAN, Voter ID, Driving License, Passport",
    },
    {
      icon: Car,
      title: "Vehicle Verification",
      desc: "Check ownership, registration, and compliance instantly",
    },
    {
      icon: ShieldCheck,
      title: "Criminal Record Checks",
      desc: "Background verification for safe hiring and onboarding",
    },
    {
      icon: FileCheck,
      title: "Business Verification",
      desc: "GST, MSME, company status, compliance & financial checks",
    },
    {
      icon: Users,
      title: "Household Staff Verification",
      desc: "Maid, Nanny, Cook, Driver, Babysitter, Cleaner, Plumber and Housekeeping staff",
    },
  ];

  const team = [
    {
      name: "Ankur Bhatia",
      role: "Founder & CEO",
      image: "/founder.png",
      bio: "Visionary leader with 15+ years of experience in fintech and identity verification. Leading India's most comprehensive KYC verification platform.",
    },
   
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="About VerifyMyKyc"
        subtitle="Empowering trust through innovation in identity and business verification"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our mission is to make trust instant. VerifyMyKyc was built to
            simplify digital verification — helping companies stay compliant,
            avoid fraud, and build strong, trustworthy relationships with
            customers and partners.
          </p>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="text-center bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.section>

        {/* Goal Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Goal
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                At VerifyMyKyc, our goal is to redefine verification by making
                it seamless, reliable, and accessible for individuals and
                businesses alike. We provide a wide range of services — from
                identity, vehicle, passport, voter, and criminal record checks
                to domestic staff and business verifications.
              </p>
              <p>
                We are committed to helping households ensure the safety of
                their services and enabling businesses to stay compliant, avoid
                fraud, and build trustworthy relationships with their customers.
              </p>
              <p>
                By combining cutting-edge technology with a customer-first
                approach, we aim to deliver instant, accurate, and secure
                verification solutions that empower trust in every interaction.
              </p>
            </div>
          </div>
          <div>
            <img
              src="/1.jpg"
              alt="Our Goal"
              className="w-full h-90 md:h-90 object-cover rounded-4xl shadow-lg"
            />
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive verification services for individuals, households,
              and businesses
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The people driving India's fastest KYC verification platform
            </p>
          </div>
          
          {/* Founder Section */}
          <div className="max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-46 rounded-xl object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-lg mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
