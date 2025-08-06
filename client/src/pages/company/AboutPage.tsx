"use client"

import type React from "react"
import { motion } from "framer-motion"
import { PageHeader } from "../../components/common/PageHeader"
import { Users, Target, Award, Globe } from "lucide-react"

const AboutPage: React.FC = () => {
  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Customers" },
    { icon: Globe, value: "50+", label: "Countries Served" },
    { icon: Award, value: "99.9%", label: "Accuracy Rate" },
    { icon: Target, value: "3s", label: "Average Verification Time" },
  ]

  const team = [
    {
      name: "John Smith",
      role: "CEO & Founder",
      image: "/placeholder.svg",
      bio: "Former VP of Engineering at TechCorp with 15+ years in identity verification",
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      image: "/placeholder.svg",
      bio: "AI/ML expert with PhD from Stanford, previously at Google Research",
    },
    {
      name: "Michael Chen",
      role: "Head of Product",
      image: "/placeholder.svg",
      bio: "Product leader with experience scaling verification platforms at scale",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="About VerifyMyKyc"
        subtitle="Building trust through secure and reliable identity verification solutions"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            To make identity verification accessible, secure, and seamless for businesses of all sizes. We believe that
            trust is the foundation of digital interactions, and our mission is to provide the tools and technology that
            enable secure, compliant, and user-friendly verification processes.
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
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.section>

        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded in 2020, VerifyMyKyc emerged from a simple observation: identity verification was too complex,
                too slow, and too expensive for most businesses to implement effectively.
              </p>
              <p>
                Our founders, having experienced these challenges firsthand while building fintech applications, set out
                to create a solution that would democratize access to enterprise-grade verification technology.
              </p>
              <p>
                Today, we serve thousands of businesses across 50+ countries, processing millions of verifications
                monthly while maintaining the highest standards of security and compliance.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8">
            <img src="/placeholder.svg" alt="Our Story" className="w-full h-64 object-contain" />
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind VerifyMyKyc's success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default AboutPage
