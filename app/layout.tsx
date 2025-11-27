import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Materna",
  description: "AI assisted platform for maternity care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={`${geistSans.variable} ${geistMono.variable} w-full h-full max-w-screen max-h-screen flex antialiased bg-pink-50 text-gray-900`}
    >
      <Sidebar />
      <main className="flex justify-center items-center p-10 min-h-screen w-3/4">
        <div className="w-full max-w-3xl">{children}</div>
      </main>
    </body>
    </html>
  );
}
