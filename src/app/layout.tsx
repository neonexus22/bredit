import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <Toaster />
        {/* @ts-expect-error Server Component */}
        <Navbar />

        <div className="container max-w-7xl mx-auto h-full pt-12">
          {children}
        </div>
        {/* this modal thing is not working */}
        {/* {modal}  */}
      </body>
    </html>
  );
}
