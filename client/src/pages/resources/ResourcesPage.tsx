// "use client"

// import type React from "react"
// import { useState } from "react"
// import { motion } from "framer-motion"
// import { PageHeader } from "../../components/common/PageHeader"
// import { SearchInput } from "../../components/common/SearchInput"
// import { FilterTabs } from "../../components/common/FilterTabs"
// import { ResourceCard } from "../../components/resources/ResourceCard"
// import { ResourceType } from "../../types/resource"

// // Mock data - replace with actual API calls
// const mockResources = [
//   {
//     id: "1",
//     title: "Getting Started with Identity Verification",
//     description: "A comprehensive guide to implementing identity verification in your application",
//     type: ResourceType.DOCUMENTATION,
//     category: "Getting Started",
//     content: "",
//     author: { name: "John Doe", role: "Technical Writer" },
//     tags: ["identity", "verification", "guide"],
//     readTime: 10,
//     isPublished: true,
//     createdAt: "2024-01-15",
//     updatedAt: "2024-01-15",
//     featuredImage: "/placeholder.svg",
//   },
//   // Add more mock resources...
// ]

// const ResourcesPage: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedType, setSelectedType] = useState("")

//   const resourceTypes = Object.values(ResourceType)
//   const typeTabs = [
//     { id: "", label: "All Resources", count: mockResources.length },
//     ...resourceTypes.map((type) => ({
//       id: type,
//       label: type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
//       count: mockResources.filter((r) => r.type === type).length,
//     })),
//   ]

//   const filteredResources = mockResources.filter((resource) => {
//     const matchesSearch =
//       resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       resource.description.toLowerCase().includes(searchQuery.toLowerCase())
//     const matchesType = !selectedType || resource.type === selectedType
//     return matchesSearch && matchesType
//   })

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <PageHeader title="Resources" subtitle="Documentation, guides, and tools to help you succeed with VerifyMyKyc" />

//       <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
//         {/* Search and Filters */}
//         <div className="mb-8 space-y-6">
//           <SearchInput placeholder="Search resources..." onSearch={setSearchQuery} className="max-w-md" />

//           <FilterTabs tabs={typeTabs} activeTab={selectedType} onTabChange={setSelectedType} />
//         </div>

//         {/* Resources Grid */}
//         <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredResources.map((resource, index) => (
//             <motion.div
//               key={resource.id}
//               layout
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//             >
//               <ResourceCard resource={resource} />
//             </motion.div>
//           ))}
//         </motion.div>

//         {filteredResources.length === 0 && (
//           <div className="text-center py-12">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
//             <p className="text-gray-600">Try adjusting your search or filter criteria</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ResourcesPage
