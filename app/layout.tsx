import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SidebarProvider } from "@/contexts/SidebarContext";
import LayoutClient from "@/components/LayoutClient";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CRM Apps",
  description: "CRM Dashboard by CMLABS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <SidebarProvider>
          <LayoutClient>{children}</LayoutClient>
        </SidebarProvider>
      </body>
    </html>
  );
}