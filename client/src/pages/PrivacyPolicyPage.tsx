"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Eye,
  Database,
  Cookie,
  Share2,
  Trash2,
  Lock,
  Users,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react"

const PrivacyPolicyPage = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "overview",
    "collecting",
    "tracking",
    "use",
    "disclosure",
    "retention",
    "delete",
    "security",
    "additional",
    "changes",
    "definitions",
  ])

  // Dynamically generate the current date in "Month DD, YYYY" format
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const sectionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1] as const,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-200 py-4 sm:py-6 lg:py-8">
      <motion.main
        className="w-full px-4 sm:px-6 lg:px-8 xl:px-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header
          className="mb-6 sm:mb-8 lg:mb-10 bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8 lg:p-10"
          variants={itemVariants}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-blue-600 dark:text-blue-400 mr-4" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-balance">
                Privacy Policy
              </h1>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-4 max-w-4xl text-pretty">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <div className="flex items-center justify-center text-base sm:text-lg text-slate-500 dark:text-slate-400 italic">
              <Calendar className="w-5 h-5 mr-3" />
              <span>
                Last updated: <span className="font-medium">{lastUpdated}</span>
              </span>
            </div>
          </div>
        </motion.header>

        <div className="grid gap-6 sm:gap-8 lg:gap-10">
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => toggleSection("overview")}
              >
                <div className="flex items-center">
                  <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                    Privacy Policy Overview
                  </h2>
                </div>
                {expandedSections.includes("overview") ? (
                  <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                )}
              </div>
              <AnimatePresence>
                {expandedSections.includes("overview") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                      <p className="text-pretty">
                        This Privacy Policy describes Our policies and procedures on the collection, use and disclosure
                        of Your information when You use the Service and tells You about Your privacy rights and how the
                        law protects You.
                      </p>
                      <p className="text-pretty">
                        We use Your Personal data to provide and improve the Service. By using the Service, You agree to
                        the collection and use of information in accordance with this Privacy Policy.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => toggleSection("definitions")}
              >
                <div className="flex items-center">
                  <Database className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                    Interpretation and Definitions
                  </h2>
                </div>
                {expandedSections.includes("definitions") ? (
                  <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.includes("definitions") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                      <h3 className="text-xl sm:text-2xl font-semibold mt-6 flex items-center">
                        <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-3 flex-shrink-0" />
                        Interpretation
                      </h3>
                      <p className="text-pretty">
                        The words of which the initial letter is capitalized have meanings defined under the following
                        conditions. The following definitions shall have the same meaning regardless of whether they
                        appear in singular or in plural.
                      </p>

                      <h3 className="text-xl sm:text-2xl font-semibold mt-8 flex items-center">
                        <Database className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-3 flex-shrink-0" />
                        Definitions
                      </h3>
                      <p>For the purposes of this Privacy Policy:</p>

                      <div className="grid gap-4 sm:gap-6 mt-6">
                        {[
                          {
                            icon: Users,
                            term: "Account",
                            definition:
                              "means a unique account created for You to access our Service or parts of our Service.",
                          },
                          {
                            icon: Share2,
                            term: "Affiliate",
                            definition:
                              'means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.',
                          },
                          {
                            icon: MapPin,
                            term: "Company",
                            definition:
                              '(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Navigant Digital Pvt. Ltd., Tower A, 4th Floor Sector 62, Noida Uttar Pradesh - 201309 India.',
                          },
                          {
                            icon: Cookie,
                            term: "Cookies",
                            definition:
                              "are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.",
                          },
                          { icon: Globe, term: "Country", definition: "refers to: Uttar Pradesh, India" },
                          {
                            icon: Database,
                            term: "Device",
                            definition:
                              "means any device that can access the Service such as a computer, a cellphone or a digital tablet.",
                          },
                          {
                            icon: Shield,
                            term: "Personal Data",
                            definition: "is any information that relates to an identified or identifiable individual.",
                          },
                          { icon: Globe, term: "Service", definition: "refers to the Website." },
                          {
                            icon: Users,
                            term: "Service Provider",
                            definition:
                              "means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.",
                          },
                          {
                            icon: Share2,
                            term: "Third-party Social Media Service",
                            definition:
                              "refers to any website or any social network website through which a User can log in or create an account to use the Service.",
                          },
                          {
                            icon: Database,
                            term: "Usage Data",
                            definition:
                              "refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).",
                          },
                          {
                            icon: ExternalLink,
                            term: "Website",
                            definition: "refers to VerifyMyKYC, accessible from https://verifymykyc.com/",
                          },
                          {
                            icon: Users,
                            term: "You",
                            definition:
                              "means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.",
                          },
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            className="flex items-start p-4 sm:p-6 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                            whileHover={{ x: 5, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                            <div>
                              <strong className="text-base sm:text-lg block mb-2">{item.term}:</strong>
                              <span className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                                {item.definition}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => toggleSection("collecting")}
              >
                <div className="flex items-center">
                  <Database className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                    Collecting and Using Your Personal Data
                  </h2>
                </div>
                {expandedSections.includes("collecting") ? (
                  <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.includes("collecting") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                      <h3 className="text-xl sm:text-2xl font-semibold mt-6">Types of Data Collected</h3>

                      <div className="grid gap-6 sm:gap-8 lg:gap-10 mt-8">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                          <h4 className="font-semibold text-xl flex items-center mb-4">
                            <Shield className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                            Personal Data
                          </h4>
                          <p className="text-pretty mb-4">
                            While using Our Service, We may ask You to provide Us with certain personally identifiable
                            information that can be used to contact or identify You. This may include:
                          </p>
                          <div className="grid gap-3 sm:gap-4">
                            {[
                              { icon: Mail, text: "Email address" },
                              { icon: Users, text: "First name and last name" },
                              { icon: Phone, text: "Phone number" },
                              { icon: MapPin, text: "Address, State, Province, ZIP/Postal code, City" },
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                                whileHover={{ x: 5 }}
                              >
                                <item.icon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-base">{item.text}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                          <h4 className="font-semibold text-xl flex items-center mb-4">
                            <Eye className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0" />
                            Usage Data
                          </h4>
                          <p className="mb-4">Usage Data is collected automatically and may include:</p>
                          <div className="grid gap-3 sm:gap-4">
                            {[
                              { icon: Globe, text: "Device's IP address" },
                              { icon: Database, text: "Browser type and version" },
                              { icon: Eye, text: "Pages visited and time spent" },
                              { icon: Shield, text: "Unique device identifiers" },
                              { icon: Database, text: "Diagnostic data" },
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                                whileHover={{ x: 5 }}
                              >
                                <item.icon className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                                <span className="text-base">{item.text}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                          <h4 className="font-semibold text-xl flex items-center mb-4">
                            <Share2 className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0" />
                            Information from Third-Party Social Media Services
                          </h4>
                          <p className="mb-4">We allow login via:</p>
                          <div className="grid gap-3 sm:gap-4">
                            {[
                              { icon: Globe, text: "Google", color: "text-red-500" },
                              { icon: Facebook, text: "Facebook", color: "text-blue-600" },
                              { icon: Instagram, text: "Instagram", color: "text-pink-500" },
                              { icon: Twitter, text: "Twitter", color: "text-blue-400" },
                              { icon: Linkedin, text: "LinkedIn", color: "text-blue-700" },
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                                whileHover={{ x: 5 }}
                              >
                                <item.icon className={`w-5 h-5 ${item.color} mr-3 flex-shrink-0`} />
                                <span className="text-base">{item.text}</span>
                              </motion.div>
                            ))}
                          </div>
                          <p className="text-pretty mt-4 text-sm text-slate-600 dark:text-slate-400">
                            If You use these, we may collect Your name, email, activities, or contact list associated
                            with that account.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => toggleSection("tracking")}
              >
                <div className="flex items-center">
                  <Cookie className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                    Tracking Technologies and Cookies
                  </h2>
                </div>
                {expandedSections.includes("tracking") ? (
                  <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.includes("tracking") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                      <p className="text-pretty mb-6">
                        We use Cookies and similar technologies to track activity and store information. These include:
                      </p>

                      <div className="grid gap-4 mb-8">
                        <motion.div
                          className="flex items-start p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"
                          whileHover={{ x: 5 }}
                        >
                          <Cookie className="w-6 h-6 text-orange-500 mr-4 mt-1 flex-shrink-0" />
                          <div>
                            <strong className="text-lg block mb-2">Cookies:</strong>
                            <span className="text-base">
                              Small files placed on Your Device. We use both Session and Persistent Cookies.
                            </span>
                          </div>
                        </motion.div>
                        <motion.div
                          className="flex items-start p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"
                          whileHover={{ x: 5 }}
                        >
                          <Eye className="w-6 h-6 text-purple-500 mr-4 mt-1 flex-shrink-0" />
                          <div>
                            <strong className="text-lg block mb-2">Web Beacons:</strong>
                            <span className="text-base">
                              Electronic files used to track page visits and email engagement.
                            </span>
                          </div>
                        </motion.div>
                      </div>

                      <h3 className="font-semibold text-xl mt-8 mb-6 flex items-center">
                        <Cookie className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                        Types of Cookies We Use
                      </h3>
                      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                        <motion.div
                          className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex items-center mb-3">
                            <Lock className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                            <strong className="text-lg">Necessary / Essential Cookies</strong>
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400 block mb-2">
                            Type: Session | Administered by: Us
                          </span>
                          <span className="text-base">Essential for authentication and fraud prevention.</span>
                        </motion.div>
                        <motion.div
                          className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex items-center mb-3">
                            <Shield className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                            <strong className="text-lg">Cookies Policy Acceptance Cookies</strong>
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400 block mb-2">
                            Type: Persistent | Administered by: Us
                          </span>
                          <span className="text-base">Remembers if You accepted cookies.</span>
                        </motion.div>
                        <motion.div
                          className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-800 sm:col-span-1 lg:col-span-2 xl:col-span-1"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex items-center mb-3">
                            <Users className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0" />
                            <strong className="text-lg">Functionality Cookies</strong>
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400 block mb-2">
                            Type: Persistent | Administered by: Us
                          </span>
                          <span className="text-base">Remembers preferences like language or login details.</span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => toggleSection("use")}
              >
                <div className="flex items-center">
                  <Database className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                    Use of Your Personal Data
                  </h2>
                </div>
                {expandedSections.includes("use") ? (
                  <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.includes("use") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                      <p>The Company may use Personal Data to:</p>
                      <ul className="list-none ml-0 space-y-2 sm:space-y-3">
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Shield className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">Provide and maintain our Service</span>
                        </motion.li>
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Users className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">Manage Your Account</span>
                        </motion.li>
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Database className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">Perform contracts</span>
                        </motion.li>
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Mail className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">Contact You via email, SMS, or push notifications</span>
                        </motion.li>
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Share2 className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">Send news, offers, and updates (unless opted out)</span>
                        </motion.li>
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Eye className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">Manage Your requests</span>
                        </motion.li>
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <RefreshCw className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">Support business transfers (mergers, acquisitions)</span>
                        </motion.li>
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Database className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">Data analysis and service improvement</span>
                        </motion.li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => toggleSection("disclosure")}
              >
                <div className="flex items-center">
                  <Share2 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                    Disclosure & Sharing of Your Personal Data
                  </h2>
                </div>
                {expandedSections.includes("disclosure") ? (
                  <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.includes("disclosure") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                      <p>We may share Your information in the following situations:</p>
                      <ul className="list-none ml-0 space-y-2 sm:space-y-3">
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Users className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">
                            <strong>With Service Providers:</strong> For analysis, communication, and support.
                          </span>
                        </motion.li>
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <RefreshCw className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">
                            <strong>Business Transfers:</strong> In mergers or asset sales.
                          </span>
                        </motion.li>
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Share2 className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">
                            <strong>With Affiliates:</strong> Who agree to honor this policy.
                          </span>
                        </motion.li>
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Users className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">
                            <strong>With Business Partners:</strong> For joint promotions.
                          </span>
                        </motion.li>
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Eye className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">
                            <strong>With Other Users:</strong> If You interact publicly.
                          </span>
                        </motion.li>
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Shield className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">
                            <strong>With Consent:</strong> For any other purpose You approve.
                          </span>
                        </motion.li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => toggleSection("retention")}
              >
                <div className="flex items-center">
                  <Database className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                    Data Retention & Transfer
                  </h2>
                </div>
                {expandedSections.includes("retention") ? (
                  <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.includes("retention") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                      <h3 className="font-semibold text-xl mt-6 flex items-center">
                        <Database className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                        Retention
                      </h3>
                      <p className="text-pretty">
                        We retain Personal Data only as long as necessary for legal compliance, dispute resolution, and
                        policy enforcement. Usage Data is kept shorter unless needed for security or improvement.
                      </p>

                      <h3 className="font-semibold text-xl mt-6 flex items-center">
                        <Globe className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                        Transfer
                      </h3>
                      <p className="text-pretty">
                        Your data may be transferred and stored outside Your jurisdiction. We ensure adequate safeguards
                        are in place to protect it.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => toggleSection("delete")}
              >
                <div className="flex items-center">
                  <Trash2 className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 dark:text-red-400 mr-4 flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                    Delete Your Personal Data
                  </h2>
                </div>
                {expandedSections.includes("delete") ? (
                  <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.includes("delete") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                      <p>You have the right to request deletion of Your data. You can:</p>
                      <ul className="list-none ml-0 space-y-2 sm:space-y-3">
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Users className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">Update or delete info in Your Account settings</span>
                        </motion.li>
                        <motion.li
                          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                          whileHover={{ x: 5 }}
                        >
                          <Mail className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-base">Contact Us directly</span>
                        </motion.li>
                      </ul>
                      <p className="text-pretty">Note: We may retain certain data if legally required.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => toggleSection("security")}
              >
                <div className="flex items-center">
                  <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400 mr-4 flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                    Disclosure & Security
                  </h2>
                </div>
                {expandedSections.includes("security") ? (
                  <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.includes("security") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                      <h3 className="font-semibold text-xl mt-6 flex items-center">
                        <RefreshCw className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                        Business Transactions
                      </h3>
                      <p className="text-pretty">
                        In case of merger or sale, we will notify You before Your data is transferred.
                      </p>

                      <h3 className="font-semibold text-xl mt-6 flex items-center">
                        <Shield className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0" />
                        Law Enforcement
                      </h3>
                      <p className="text-pretty">
                        We may disclose data if required by law or to protect rights, property, or safety.
                      </p>

                      <h3 className="font-semibold text-xl mt-6 flex items-center">
                        <Lock className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                        Security
                      </h3>
                      <p className="text-pretty">
                        We use commercially acceptable means to protect Your data, but cannot guarantee 100% security of
                        transmission or storage.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => toggleSection("additional")}
              >
                <div className="flex items-center">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 dark:text-purple-400 mr-4 flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                    Additional Policies
                  </h2>
                </div>
                {expandedSections.includes("additional") ? (
                  <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.includes("additional") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                      <h3 className="font-semibold text-xl mt-6 flex items-center">
                        <Shield className="w-6 h-6 text-pink-500 mr-3 flex-shrink-0" />
                        Children's Privacy
                      </h3>
                      <p className="text-pretty">
                        Our Service does not address anyone under 13. We do not knowingly collect data from children.
                        Contact Us if You believe a child has provided information.
                      </p>

                      <h3 className="font-semibold text-xl mt-6 flex items-center">
                        <ExternalLink className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                        Links to Other Websites
                      </h3>
                      <p className="text-pretty">
                        Our Service may link to third-party sites. We are not responsible for their content or privacy
                        practices. Review their policies before interacting.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => toggleSection("changes")}
              >
                <div className="flex items-center">
                  <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 dark:text-orange-400 mr-4 flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                    Changes to This Privacy Policy
                  </h2>
                </div>
                {expandedSections.includes("changes") ? (
                  <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.includes("changes") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                      <p className="text-pretty">
                        We may update this policy periodically. Changes will be posted here with an updated "Last
                        updated" date. We may notify You via email or in-app notice.
                      </p>
                      <p className="italic mt-2 flex items-center text-pretty">
                        <Eye className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                        We advise You to review this page regularly for updates.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>

        <motion.footer
          className="mt-12 sm:mt-16 lg:mt-20 text-center bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center text-base sm:text-lg text-slate-500 dark:text-slate-400">
            <Shield className="w-5 h-5 mb-2 sm:mb-0 sm:mr-3" />
            <span>&copy; {new Date().getFullYear()} Navigant Digital Pvt. Ltd. All rights reserved.</span>
          </div>
        </motion.footer>
      </motion.main>
    </div>
  )
}

export default PrivacyPolicyPage
