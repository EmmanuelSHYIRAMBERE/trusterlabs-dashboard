"use client";

import { useRef } from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

interface CloudinaryResult {
  secure_url: string;
}

interface SingleUploaderProps {
  multiple?: false;
  value?: string;
  onChange: (url: string) => void;
}

interface MultiUploaderProps {
  multiple: true;
  value?: string[];
  onChange: (urls: string[]) => void;
}

type ImageUploaderProps = (SingleUploaderProps | MultiUploaderProps) & {
  disabled?: boolean;
};

export function ImageUploader(props: ImageUploaderProps) {
  const { multiple = false, disabled } = props;
  // Keep a mutable ref so successive onSuccess callbacks always see the latest list
  const accumulatedRef = useRef<string[]>([]);

  const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.event !== "success") return;
    const url = (result.info as CloudinaryResult).secure_url;
    if (multiple) {
      accumulatedRef.current = [...accumulatedRef.current, url];
      (props as MultiUploaderProps).onChange([...accumulatedRef.current]);
    } else {
      (props as SingleUploaderProps).onChange(url);
    }
  };

  // Seed ref with current values when widget opens so new uploads append correctly
  const handleOpen = (open: () => void) => {
    if (multiple) {
      accumulatedRef.current = [...((props as MultiUploaderProps).value ?? [])];
    }
    open();
  };

  const removeMultiple = (index: number) => {
    const current = [...((props as MultiUploaderProps).value ?? [])];
    current.splice(index, 1);
    (props as MultiUploaderProps).onChange(current);
  };

  const singleUrl = !multiple
    ? (props as SingleUploaderProps).value
    : undefined;
  const multiUrls = multiple ? ((props as MultiUploaderProps).value ?? []) : [];

  return (
    <div className="space-y-3">
      {singleUrl && (
        <div className="relative w-full h-48 rounded-md overflow-hidden border border-border">
          <Image
            src={singleUrl}
            alt="Uploaded"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <button
            type="button"
            onClick={() => (props as SingleUploaderProps).onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {multiple && multiUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {multiUrls.map((url, i) => (
            <div
              key={i}
              className="relative h-28 rounded-md overflow-hidden border border-border"
            >
              <Image
                src={url}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
                sizes="33vw"
              />
              <button
                type="button"
                onClick={() => removeMultiple(i)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

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
          multiple,
          maxFiles: multiple ? 15 : 1,
          cropping: true,
          croppingAspectRatio: 1,
          croppingShowDimensions: true,
        }}
        onSuccess={handleSuccess}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => handleOpen(open)}
            disabled={disabled}
            className="flex items-center justify-center gap-2 w-full h-32 p-4 rounded-lg border border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
          >
            <UploadCloud className="h-5 w-5" />
            <span className="text-sm font-medium">
              {multiple ? "Upload Images" : "Upload Image"}
            </span>
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
