import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

/**
 * Geist Sans font configuration.
 * Modern, clean sans-serif font used for body text and UI elements.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
});

/**
 * Geist Mono font configuration.
 * Monospace font used for code blocks and technical content.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
});

/**
 * Application metadata for SEO and social media sharing.
 * This metadata applies to all pages unless overridden.
 */
export const metadata: Metadata = {
  title: "AI Interview Generator - Uncover user needs in minutes, not hours",
  description: "Define your ideal customer profile and generate premium user interviews using AI. Perfect for user research, product discovery, and understanding customer pain points.",
  keywords: [
    "user interviews",
    "AI",
    "user research",
    "product discovery",
    "customer interviews",
    "user experience",
    "market research"
  ],
  authors: [{ name: "AI Interview Generator" }],
  creator: "AI Interview Generator",
  publisher: "AI Interview Generator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "AI Interview Generator - Uncover user needs in minutes, not hours",
    description: "Define your ideal customer profile and generate premium user interviews using AI.",
    type: "website",
    locale: "en_US",
    siteName: "AI Interview Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Interview Generator - Uncover user needs in minutes, not hours",
    description: "Define your ideal customer profile and generate premium user interviews using AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Props interface for the RootLayout component.
 */
interface RootLayoutProps {
  /** Child components to render within the layout */
  children: React.ReactNode;
}

/**
 * Root layout component that wraps the entire application.
 * 
 * This layout provides:
 * - Font configuration with Geist Sans and Geist Mono
 * - Global CSS styles and Tailwind CSS
 * - Application providers (theme, app context, etc.)
 * - Toast notification system
 * - HTML document structure and metadata
 * 
 * The layout is applied to all pages in the application and includes
 * essential providers and global UI components.
 * 
 * @param props - Component props
 * @param props.children - Page components to render within the layout
 * @returns HTML document structure with providers and global components
 */
export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Application providers for context, theme, etc. */}
        <Providers>
          {children}
        </Providers>
        
        {/* Global toast notification system */}
        <Toaster />
        
        {/* Development-only script for debugging */}
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                console.log('AI Interview Generator - Development Mode');
                console.log('Environment:', '${process.env.NODE_ENV}');
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
