import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Provider from "@/components/Provider";
import { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task manager",
  description: "A tool to manage your schedules and tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <main className="app">
            <Provider>
            <Suspense fallback={<Loading/>}>
              <Navbar />
              {children}
            </Suspense>
            </Provider>
          </main>      
      </body>
    </html>
  );
}
