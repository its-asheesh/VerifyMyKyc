"use client";

import { motion } from "framer-motion";
import {
  FileText,
  User,
  Globe,
  Shield,
  Link as LinkIcon,
  AlertTriangle,
  Zap,
  Scale,
  BookOpen,
  Users,
  MessageCircle,
  RefreshCw,
  Calendar,
  ExternalLink,
  Laptop,
} from "lucide-react";

const TermsAndConditionsPage = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-blue-600 dark:text-blue-400 mr-4" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-balance">
                Terms and Conditions
              </h1>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-4 max-w-4xl text-pretty">
              Please read these terms and conditions carefully before using Our Service.
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
          {/* Acknowledgment */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Acknowledgment
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
                </p>
                <p className="text-pretty">
                  Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
                </p>
                <p className="text-pretty">
                  By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.
                </p>
                <p className="text-pretty">
                  You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
                </p>
                <p className="text-pretty">
                  Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the{" "}
                  <a href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400">
                    Privacy Policy
                  </a>{" "}
                  of the Company.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Definitions */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Interpretation and Definitions
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <h3 className="text-xl sm:text-2xl font-semibold mt-6 flex items-center">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-3 flex-shrink-0" />
                  Interpretation
                </h3>
                <p className="text-pretty">
                  The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                </p>

                <h3 className="text-xl sm:text-2xl font-semibold mt-8 flex items-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-3 flex-shrink-0" />
                  Definitions
                </h3>
                <p>For the purposes of these Terms and Conditions:</p>
                <div className="grid gap-4 sm:gap-6 mt-6">
                  {[
                    {
                      icon: Users,
                      term: "Affiliate",
                      definition:
                        'means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.',
                    },
                    {
                      icon: Globe,
                      term: "Country",
                      definition: "refers to: Delhi, India",
                    },
                    {
                      icon: Shield,
                      term: "Company",
                      definition:
                        '(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Navigant Digital Private Limited, A 24/5, Mohan Cooperative Industrial Area Badarpur, Second Floor, New Delhi 110044 India.',
                    },
                    {
                      icon: Laptop,
                      term: "Device",
                      definition:
                        "means any device that can access the Service such as a computer, a cellphone or a digital tablet.",
                    },
                    {
                      icon: Globe,
                      term: "Service",
                      definition: "refers to the Website.",
                    },
                    {
                      icon: FileText,
                      term: "Terms and Conditions",
                      definition:
                        "(also referred as \"Terms\") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.",
                    },
                    {
                      icon: Users,
                      term: "Third-party Social Media Service",
                      definition:
                        "means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.",
                    },
                    {
                      icon: ExternalLink,
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
                      icon: User,
                      term: "You",
                      definition:
                        "means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start p-4 sm:p-6 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                      whileHover={{ x: 5, scale: 1.01 }}
                      transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
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

          {/* Links */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <LinkIcon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Links to Other Websites
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.
                </p>
                <p className="text-pretty">
                  The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.
                </p>
                <p className="text-pretty">
                  We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Termination */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 dark:text-red-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Termination
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
                </p>
                <p className="text-pretty">
                  Upon termination, Your right to use the Service will cease immediately.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Limitation of Liability */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 dark:text-orange-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Limitation of Liability
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service, if You haven't purchased anything through the Service.
                </p>
                <p className="text-pretty">
                  To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
                </p>
                <p className="text-pretty">
                  Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.
                </p>
              </div>
            </div>
          </motion.section>

          {/* "AS IS" Disclaimer */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600 dark:text-yellow-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  "AS IS" and "AS AVAILABLE" Disclaimer
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise.
                </p>
                <p className="text-pretty">
                  Without limitation, the Company makes no representation or warranty that the Service will meet Your requirements, operate without interruption, be error-free, or be secure.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Governing Law */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Scale className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Governing Law
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Disputes Resolution */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Disputes Resolution
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.
                </p>
              </div>
            </div>
          </motion.section>

          {/* For European Union (EU) Users */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  For European Union (EU) Users
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which You are resident.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Severability and Waiver */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Severability and Waiver
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Translation Interpretation */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Translation Interpretation
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Changes to These Terms and Conditions */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Changes to These Terms and Conditions
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms.
                </p>
              </div>
            </div>
          </motion.section>

          {/* <motion.footer
            className="mt-12 sm:mt-16 lg:mt-20 text-center bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8"
            variants={itemVariants}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center text-base sm:text-lg text-slate-500 dark:text-slate-400">
              <Shield className="w-5 h-5 mb-2 sm:mb-0 sm:mr-3" />
              <span>&copy; {new Date().getFullYear()} Navigant Digital Private Limited. All rights reserved.</span>
            </div>
          </motion.footer> */}
        </div>
      </motion.main>
    </div>
  );
};

export default TermsAndConditionsPage;