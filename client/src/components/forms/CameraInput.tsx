import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw, Trash2, CheckCircle } from "lucide-react";

interface CameraInputProps {
    onCapture: (file: File) => void;
    label?: string;
    error?: string;
}

export const CameraInput: React.FC<CameraInputProps> = ({
    onCapture,
    label = "Capture Photo",
    error,
}) => {
    const webcamRef = useRef<Webcam>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "environment", // Use back camera on mobile if available
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImageSrc(imageSrc);
            setIsCameraOpen(false);

            // Convert base64 to File object
            fetch(imageSrc)
                .then((res) => res.blob())
                .then((blob) => {
                    const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                    onCapture(file);
                });
        }
    }, [webcamRef, onCapture]);

    const retake = () => {
        setImageSrc(null);
        setIsCameraOpen(true);
    };

    const clear = () => {
        setImageSrc(null);
        setIsCameraOpen(false);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
                {label}
            </label>

            {/* Preview Area */}
            <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center group hover:border-blue-400 transition-colors">

                {/* State: Image Captured */}
                {imageSrc ? (
                    <div className="relative w-full h-full">
                        <img
                            src={imageSrc}
                            alt="Captured"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={retake}
                                className="p-2 bg-white rounded-full text-gray-800 hover:bg-blue-50 transition-colors"
                                title="Retake Photo"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={clear}
                                className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                                title="Clear Photo"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <CheckCircle className="w-3 h-3" /> Captured
                        </div>
                    </div>
                ) : isCameraOpen ? (
                    /* State: Camera Open */
                    <div className="relative w-full h-full bg-black">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={capture}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 p-4 bg-white rounded-full shadow-lg hover:scale-105 transition-transform active:scale-95"
                        >
                            <div className="w-12 h-12 rounded-full border-4 border-blue-600 flex items-center justify-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-full" />
                            </div>
                        </button>
                    </div>
                ) : (
                    /* State: Idle / Start Camera */
                    <div className="text-center p-6 space-y-3">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Camera className="w-6 h-6" />
                        </div>
                        <p className="text-sm text-gray-500">
                            Take a photo using your device camera
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsCameraOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Open Camera
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-600 animate-in slide-in-from-left-1">
                    {error}
                </p>
            )}
        </div>
    );
};
