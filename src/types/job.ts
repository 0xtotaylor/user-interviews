import { Interview } from "./interview";

/**
 * Response structure for interview generation job initiation.
 * Returned when starting a new batch of interview generation.
 */
export interface JobResponse {
  /** Unique identifier for the interview generation job */
  jobId: string;
}

/**
 * Job status structure for tracking interview generation progress.
 * Used to poll the status of ongoing interview generation jobs.
 */
export interface JobStatus {
  /** Current status of the job - pending while processing, completed when done, failed on error */
  status: "pending" | "completed" | "failed";
  /** Generated interview data, only present when status is "completed" */
  data?: Interview[];
  /** Error message if job failed, only present when status is "failed" */
  error?: string;
  /** Completion percentage (0-100), used during pending status to show progress */
  progress?: number;
}
