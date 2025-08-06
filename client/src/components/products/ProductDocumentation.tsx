"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Book, Code, ExternalLink, Download } from "lucide-react"
import type { Product } from "../../types/product"

interface ProductDocumentationProps {
  product: Product
}

export const ProductDocumentation: React.FC<ProductDocumentationProps> = ({ product }) => {
  const docSections = [
    {
      title: "Getting Started",
      description: "Quick setup guide and basic implementation",
      icon: Book,
      link: "#getting-started",
    },
    {
      title: "API Reference",
      description: "Complete API documentation with examples",
      icon: Code,
      link: "#api-reference",
    },
    {
      title: "SDK Downloads",
      description: "Download SDKs for popular programming languages",
      icon: Download,
      link: "#sdk-downloads",
    },
  ]

  return (
    <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Documentation & Resources</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to integrate and get the most out of our verification services
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {docSections.map((section, index) => (
          <motion.a
            key={section.title}
            href={section.link}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="block bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
              <section.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {section.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{section.description}</p>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              Learn more
              <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.a>
        ))}
      </div>

      {/* Code Example */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gray-900 rounded-2xl p-6 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Quick Integration Example</h3>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Code className="w-5 h-5" />
          </button>
        </div>
        <pre className="text-green-400 text-sm overflow-x-auto">
          <code>{`// Initialize VerifyMyKyc
import { VerifyMyKyc } from '@verifymykyc/sdk';

const verifier = new VerifyMyKyc({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Verify a document
const result = await verifier.verify({
  type: '${product.title.toLowerCase().replace(" ", "-")}',
  document: documentFile,
  options: {
    extractData: true,
    validateSignature: true
  }
});

console.log(result);`}</code>
        </pre>
      </motion.div>
    </section>
  )
}
