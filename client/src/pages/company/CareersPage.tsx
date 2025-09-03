// "use client"

// import type React from "react"
// import { motion } from "framer-motion"
// import { PageHeader } from "../../components/common/PageHeader"
// import { MapPin, Clock, Users, ArrowRight, Heart, Zap, Shield } from "lucide-react"

// const CareersPage: React.FC = () => {
//   const openPositions = [
//     {
//       title: "Senior Frontend Developer",
//       department: "Engineering",
//       location: "Bangalore, India",
//       type: "Full-time",
//       experience: "3-5 years",
//       description: "Build beautiful and intuitive user interfaces for our verification platform.",
//       skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
//     },
//     {
//       title: "Backend Engineer",
//       department: "Engineering",
//       location: "Remote",
//       type: "Full-time",
//       experience: "2-4 years",
//       description: "Develop scalable APIs and microservices for identity verification.",
//       skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
//     },
//     {
//       title: "Product Manager",
//       department: "Product",
//       location: "Bangalore, India",
//       type: "Full-time",
//       experience: "4-6 years",
//       description: "Drive product strategy and roadmap for our verification solutions.",
//       skills: ["Product Strategy", "Analytics", "User Research", "Agile"],
//     },
//   ]

//   const benefits = [
//     {
//       icon: Heart,
//       title: "Health & Wellness",
//       description: "Comprehensive health insurance and wellness programs",
//     },
//     {
//       icon: Zap,
//       title: "Growth & Learning",
//       description: "Learning budget and conference attendance opportunities",
//     },
//     {
//       icon: Shield,
//       title: "Work-Life Balance",
//       description: "Flexible working hours and remote work options",
//     },
//   ]

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <PageHeader
//         title="Join Our Team"
//         subtitle="Help us build the future of identity verification. Work with cutting-edge technology and make a real impact."
//       />

//       <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
//         {/* Company Culture */}
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center"
//         >
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Work With Us?</h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
//             We're building the most trusted identity verification platform in India. Join us in creating technology that
//             makes the digital world safer for everyone.
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {benefits.map((benefit, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1, duration: 0.6 }}
//                 className="bg-white rounded-2xl p-6 shadow-lg"
//               >
//                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <benefit.icon className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
//                 <p className="text-gray-600">{benefit.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </motion.section>

//         {/* Open Positions */}
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4, duration: 0.6 }}
//         >
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
//             <p className="text-xl text-gray-600">Find your next opportunity with us</p>
//           </div>

//           <div className="space-y-6">
//             {openPositions.map((position, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
//                 whileHover={{ y: -4 }}
//                 className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//               >
//                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//                   <div className="flex-1">
//                     <div className="flex flex-wrap items-center gap-4 mb-3">
//                       <h3 className="text-xl font-bold text-gray-900">{position.title}</h3>
//                       <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
//                         {position.department}
//                       </span>
//                     </div>

//                     <p className="text-gray-600 mb-4">{position.description}</p>

//                     <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
//                       <div className="flex items-center gap-1">
//                         <MapPin className="w-4 h-4" />
//                         {position.location}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         {position.type}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Users className="w-4 h-4" />
//                         {position.experience}
//                       </div>
//                     </div>

//                     <div className="flex flex-wrap gap-2">
//                       {position.skills.map((skill, skillIndex) => (
//                         <span key={skillIndex} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="mt-6 lg:mt-0 lg:ml-6">
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
//                     >
//                       Apply Now
//                       <ArrowRight className="w-4 h-4" />
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.section>

//         {/* Call to Action */}
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.8, duration: 0.6 }}
//           className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white"
//         >
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't See Your Role?</h2>
//           <p className="text-xl mb-8 opacity-90">
//             We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future
//             opportunities.
//           </p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300"
//           >
//             Send Your Resume
//           </motion.button>
//         </motion.section>
//       </div>
//     </div>
//   )
// }

// export default CareersPage
