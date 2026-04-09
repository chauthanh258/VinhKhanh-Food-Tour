"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "./Toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <>
        {children}
        <ToastContainer />
      </>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
      <ToastContainer />
    </GoogleOAuthProvider>
  );
}
