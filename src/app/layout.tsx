import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/components/queryprovider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MovieRecs",
  description: "Movie recommendation app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            success: {
              style: {
                background: "#22c55e",
                color: "#fff",
              },
            },
            error: {
              style: {
                background: "#f56060ff",
                color: "#fff",
              },
            },
          }}
        />

      </body>
    </html>
  );
}
