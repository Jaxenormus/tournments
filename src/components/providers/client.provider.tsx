"use client";

import { Toaster } from "sonner";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export const ClientProviders = (props: ClientProvidersProps) => {
  return (
    <>
      <Toaster richColors />
      {props.children}
    </>
  );
};
