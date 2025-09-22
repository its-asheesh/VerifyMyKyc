"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Globe,
  Shield,
  ExternalLink,
  Zap,
  Scale,
  MessageCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";

const DisclaimerPage = () => {
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
              <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-orange-600 dark:text-orange-400 mr-4" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 text-balance">
                Disclaimer
              </h1>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-4 max-w-4xl text-pretty">
              Please read this disclaimer carefully before using Our Service.
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
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-3 flex-shrink-0" />
                  Definitions
                </h3>
                <p>For the purposes of this Disclaimer:</p>
                <div className="grid gap-4 sm:gap-6 mt-6">
                  {[
                    {
                      icon: Shield,
                      term: "Company",
                      definition:
                        '(referred to as either "the Company", "We", "Us" or "Our" in this Disclaimer) refers to Navigant Digital Private Limited, A 24/5, Mohan Cooperative Industrial Area Badarpur, Second Floor, New Delhi 110044 India.',
                    },
                    {
                      icon: Globe,
                      term: "Service",
                      definition: "refers to the Website.",
                    },
                    {
                      icon: AlertTriangle,
                      term: "You",
                      definition:
                        "means the individual accessing the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.",
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

          {/* General Disclaimer */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 dark:text-orange-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  General Disclaimer
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  The information contained on the Service is for general information purposes only. The Company assumes no responsibility for errors or omissions in the contents of the Service.
                </p>
                <p className="text-pretty">
                  In no event shall the Company be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service.
                </p>
                <p className="text-pretty">
                  The Company reserves the right to make additions, deletions, or modifications to the contents of the Service at any time without prior notice.
                </p>
              </div>
            </div>
          </motion.section>

          {/* External Links Disclaimer */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <ExternalLink className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  External Links Disclaimer
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with the Company.
                </p>
                <p className="text-pretty">
                  Please note that the Company does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
                </p>
                <p className="text-pretty">
                  We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Errors and Omissions Disclaimer */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 dark:text-red-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Errors and Omissions Disclaimer
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  The information given by the Service is for general guidance on matters of interest only. Even if the Company takes every precaution to ensure that the content of the Service is both current and accurate, errors can occur.
                </p>
                <p className="text-pretty">
                  The Company is not responsible for any errors or omissions, or for the results obtained from the use of this information.
                </p>
                <p className="text-pretty">
                  All information in the Service is provided "as is," with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Fair Use Disclaimer */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Scale className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Fair Use Disclaimer
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  This Service may contain copyrighted material the use of which has not always been specifically authorized by the copyright owner.
                </p>
                <p className="text-pretty">
                  We are making such material available in our efforts to advance understanding of environmental, political, human rights, economic, democracy, scientific, and social justice issues, etc.
                </p>
                <p className="text-pretty">
                  We believe this constitutes a "fair use" of any such copyrighted material as provided for in section 107 of the US Copyright Law.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Views Expressed Disclaimer */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Views Expressed Disclaimer
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  The views and opinions expressed on the Service are those of the authors and do not necessarily reflect the official policy or position of the Company.
                </p>
                <p className="text-pretty">
                  Any content provided by our bloggers or authors are of their opinion, and are not intended to malign any religion, ethnic group, club, organization, company, individual or anyone or anything.
                </p>
                <p className="text-pretty">
                  Comments published by users are their sole responsibility and the users will take full responsibility, liability and blame for any libel or litigation that results from something written in or as a direct result of something written in a comment.
                </p>
              </div>
            </div>
          </motion.section>

          {/* No Responsibility Disclaimer */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  No Responsibility Disclaimer
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  The information on the Service is provided with the understanding that the Company is not herein engaged in rendering legal, accounting, tax, or other professional advice and services.
                </p>
                <p className="text-pretty">
                  As such, it should not be used as a substitute for consultation with professional accounting, tax, legal or other competent advisers.
                </p>
                <p className="text-pretty">
                  In no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever arising out of or in connection with your access or use or inability to access or use the Service.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Use at Your Own Risk */}
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 dark:text-red-400 mr-4 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 dark:text-blue-400 text-balance">
                  Use at Your Own Risk
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg sm:prose-xl">
                <p className="text-pretty">
                  All information in the Service is provided "as is," with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability and fitness for a particular purpose.
                </p>
                <p className="text-pretty">
                  The Company will not be liable to You or anyone else for any decision made or action taken in reliance on the information given by the Service or for any consequential, special or similar damages, even if advised of the possibility of such damages.
                </p>
                <p className="text-pretty">
                  If you are not satisfied with the Service, your sole remedy is to cease using the Service.
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </motion.main>
    </div>
  );
};

export default DisclaimerPage;