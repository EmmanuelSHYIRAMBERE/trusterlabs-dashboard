"use client";

import React from "react";

// third party

// project imports

import AuthProvider from "@/app/auth/AuthProvider";
import QueryClientProvider from "@/app/QueryClientProvider";


const ClientRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <QueryClientProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
  );
};

export default ClientRootLayout;
