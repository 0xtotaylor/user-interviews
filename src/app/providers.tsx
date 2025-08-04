"use client";

import posthog from "posthog-js";
import { useEffect } from "react";
import { PostHogProvider } from "posthog-js/react";

import { AppProvider } from "@/context/AppProvider";
import { ThemeProvider } from "@/context/ThemeProvider";

/**
 * Props interface for the Providers component.
 */
interface ProvidersProps {
  /** Child components to wrap with providers */
  children: React.ReactNode;
}

/**
 * Providers component that wraps the application with all necessary context providers.
 * 
 * This component sets up the provider hierarchy for the entire application:
 * - AppProvider: Global state management for interviews and generation status
 * - PostHogProvider: Analytics and feature flags
 * - ThemeProvider: Dark/light theme management
 * 
 * The providers are nested in a specific order to ensure proper context availability
 * and prevent dependency issues between different context providers.
 * 
 * @param props - Component props
 * @param props.children - Child components to wrap with providers
 * @returns JSX element with nested providers wrapping the children
 */
export function Providers({ children }: ProvidersProps) {
  /**
   * Initialize PostHog analytics on component mount.
   * Only runs once when the component is first rendered.
   */
  useEffect(() => {
    // Only initialize PostHog if the required environment variables are present
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: "identified_only", // Only track identified users for privacy
        capture_pageview: false, // Disable automatic pageview capture for custom handling
        capture_pageleave: true, // Track when users leave pages
        loaded: (posthog) => {
          // Enable debug mode in development
          if (process.env.NODE_ENV === 'development') {
            posthog.debug();
          }
        },
      });
    } else {
      console.warn('PostHog environment variables not set. Analytics will be disabled.');
    }
  }, []);

  return (
    /* Global app state provider - must be outermost for app-wide state access */
    <AppProvider>
      {/* Analytics and feature flags provider */}
      <PostHogProvider client={posthog}>
        {/* Theme provider for dark/light mode support */}
        <ThemeProvider
          attribute="class" // Use class-based theme switching
          defaultTheme="light" // Default to light theme
          enableSystem // Allow system theme preference detection
          disableTransitionOnChange // Prevent flash during theme changes
        >
          {children}
        </ThemeProvider>
      </PostHogProvider>
    </AppProvider>
  );
}
