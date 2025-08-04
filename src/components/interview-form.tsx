"use client";

import { Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useFeatureFlagEnabled } from "posthog-js/react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppProvider";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { interviews as defaultInterviews } from "@/data/interviews";
import { 
  handleFileExport, 
  makeExportRequest 
} from "@/lib/export-utils";
import {
  DEFAULT_INTERVIEW_COUNT,
  MIN_INTERVIEW_COUNT,
  MAX_INTERVIEW_COUNT,
  INTERVIEW_COUNT_STEP,
  MINUTES_PER_INTERVIEW,
  EXPORT_FORMATS,
  DEFAULT_ROLE_PLACEHOLDER,
  DEFAULT_INDUSTRY_PLACEHOLDER,
  DEFAULT_EXPERIENCE_PLACEHOLDER,
  DEFAULT_COMPANY_SIZE_PLACEHOLDER,
  EXPERIENCE_RANGE_PATTERN,
  COMPANY_SIZE_PATTERN,
  BUTTON_TEXT,
  API_ENDPOINTS,
} from "@/constants/app";

/**
 * Initialize Stripe with the publishable key from environment variables.
 * This promise is created once and reused for all Stripe operations.
 */
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

/**
 * Props interface for the InterviewForm component.
 */
interface InterviewFormProps extends React.ComponentPropsWithoutRef<"form"> {
  /** Additional CSS classes to apply to the form */
  className?: string;
}

/**
 * InterviewForm component that handles user input for generating AI interviews.
 * 
 * This component provides:
 * - Form inputs for role, industry, experience, and company size
 * - Slider for selecting number of interviews to generate
 * - Integration with Stripe for payment processing
 * - Export functionality for downloading interview data
 * 
 * The form integrates with the global app context to manage interview state
 * and provides real-time feedback during the generation process.
 * 
 * @param props - Component props including className and standard form props
 * @returns JSX form element for interview generation
 */
export function InterviewForm({
  className,
  ...props
}: InterviewFormProps) {
  // Get interview state from global context
  const { interviews, interviewing } = useApp();
  
  // Form reference for accessing form data during submission
  const formRef = useRef<HTMLFormElement>(null);
  
  // Local state for the number of interviews slider
  const [sliderValue, setSliderValue] = useState<number>(DEFAULT_INTERVIEW_COUNT);
  
  // Feature flag for showing time estimates
  const timeEstimate = useFeatureFlagEnabled("time-estimate");

  /**
   * Handles changes to the interview count slider.
   * 
   * @param value - Array containing the new slider value
   */
  const handleSliderChange = (value: number[]): void => {
    setSliderValue(value[0]);
  };

  /**
   * Handles the Stripe checkout process.
   * Collects form data, creates a checkout session, and redirects to Stripe.
   * 
   * @throws Will log errors to console if checkout fails
   */
  const handleCheckout = async (): Promise<void> => {
    try {
      // Initialize Stripe instance
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }
      
      // Ensure form reference exists
      if (!formRef.current) {
        throw new Error('Form reference not available');
      }
      
      // Extract form data
      const formData = new FormData(formRef.current);
      
      // Prepare checkout session data
      const checkoutData = {
        role: formData.get("role") as string,
        industry: formData.get("industry") as string,
        range: formData.get("experienceRange") as string,
        employee_range: formData.get("employeeRange") as string,
        interviews: sliderValue,
        returnUrl: window.location.origin,
      };
      
      // Create checkout session
      const response = await fetch(API_ENDPOINTS.CHECKOUT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });
      
      if (!response.ok) {
        throw new Error(`Checkout request failed with status: ${response.status}`);
      }
      
      const session = await response.json();
      
      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      // TODO: Show user-friendly error message via toast
    }
  };

  /**
   * Handles exporting interview data in various formats.
   * Uses default interviews if no custom interviews are generated.
   * 
   * @param path - API endpoint path for the export
   * @param newTab - Whether to open the export in a new tab
   */
  const handleExport = async (path: string, newTab: boolean): Promise<void> => {
    try {
      // Use generated interviews or fall back to default examples
      const interviewData = interviews.length === 0 ? defaultInterviews : interviews;
      
      // Make the export request
      const { blob, filename } = await makeExportRequest(path, interviewData);
      
      // Handle the file based on the specified method
      handleFileExport(blob, filename, newTab);
    } catch (error) {
      console.error("Error downloading file:", error);
      // TODO: Show user-friendly error message via toast
    }
  };

  /**
   * Handles form submission by preventing default behavior and initiating checkout.
   * 
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    handleCheckout();
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">AI Interview Generator</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Define your ideal customer profile below
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            name="role"
            type="text"
            placeholder={DEFAULT_ROLE_PLACEHOLDER}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="industry">Industry</Label>
          </div>
          <Input
            id="industry"
            name="industry"
            type="text"
            placeholder={DEFAULT_INDUSTRY_PLACEHOLDER}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="experienceRange">Experience</Label>
          <Input
            id="experienceRange"
            name="experienceRange"
            type="text"
            placeholder={DEFAULT_EXPERIENCE_PLACEHOLDER}
            pattern={EXPERIENCE_RANGE_PATTERN}
            title="Enter a valid range (e.g. 2-7)"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="employeeRange">Company Size</Label>
          <Input
            id="employeeRange"
            name="employeeRange"
            type="text"
            placeholder={DEFAULT_COMPANY_SIZE_PLACEHOLDER}
            pattern={COMPANY_SIZE_PATTERN}
            title="Enter a valid range (e.g. 100-1000)"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="interviews">
            How many interviews would you like to generate?
          </Label>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Min</span>
              <span className="text-sm text-muted-foreground">
                {sliderValue}
              </span>
            </div>
            <Slider
              value={[sliderValue]}
              disabled={interviewing}
              onValueChange={handleSliderChange}
              min={MIN_INTERVIEW_COUNT}
              max={MAX_INTERVIEW_COUNT}
              step={INTERVIEW_COUNT_STEP}
            />
            {timeEstimate && (
              <div className="text-sm text-muted-foreground text-center pt-4">
                Estimated wait: {sliderValue * MINUTES_PER_INTERVIEW} minutes
              </div>
            )}
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button disabled={interviewing}>
                {interviewing && <Loader2 className="animate-spin" />}
                {interviewing ? BUTTON_TEXT.GENERATING : BUTTON_TEXT.GENERATE}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Estimated wait: {sliderValue * MINUTES_PER_INTERVIEW} minutes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={interviewing}>
              Download{" "}
              {!interviewing && interviews.length === 0
                ? BUTTON_TEXT.DOWNLOAD_EXAMPLES
                : BUTTON_TEXT.DOWNLOAD_INTERVIEWS}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            {EXPORT_FORMATS.map((format) => (
              <DropdownMenuItem
                key={format.label}
                onClick={() => handleExport(format.path, format.newTab)}
              >
                {format.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </form>
  );
}
