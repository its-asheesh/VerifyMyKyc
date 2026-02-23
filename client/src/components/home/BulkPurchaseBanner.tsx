"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Building2, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"
import { Container } from "../common/Container"

const BulkPurchaseBanner: React.FC = () => {
    const benefits = [
        "Volume Discounts",
        "Priority Support",
        "Custom Verification Tokens",
    ]

    return (
        <div className="bg-gray-50 pb-16">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 shadow-2xl"
                >
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 blur-3xl" />

                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>

                    <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">

                        {/* Left Content */}
                        <div className="max-w-2xl text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-blue-300 border border-blue-500/20 backdrop-blur-sm mb-6"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-sm font-medium">Enterprise Solutions</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                            >
                                High Volume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Verifications?</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="mb-8 text-lg text-slate-300 leading-relaxed"
                            >
                                Scale your compliance effortlessly with our enterprise-grade solutions.
                                Get tailored pricing, dedicated support, and seamless integration for your growing business needs.
                            </motion.p>

                            {/* Benefits Grid */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3 text-slate-200">
                                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                                        <span className="text-sm font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right Action */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
                                <Link
                                    to="/contact"
                                    className="relative inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-bold text-slate-900 transition-all hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] shadow-xl min-w-[200px]"
                                >
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                    Contact Sales
                                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                                </Link>
                            </div>
                            <p className="text-sm text-slate-400 font-medium">
                                Talk to an expert • No commitment required
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </Container>
        </div>
    )
}

export default BulkPurchaseBanner
