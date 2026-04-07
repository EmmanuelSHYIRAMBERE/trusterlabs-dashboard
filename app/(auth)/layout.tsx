import type { Metadata } from "next";
import "./auth.css";
import { ToastProvider } from "@/components/toast-provider";
import HydrationFix from "@/components/HydrationFix";
import ClientOnly from "@/components/ClientOnly";
import ClientRootLayout from "../ClientRootLayout";

export const metadata: Metadata = {
  title: "TrusterLabs | Sign In",
  description:
    "Sign in to the TrusterLabs cybersecurity dashboard to monitor threats, manage incidents, and protect your organization.",
  keywords: [
    "TrusterLabs",
    "cybersecurity",
    "dashboard",
    "sign in",
    "threat monitoring",
  ],
  authors: [{ name: "TrusterLabs" }],
  openGraph: {
    title: "TrusterLabs | Sign In",
    description:
      "Access the TrusterLabs cybersecurity monitoring and management platform.",
    siteName: "TrusterLabs",
    type: "website",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080810] overflow-hidden">
      <ClientRootLayout>
        <ClientOnly>
          <ToastProvider>
            <HydrationFix>{children}</HydrationFix>
          </ToastProvider>
        </ClientOnly>
      </ClientRootLayout>
    </div>
  );
}
