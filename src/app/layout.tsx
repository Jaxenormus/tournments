import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientProviders } from "@/components/providers/client.provider";
import { cn } from "@/utils/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tournaments",
  description: "Tournaments management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <body className={cn("mx-auto lg:max-w-7xl", inter.className)}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
