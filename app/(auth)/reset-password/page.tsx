import ResetPasswordComponent from "@/components/auth/ResetPasswordComponent";
import React, { Suspense } from "react";

const ForgotPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordComponent />
    </Suspense>
  );
};

export default ForgotPasswordPage;
