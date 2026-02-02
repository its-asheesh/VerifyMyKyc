"use client"

import { motion } from "framer-motion"
import {
  Shield,
  Lock,
  Eye,
  Mail,
  Calendar,
  Database,
  Users,
  Share2,
  MapPin,
  Cookie,
  Globe,
  RefreshCw,
  Trash2,
  Phone,
} from "lucide-react"

const PrivacyPolicyPage = () => {
  // Dynamically generate the current date in "Month DD, YYYY" format
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
          {/* Overview */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Privacy Policy Overview
                </h2>
              </div>
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
            </div>
          </motion.section>

          {/* Definitions */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Database className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Interpretation and Definitions
                </h2>
              </div>
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
                      icon: Users,
                      term: "Website",
                      definition: (
                        <a
                          href="https://verifymykyc.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          https://verifymykyc.com/
                        </a>
                      ),
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
            </div>
          </motion.section>

          {/* Collecting and Using Personal Data */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Database className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Collecting and Using Your Personal Data
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <h3 className="text-xl sm:text-2xl font-semibold mt-6 flex items-center">
                  <Database className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-3 flex-shrink-0" />
                  Types of Data Collected
                </h3>
                <p className="text-pretty">
                  We collect several different types of information for various purposes to provide and improve our Service to you.
                </p>

                <h4 className="text-lg sm:text-xl font-semibold mt-6">Personal Data</h4>
                <p className="text-pretty">
                  While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                </p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Address, State, Province, ZIP/Postal code, City</li>
                  <li>Usage Data</li>
                </ul>

                <h4 className="text-lg sm:text-xl font-semibold mt-6">Usage Data</h4>
                <p className="text-pretty">
                  Usage Data is collected automatically when using the Service. This may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Tracking Technologies */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Cookie className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Tracking Technologies and Cookies
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service.
                </p>
                <p className="text-pretty">
                  You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Use of Personal Data */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Share2 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Use of Your Personal Data
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  The Company may use Personal Data for the following purposes:
                </p>
                <ul className="list-disc pl-6 mt-4">
                  <li><strong>To provide and maintain our Service:</strong> Including to monitor the usage of our Service.</li>
                  <li><strong>To manage Your Account:</strong> To manage Your registration as a user of the Service.</li>
                  <li><strong>For the performance of a contract:</strong> The development, compliance and undertaking of the purchase contract for the products, items or services You have purchased.</li>
                  <li><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
                  <li><strong>To provide You with news, special offers and general information</strong> about other goods, services and events which we offer.</li>
                  <li><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Disclosure of Personal Data */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Disclosure of Your Personal Data
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  We may share Your personal information in the following situations:
                </p>
                <ul className="list-disc pl-6 mt-4">
                  <li><strong>With Service Providers:</strong> We may share Your personal information with Service Providers to monitor and analyze the use of our Service.</li>
                  <li><strong>For business transfers:</strong> We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.</li>
                  <li><strong>With Affiliates:</strong> We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy.</li>
                  <li><strong>With business partners:</strong> We may share Your information with Our business partners to offer You certain products, services or promotions.</li>
                  <li><strong>With other users:</strong> When You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Retention of Personal Data */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Retention of Your Personal Data
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
                </p>
                <p className="text-pretty">
                  The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Delete Personal Data */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Trash2 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Delete Your Personal Data
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You. You may contact Us to request access to, correct, or delete any personal information that You have provided to Us.
                </p>
                <p className="text-pretty">
                  Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Security of Personal Data */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Security of Your Personal Data
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Additional Information */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Additional Information
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <h3 className="text-xl sm:text-2xl font-semibold mt-6">Children's Privacy</h3>
                <p className="text-pretty">
                  Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13.
                </p>

                <h3 className="text-xl sm:text-2xl font-semibold mt-6">Changes to this Privacy Policy</h3>
                <p className="text-pretty">
                  We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
                </p>

                <h3 className="text-xl sm:text-2xl font-semibold mt-6">Contact Us</h3>
                <p className="text-pretty">
                  If you have any questions about this Privacy Policy, You can contact us:
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-500 mr-3" />
                    <span>By email: privacy@verifymykyc.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-blue-500 mr-3" />
                    <span>By phone: +91-XXXXXXXXXX</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-blue-500 mr-3" />
                    <span>By mail: Navigant Digital Pvt. Ltd., Tower A, 4th Floor Sector 62, Noida Uttar Pradesh - 201309 India</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </motion.main>
    </div>
  )
}

export default PrivacyPolicyPage