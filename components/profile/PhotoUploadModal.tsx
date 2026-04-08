"use client";

import { PhotoUploadModalProps } from "@/types/profile";
import { AnimatePresence, motion } from "framer-motion";
import { X, Camera, Check } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

interface CloudinaryResult {
  public_id: string;
  secure_url: string;
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isLoading,
  progress,
  currentAvatar,
  initials,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.event !== "success") return;

    const info = result.info as CloudinaryResult;
    const url = info.secure_url;

    setPreviewUrl(url);
    setUploadedUrl(url);
  };

  const handleUpload = () => {
    if (uploadedUrl) {
      onUpload(uploadedUrl);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setUploadedUrl(null);
  };

  useEffect(() => {
    if (!isOpen) {
      setPreviewUrl(null);
      setUploadedUrl(null);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Change Profile Photo
              </h3>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-orange-500"
                  />
                </div>
                <p className="text-center text-sm text-gray-600">
                  Uploading... {progress}%
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Preview Section */}
                <div className="flex flex-col items-center mb-4">
                  {previewUrl ? (
                    <div className="relative">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                      />
                      <button
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : currentAvatar ? (
                    <Image
                      src={currentAvatar}
                      alt="Current"
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold border-4 border-gray-200">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Cloudinary Upload Widget */}
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_KEY!}
                  options={{
                    sources: [
                      "local",
                      "camera",
                      "dropbox",
                      "facebook",
                      "gettyimages",
                      "google_drive",
                      "instagram",
                      "istock",
                      "shutterstock",
                      "unsplash",
                      "url",
                    ],
                    multiple: false,
                    maxFiles: 1,
                    maxFileSize: 5000000, // 5MB
                    clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                    cropping: true,
                    croppingAspectRatio: 1,
                    croppingShowDimensions: true,
                    folder: "profile_photos", // Optional: organize in Cloudinary
                  }}
                  onSuccess={handleUploadSuccess}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors cursor-pointer"
                    >
                      <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Click to upload
                      </p>
                      <p className="text-xs text-gray-600">
                        PNG, JPG up to 5MB
                      </p>
                    </button>
                  )}
                </CldUploadWidget>

                {/* Action Buttons */}
                {previewUrl && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Upload Photo
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoUploadModal;
