// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { RotateCcw, CheckCircle, AlertCircle, Loader2, Download, Share2 } from "lucide-react";
// import  ShareActions  from "./ShareActions";
// import { VerificationFormProps } from "../types/kyc";

// export const PassportVerificationForm: React.FC<VerificationFormProps> = ({
//   fields,
//   onSubmit,
//   isLoading = false,
//   result,
//   error,
//   serviceKey,
//   serviceName,
//   serviceDescription,
//   productId,
// }) => {
//   const [formData, setFormData] = useState<any>({});
//   const [showResult, setShowResult] = useState(false);
//   const [showMoreDetails, setShowMoreDetails] = useState(false);
//   const shareTargetRef = useRef<HTMLDivElement | null>(null);

//   // Clear form data and results when service changes
//   useEffect(() => {
//     setFormData({});
//     setShowResult(false);
//   }, [serviceKey]);

//   useEffect(() => {
//     if (result) {
//       setShowResult(true);
//       setShowMoreDetails(false);
//     }
//   }, [result]);

//   const handleReset = () => {
//     setFormData({});
//     setShowResult(false);
//     setShowMoreDetails(false);
//   };

//   const handleChange = (field: string, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await onSubmit(formData);
//   };

//   const renderField = (field: any) => {
//     const commonProps = {
//       key: field.name,
//       id: field.name,
//       label: field.label,
//       required: field.required,
//       placeholder: field.placeholder,
//       onChange: (e: React.ChangeEvent<any>) => handleChange(field.name, e.target.value),
//       value: formData[field.name] || "",
//     };

//     switch (field.type) {
//       case "radio":
//         return (
//           <div key={field.name} className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               {field.label} {field.required && <span className="text-red-500">*</span>}
//             </label>
//             <div className="flex gap-4">
//               {field.options?.map((option: any) => (
//                 <label key={option.value} className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name={field.name}
//                     value={option.value}
//                     checked={formData[field.name] === option.value}
//                     onChange={(e) => handleChange(field.name, e.target.value)}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">{option.label}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         );

//       case "file":
//         return (
//           <div key={field.name}>
//             <label className="block text-sm font-medium text-gray-700">
//               {field.label} {field.required && <span className="text-red-500">*</span>}
//             </label>
//             <input
//               type="file"
//               accept={field.accept || "image/*"}
//               onChange={(e) => {
//                 if (e.target.files && e.target.files[0]) {
//                   handleChange(field.name, e.target.files[0]);
//                 }
//               }}
//               className="mt-1 block w-full text-sm text-gray-500
//                 file:mr-4 file:py-2 file:px-4
//                 file:rounded-md file:border-0
//                 file:text-sm file:font-semibold
//                 file:bg-blue-50 file:text-blue-700
//                 hover:file:bg-blue-100"
//             />
//             {field.helpText && (
//               <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
//             )}
//           </div>
//         );

//       default:
//         return (
//           <div key={field.name}>
//             <label className="block text-sm font-medium text-gray-700">
//               {field.label} {field.required && <span className="text-red-500">*</span>}
//             </label>
//             <input
//               {...commonProps}
//               type={field.type}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//             />
//             {field.helpText && (
//               <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
//             )}
//           </div>
//         );
//     }
//   };

//   const renderSuccessResult = () => {
//     if (!result) return null;

//     const data = result.data || result;
//     const statusMessage = data.message || data.status || "Verification successful";
    
//     // Handle different passport response structures
//     const passportData = data.passport_data || data.rc_data || data.ocr_data || data;
    
//     return (
//       <motion.div
//         ref={shareTargetRef}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-green-50 border border-green-200 rounded-xl p-6 w-full"
//       >
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <CheckCircle className="w-6 h-6 text-green-500" />
//             <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
//             {typeof statusMessage === "string" && statusMessage && (
//               <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
//                 {statusMessage}
//               </span>
//             )}
//           </div>
//           <div className="flex items-center gap-2">
//             <ShareActions
//               targetRef={shareTargetRef}
//               serviceName={serviceName || (serviceKey ?? "Verification")}
//               fileName={`${(serviceName || "passport").toString().toLowerCase().replace(/\s+/g, "-")}-details`}
//               result={result}
//             />
//             <button
//               onClick={handleReset}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
//             >
//               <RotateCcw className="w-4 h-4" />
//               Verify Another
//             </button>
//           </div>
//         </div>

//         {/* Passport-specific result display */}
//         {serviceKey === "mrz-generate" && passportData.mrz_data && (
//           <div className="bg-white rounded-lg p-6 border border-green-200 space-y-4">
//             <h5 className="font-semibold text-gray-900">Generated MRZ</h5>
//             <div className="grid grid-cols-1 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">First Line</p>
//                 <p className="font-mono text-sm bg-gray-100 p-2 rounded">
//                   {passportData.mrz_data.first_line}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Second Line</p>
//                 <p className="font-mono text-sm bg-gray-100 p-2 rounded">
//                   {passportData.mrz_data.second_line}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {serviceKey === "ocr" && passportData.ocr_data && (
//           <div className="bg-white rounded-lg p-6 border border-green-200 space-y-4">
//             <h5 className="font-semibold text-gray-900">Extracted Passport Data</h5>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {passportData.ocr_data.document_id && (
//                 <div>
//                   <p className="text-sm text-gray-500">Document ID</p>
//                   <p className="font-medium">{passportData.ocr_data.document_id}</p>
//                 </div>
//               )}
//               {passportData.ocr_data.first_name && (
//                 <div>
//                   <p className="text-sm text-gray-500">First Name</p>
//                   <p className="font-medium">{passportData.ocr_data.first_name}</p>
//                 </div>
//               )}
//               {passportData.ocr_data.last_name && (
//                 <div>
//                   <p className="text-sm text-gray-500">Last Name</p>
//                   <p className="font-medium">{passportData.ocr_data.last_name}</p>
//                 </div>
//               )}
//               {passportData.ocr_data.date_of_birth && (
//                 <div>
//                   <p className="text-sm text-gray-500">Date of Birth</p>
//                   <p className="font-medium">{passportData.ocr_data.date_of_birth}</p>
//                 </div>
//               )}
//               {passportData.ocr_data.country_code && (
//                 <div>
//                   <p className="text-sm text-gray-500">Country</p>
//                   <p className="font-medium">{passportData.ocr_data.country_code}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {(serviceKey === "verify" || serviceKey === "fetch") && passportData.passport_data && (
//           <div className="bg-white rounded-lg p-6 border border-green-200 space-y-4">
//             <h5 className="font-semibold text-gray-900">Passport Details</h5>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {passportData.passport_data.document_id && (
//                 <div>
//                   <p className="text-sm text-gray-500">Document ID</p>
//                   <p className="font-medium">{passportData.passport_data.document_id}</p>
//                 </div>
//               )}
//               {passportData.passport_data.first_name && (
//                 <div>
//                   <p className="text-sm text-gray-500">First Name</p>
//                   <p className="font-medium">{passportData.passport_data.first_name}</p>
//                 </div>
//               )}
//               {passportData.passport_data.last_name && (
//                 <div>
//                   <p className="text-sm text-gray-500">Last Name</p>
//                   <p className="font-medium">{passportData.passport_data.last_name}</p>
//                 </div>
//               )}
//               {passportData.passport_data.date_of_birth && (
//                 <div>
//                   <p className="text-sm text-gray-500">Date of Birth</p>
//                   <p className="font-medium">{passportData.passport_data.date_of_birth}</p>
//                 </div>
//               )}
//               {passportData.passport_data.file_number && (
//                 <div>
//                   <p className="text-sm text-gray-500">File Number</p>
//                   <p className="font-medium">{passportData.passport_data.file_number}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {serviceKey === "mrz-verify" && (
//           <div className="bg-white rounded-lg p-6 border border-green-200">
//             <div className="text-center">
//               <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//               <h3 className="text-xl font-bold text-green-800 mb-2">
//                 {data.code === "1001" ? "MRZ Valid" : "MRZ Does Not Match"}
//               </h3>
//               <p className="text-gray-600">
//                 {data.code === "1001" 
//                   ? "The MRZ matches the provided passport details." 
//                   : "The MRZ does not match the provided passport details."}
//               </p>
//             </div>
//           </div>
//         )}

//         {serviceKey === "verify" && (
//           <div className="bg-white rounded-lg p-6 border border-green-200">
//             <div className="text-center">
//               <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//               <h3 className="text-xl font-bold text-green-800 mb-2">
//                 {data.code === "1004" ? "Valid Details" : 
//                  data.code === "1003" ? "Passport Doesn't Exist" : 
//                  "Invalid Details"}
//               </h3>
//               <p className="text-gray-600">
//                 {data.code === "1004" ? "Passport details are valid and verified." :
//                  data.code === "1003" ? "Passport does not exist in our database." :
//                  "Passport details do not match our records."}
//               </p>
//             </div>
//           </div>
//         )}
//       </motion.div>
//     );
//   };

//   const renderError = () => {
//     if (!error) return null;
    
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -10 }}
//         className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-3 w-full"
//       >
//         <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
//         <div className="min-w-0 flex-1">
//           <h4 className="font-medium text-red-800 text-sm sm:text-base">Verification Failed</h4>
//           <p className="text-red-600 text-xs sm:text-sm mt-1 break-words">{error}</p>
//         </div>
//       </motion.div>
//     );
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto">
//       {!showResult ? (
//         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//           <div className="mb-6">
//             <h2 className="text-xl font-bold">{serviceName}</h2>
//             <p className="text-blue-100 mt-1">{serviceDescription}</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 gap-6">
//               {fields.map(renderField)}
//             </div>

//             <div className="pt-4">
//               <motion.button
//                 type="submit"
//                 disabled={isLoading}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
//                     Verifying...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
//                     Verify Document
//                   </>
//                 )}
//               </motion.button>
//             </div>
//           </form>

//           {renderError()}
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {renderSuccessResult()}
//         </div>
//       )}
//     </div>
//   );
// };