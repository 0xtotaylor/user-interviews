import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

/**
 * Initialize Stripe with secret key and API version.
 * Uses the latest stable API version for consistent behavior.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

/**
 * Interface for the checkout request body.
 */
interface CheckoutRequestBody {
  /** Job role for the interview generation */
  role: string;
  /** Industry sector */
  industry: string;
  /** Experience range (e.g., "2-7") */
  range: string;
  /** Company size range (e.g., "100-1000") */
  employee_range: string;
  /** Number of interviews to generate */
  interviews: number;
  /** URL to redirect to after payment */
  returnUrl: string;
}

/**
 * Default values for checkout session metadata.
 * These ensure consistent data even if form fields are empty.
 */
const DEFAULT_CHECKOUT_VALUES = {
  role: "Software Engineer",
  industry: "Technology, Information and Internet",
  range: "2-7",
  employee_range: "100-1000",
  country: "USA",
  processed: "no",
} as const;

/**
 * POST handler for creating Stripe checkout sessions.
 * 
 * This endpoint handles the payment flow for interview generation:
 * 1. Validates required environment variables
 * 2. Extracts form data from the request
 * 3. Creates a Stripe checkout session with metadata
 * 4. Returns the session for client-side redirection
 * 
 * @param req - Next.js request object containing checkout data
 * @returns JSON response with Stripe session or error message
 */
export async function POST(req: NextRequest) {
  try {
    // Validate required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not configured");
    }
    
    if (!process.env.NEXT_PUBLIC_STRIPE_PRICE) {
      throw new Error("Stripe price ID is not configured");
    }

    // Extract and validate request body
    const requestBody: CheckoutRequestBody = await req.json();
    const { 
      role, 
      industry, 
      range, 
      employee_range, 
      interviews, 
      returnUrl 
    } = requestBody;

    // Validate required fields
    if (!returnUrl) {
      throw new Error("Return URL is required");
    }

    // Validate interview count
    const interviewCount = interviews || 5;
    if (interviewCount < 1 || interviewCount > 50) {
      throw new Error("Interview count must be between 1 and 50");
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      // Only accept card payments
      payment_method_types: ["card"],
      
      // Line items for the purchase
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE,
          quantity: interviewCount,
        },
      ],
      
      // One-time payment mode
      mode: "payment",
      
      // Redirect URLs after payment
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}`,
      
      // Store form data in session metadata for processing after payment
      metadata: {
        role: role || DEFAULT_CHECKOUT_VALUES.role,
        industry: industry || DEFAULT_CHECKOUT_VALUES.industry,
        range: range || DEFAULT_CHECKOUT_VALUES.range,
        employee_range: employee_range || DEFAULT_CHECKOUT_VALUES.employee_range,
        country: DEFAULT_CHECKOUT_VALUES.country,
        processed: DEFAULT_CHECKOUT_VALUES.processed,
      },
    });

    return NextResponse.json(session);
  } catch (error: unknown) {
    // Log error for debugging (in production, use proper logging service)
    console.error("Checkout error:", error);
    
    // Return user-friendly error message
    const message = error instanceof Error 
      ? error.message 
      : "An unexpected error occurred during checkout";
      
    return NextResponse.json(
      { error: message }, 
      { status: 500 }
    );
  }
}
