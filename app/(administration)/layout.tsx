import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "TrusterLabs | Administrations",
  description:
    "Sign in to the TrusterLabs cybersecurity dashboard to monitor threats, manage incidents, and protect your organization.",
  keywords: ["TrusterLabs", "cybersecurity", "dashboard"],
  authors: [{ name: "TrusterLabs" }],
  openGraph: {
    title: "TrusterLabs | Administrations",
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
  return <DashboardLayout>{children} </DashboardLayout>;
}
