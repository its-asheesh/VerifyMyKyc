// import React, { useState, useRef, useEffect } from "react"
// import { aadhaarApi } from "../../services/api/aadhaarApi"
// import { panApi } from "../../services/api/panApi"
// import { DIGILOCKER_EAADHAAR_REDIRECT_URI } from "../../services/api/constants"
// import type { AadhaarServiceMeta } from "../../utils/aadhaarServices"
// import { aadhaarServices } from "../../utils/aadhaarServices"

// interface AadhaarVerificationFormProps {
//   service: AadhaarServiceMeta
// }

// export const AadhaarVerificationForm: React.FC<AadhaarVerificationFormProps> = ({ service }) => {
//   const [form, setForm] = useState<any>({})
//   const [loading, setLoading] = useState(false)
//   const [result, setResult] = useState<any>(null)
//   const [error, setError] = useState<string | null>(null)
//   const videoRef = useRef<HTMLVideoElement | null>(null)
//   const canvasRef = useRef<HTMLCanvasElement | null>(null)
//   const [cameraOpen, setCameraOpen] = useState(false)
//   const [stream, setStream] = useState<MediaStream | null>(null)
//   const [cameraBusy, setCameraBusy] = useState(false)
//   const [autoSubmit, setAutoSubmit] = useState(false)

//   // On mount, check for transaction_id in URL (after Digilocker consent)
//   useEffect(() => {
//     if (service.key !== "fetch-eaadhaar") return
//     const params = new URLSearchParams(window.location.search)
//     const transactionId = params.get("transaction_id")
//     if (transactionId) {
//       setForm({ transaction_id: transactionId, json: true })
//       setAutoSubmit(true)
//     }
//   }, [service.key])

//   useEffect(() => {
//     if (autoSubmit && form.transaction_id) {
//       handleSubmit()
//       setAutoSubmit(false)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [autoSubmit, form.transaction_id])

//   // Ensure video element always gets the stream when camera is open
//   useEffect(() => {
//     if (cameraOpen && stream && videoRef.current) {
//       videoRef.current.srcObject = stream
//       videoRef.current.play().catch(() => {})
//     }
//     // Clean up video srcObject when camera closes
//     if (!cameraOpen && videoRef.current) {
//       videoRef.current.srcObject = null
//     }
//   }, [cameraOpen, stream])

//   // Camera logic for base64 capture
//   const openCamera = async () => {
//     if (cameraOpen || cameraBusy) return // Prevent reopening if already open or busy
//     setError(null)
//     setCameraBusy(true)
//     try {
//       if (stream) {
//         setCameraOpen(true)
//         return
//       }
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
//       setStream(mediaStream)
//       setCameraOpen(true)
//     } catch (err) {
//       setError("Unable to access camera")
//     } finally {
//       setCameraBusy(false)
//     }
//   }

//   const captureImage = () => {
//     if (videoRef.current && canvasRef.current) {
//       const context = canvasRef.current.getContext("2d")
//       if (context) {
//         context.drawImage(videoRef.current, 0, 0, 320, 240)
//         const dataUrl = canvasRef.current.toDataURL("image/png")
//         const base64 = dataUrl.replace(/^data:image\/png;base64,/, "")
//         setForm((prev: any) => ({ ...prev, base64_data: base64 }))
//         closeCamera()
//       }
//     }
//   }

//   const closeCamera = () => {
//     if (!cameraOpen) return // Prevent closing if already closed
//     setCameraOpen(false)
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop())
//       setStream(null)
//     }
//   }

//   const handleRetake = async () => {
//     setForm((prev: any) => ({ ...prev, base64_data: undefined }))
//     closeCamera()
//     await new Promise(res => setTimeout(res, 200)) // Small delay to ensure cleanup
//     openCamera()
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target
//     if (type === "file") {
//       const fileInput = e.target as HTMLInputElement
//       setForm((prev: any) => ({ ...prev, [name]: fileInput.files && fileInput.files[0] }))
//     } else {
//       setForm((prev: any) => ({ ...prev, [name]: value }))
//     }
//   }

//   const handleConsentChange = (value: 'Y' | 'N') => {
//     setForm((prev: any) => ({ ...prev, consent: value }))
//   }

//   const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setForm((prev: any) => ({ ...prev, json: e.target.value }))
//   }

//   const handleFetchEAadhaarClick = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const initResp = await panApi.digilockerInit({
//         redirect_uri: DIGILOCKER_EAADHAAR_REDIRECT_URI,
//         consent: "Y"
//       })
//       const url = initResp?.data?.authorization_url
//       if (url) {
//         window.location.href = url
//       } else {
//         setError("Failed to get Digilocker authorization URL")
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to start Digilocker flow")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmit = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault()
//     setLoading(true)
//     setError(null)
//     setResult(null)
//     try {
//       let response
//       if (service.key === "ocr-v2") {
//         const formData = new FormData()
//         service.formFields.forEach(field => {
//           if (form[field.name]) formData.append(field.name, form[field.name])
//         })
//         response = await aadhaarApi.ocrV2(formData)
//       } else if (service.key === "ocr-v1") {
//         response = await aadhaarApi.ocrV1(form)
//       } else if (service.key === "fetch-eaadhaar") {
//         let jsonPayload = form.json
//         if (typeof jsonPayload === "string") {
//           try { jsonPayload = JSON.parse(jsonPayload) } catch { throw new Error("Invalid JSON payload") }
//         }
//         response = await aadhaarApi.fetchEAadhaar({ ...form, json: jsonPayload })
//       }
//       setResult(response)
//     } catch (err: any) {
//       setError(err?.message || "Verification failed")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <form className="space-y-4" onSubmit={handleSubmit}>
//       {service.key === "fetch-eaadhaar" && !form.transaction_id ? (
//         <button type="button" className="bg-blue-600 text-white px-6 py-2 rounded" onClick={handleFetchEAadhaarClick} disabled={loading}>
//           {loading ? "Redirecting to Digilocker..." : "Fetch eAadhaar via Digilocker"}
//         </button>
//       ) : (
//         <>
//           {service.formFields.map(field => (
//             <div key={field.name}>
//               <label className="block font-medium mb-1">{field.label}{field.required && " *"}</label>
//               {/* Special handling for base64_data in ocr-v1 */}
//               {service.key === "ocr-v1" && field.name === "base64_data" ? (
//                 <div className="flex flex-col gap-2">
//                   <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={openCamera} disabled={cameraOpen || cameraBusy}>
//                     {cameraOpen ? "Camera Open" : "Open Camera"}
//                   </button>
//                   {form.base64_data ? (
//                     <div>
//                       <img
//                         src={`data:image/png;base64,${form.base64_data}`}
//                         alt="Captured Aadhaar"
//                         className="w-40 h-32 object-contain border rounded"
//                       />
//                       <div className="flex gap-2 mt-2">
//                         <button type="button" className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={handleRetake}>
//                           Retake
//                         </button>
//                       </div>
//                       <div className="text-xs text-green-700 mt-1">Image captured! ({form.base64_data.length} chars)</div>
//                     </div>
//                   ) : (
//                     <div className="text-xs text-gray-500">No image captured yet.</div>
//                   )}
//                   {cameraOpen && (
//                     <div className="flex flex-col items-center gap-2 mt-2">
//                       <video ref={videoRef} width={320} height={240} autoPlay className="border rounded" />
//                       <canvas ref={canvasRef} width={320} height={240} style={{ display: "none" }} />
//                       <div className="flex gap-2">
//                         <button type="button" className="bg-green-600 text-white px-3 py-1 rounded" onClick={captureImage}>
//                           Capture
//                         </button>
//                         <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded" onClick={closeCamera}>
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (field.name === "consent") ? (
//                 <div className="flex gap-4">
//                   <label className="flex items-center gap-1">
//                     <input
//                       type="radio"
//                       name="consent"
//                       value="Y"
//                       checked={form.consent === "Y"}
//                       onChange={() => handleConsentChange("Y")}
//                       required={field.required}
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center gap-1">
//                     <input
//                       type="radio"
//                       name="consent"
//                       value="N"
//                       checked={form.consent === "N"}
//                       onChange={() => handleConsentChange("N")}
//                       required={field.required}
//                     />
//                     No
//                   </label>
//                 </div>
//               ) : field.type === "file" ? (
//                 <input type="file" name={field.name} required={field.required} onChange={handleChange} />
//               ) : field.type === "json" ? (
//                 <textarea name={field.name} required={field.required} onChange={handleJsonChange} className="w-full border rounded p-2" rows={4} />
//               ) : (
//                 <input type="text" name={field.name} required={field.required} onChange={handleChange} className="w-full border rounded p-2" />
//               )}
//             </div>
//           ))}
//           <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded" disabled={loading}>
//             {loading ? "Verifying..." : "Verify"}
//           </button>
//         </>
//       )}
//       {error && <div className="text-red-600 mt-2">{error}</div>}
//       {result && result.data && result.data.eaadhaar && (
//         <pre className="bg-gray-100 rounded p-4 mt-4 overflow-x-auto text-sm">
//           {JSON.stringify(result.data.eaadhaar, null, 2)}
//         </pre>
//       )}
//       {result && result.data && result.data.eaadhaar_link && (
//         <div className="mt-4">
//           <a href={result.data.eaadhaar_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download eAadhaar XML</a>
//         </div>
//       )}
//       {result && !result.data && (
//         <pre className="bg-gray-100 rounded p-4 mt-4 overflow-x-auto text-sm">
//           {JSON.stringify(result, null, 2)}
//         </pre>
//       )}
//     </form>
//   )
// } 