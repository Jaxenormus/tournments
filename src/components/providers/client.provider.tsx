"use client";

import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export const ClientProviders = (props: ClientProvidersProps) => {
  return (
    <>
      <Toaster richColors />
      <SessionProvider>{props.children}</SessionProvider>
    </>
  );
};
