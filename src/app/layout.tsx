import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Robocoz",
  description:
    "Electronics components, 3D printing and PCB manufacturing services from one trusted partner.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-white`}>
        <AuthSessionProvider>
          <div className="min-h-screen bg-white">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
        </AuthSessionProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
