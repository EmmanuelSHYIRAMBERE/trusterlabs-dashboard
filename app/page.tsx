import React, { Suspense } from "react";
import LoginComponent from "@/components/auth/LoginComponent";

export default function Home() {
  return (
    <Suspense>
      <LoginComponent />
    </Suspense>
  );
}
