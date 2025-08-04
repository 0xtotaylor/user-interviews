import VideoHero from "@/components/video-hero";
import { InterviewForm } from "@/components/interview-form";
import { InterviewTable } from "@/components/interview-table";
import { ErrorBoundary } from "@/components/error-boundary";

/**
 * Props interface for the Home page component.
 */
interface HomeProps {
  /** Search parameters from the URL, including Stripe session ID */
  searchParams: Promise<{ session_id?: string }>;
}

/**
 * Home page component for the AI Interview Generator application.
 * 
 * This is the main landing page that provides:
 * - Interview generation form on the left side
 * - Video hero section or interview results table on the right side
 * - Responsive layout that stacks on smaller screens
 * - Integration with Stripe payment flow via session_id parameter
 * 
 * The page automatically switches between showing the video hero (default state)
 * and the interview table (after successful payment) based on the presence of
 * a session_id in the URL parameters.
 * 
 * Layout:
 * - Desktop: Two-column grid layout
 * - Mobile: Single column with form only (table hidden)
 * 
 * @param props - Component props
 * @param props.searchParams - URL search parameters containing optional session_id
 * @returns JSX element representing the home page
 */
export default async function Home({ searchParams }: HomeProps) {
  // Extract session ID from search parameters
  // This will be present after successful Stripe checkout
  const sessionId = (await searchParams).session_id;

  return (
    <ErrorBoundary>
      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Left column: Interview form */}
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <InterviewForm />
            </div>
          </div>
        </div>
        
        {/* Right column: Video hero or interview results */}
        <div className="relative hidden bg-muted lg:block">
          {sessionId ? (
            // Show interview table after successful payment
            <InterviewTable sessionId={sessionId} />
          ) : (
            // Show video hero by default
            <VideoHero />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

/**
 * Metadata for the home page.
 * Used for SEO and social media sharing.
 */
export const metadata = {
  title: 'AI Interview Generator - Create User Interview Questions',
  description: 'Generate targeted user interview questions using AI. Perfect for user research, product discovery, and understanding customer needs.',
  keywords: ['user interviews', 'AI', 'user research', 'product discovery', 'customer interviews'],
};
