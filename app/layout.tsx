import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { ChatBot } from "@/components/ChatBot";
import { LocaleProvider } from "@/components/LocaleProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Thinkio — Study Smarter",
  description: "AI-powered quizzes, flash cards, and lessons from any subject or uploaded file.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={`${inter.variable} font-sans min-h-screen antialiased`}>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <LocaleProvider>
              {children}
              <ChatBot />
            </LocaleProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
