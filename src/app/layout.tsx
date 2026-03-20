import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { PageTransition } from "@/components/layout/page-transition";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChapterOne - The Ultimate Manga Tracking Platform",
  description: "Track, organize, and discover your favorite manga with ChapterOne.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased selection:bg-purple-500/30 selection:text-purple-400`}
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="flex flex-col min-h-screen relative">
              {/* Background elements - Adjusted for theme */}
              <div className="fixed inset-0 z-[-1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-20 pointer-events-none"></div>
              <div className="fixed top-[-50%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-500/10 dark:bg-purple-900/20 blur-[120px] pointer-events-none transition-colors"></div>
              <div className="fixed bottom-[-50%] right-[-10%] w-[70%] h-[70%] rounded-full bg-pink-500/10 dark:bg-pink-900/20 blur-[120px] pointer-events-none transition-colors"></div>
              
              <Sidebar />
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 md:pl-64">
                  <PageTransition>{children}</PageTransition>
                </main>
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
