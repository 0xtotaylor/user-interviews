"use client";

import useSWR from "swr";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/context/AppProvider";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { JobResponse, JobStatus, Interview } from "@/types";
import { interviews as defaultInterviews } from "@/data/interviews";
import { handleFileExport, makeExportRequest } from "@/lib/export-utils";
import {
  JOB_STATUS_POLLING_INTERVAL,
  EXPORT_FORMATS,
  QUESTION_LABELS,
  QUESTION_CELL_MAX_HEIGHT,
  SKELETON_ROWS_COUNT,
  TOAST_MESSAGES,
  API_ENDPOINTS,
} from "@/constants/app";

/**
 * Initiates the interview generation process with the provided session ID.
 * 
 * @param sessionId - Stripe session ID from successful payment
 * @returns Promise resolving to job response with job ID
 * @throws Error if the request fails or returns non-ok status
 */
const startInterviews = async (sessionId: string): Promise<JobResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.START_INTERVIEWS}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to start interview generation");
  }

  return response.json();
};

/**
 * Fetches the current status of an interview generation job.
 * 
 * @param url - Full URL to the job status endpoint
 * @returns Promise resolving to job status information
 * @throws Error if the request fails or returns error status
 */
const fetchStatus = async (url: string): Promise<JobStatus> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "An unexpected error occurred");
  }
  
  return response.json();
};


/**
 * Props interface for the InterviewTable component.
 */
interface InterviewTableProps {
  /** Stripe session ID used to initiate interview generation */
  sessionId: string;
}

/**
 * InterviewTable component that displays generated interviews in a table format.
 * 
 * This component handles:
 * - Initiating interview generation based on Stripe session ID
 * - Polling job status and showing progress indicators
 * - Displaying completed interviews in a responsive table
 * - Context menu for exporting individual interviews
 * - Loading states with skeleton placeholders
 * 
 * The component automatically starts the interview generation process when a
 * session ID is provided and polls for completion status.
 * 
 * @param props - Component props
 * @param props.sessionId - Stripe session ID from successful payment
 * @returns JSX element displaying interview table or loading state
 */
export function InterviewTable({ sessionId }: InterviewTableProps) {
  // Toast hook for displaying user notifications
  const { toast } = useToast();
  
  // Local state for tracking the current job ID
  const [jobId, setJobId] = useState<string | null>(null);
  
  // Global app state for interviews and generation status
  const { interviews, setInterviewing, setInterviews } = useApp();

  /**
   * SWR hook to handle interview generation initiation.
   * Only runs when sessionId is provided and handles URL cleanup.
   */
  const { error: startError } = useSWR(
    sessionId ? ["start-interviews", sessionId] : null,
    async () => {
      // Clean up the session_id from URL to prevent re-triggering
      const url = new URL(window.location.href);
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url);

      // In development, use default interviews for testing
      if (process.env.NODE_ENV === "development") {
        setInterviews(defaultInterviews);
        return;
      }

      // Start the interview generation process
      setInterviewing(true);
      const { jobId } = await startInterviews(sessionId);
      setJobId(jobId);
      return jobId;
    },
    {
      // Disable automatic revalidation to prevent duplicate requests
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: (error) => {
        setInterviewing(false);
        toast({
          title: TOAST_MESSAGES.ERROR_TITLE,
          description: error.message,
          variant: "destructive",
        });
      },
    }
  );

  /**
   * SWR hook to poll job status when a job is active.
   * Handles completion, failure, and progress updates.
   */
  const { data: statusData, error: statusError } = useSWR(
    jobId
      ? `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.INTERVIEW_STATUS}/${jobId}`
      : null,
    fetchStatus,
    {
      // Poll every 15 seconds for status updates
      refreshInterval: JOB_STATUS_POLLING_INTERVAL,
      onSuccess: (data) => {
        if (data.status === "completed") {
          // Job completed successfully
          setInterviews(data.data || []);
          setInterviewing(false);
          setJobId(null);
          toast({
            title: TOAST_MESSAGES.SUCCESS_TITLE,
            description: TOAST_MESSAGES.SUCCESS_DESCRIPTION,
            variant: "default",
          });
        } else if (data.status === "failed") {
          // Job failed with error
          setInterviewing(false);
          setJobId(null);
          toast({
            title: TOAST_MESSAGES.ERROR_TITLE,
            description: data.error,
            variant: "destructive",
          });
        }
        // For "pending" status, continue polling (no action needed)
      },
      onError: (error) => {
        // Handle polling errors
        setInterviewing(false);
        setJobId(null);
        toast({
          title: TOAST_MESSAGES.ERROR_TITLE,
          description: error.message,
          variant: "destructive",
        });
      },
    }
  );

  /**
   * Handles exporting a single interview in the specified format.
   * 
   * @param path - API endpoint path for the export
   * @param newTab - Whether to open in new tab or download
   * @param interview - Single interview object to export
   */
  const handleExport = async (
    path: string,
    newTab: boolean,
    interview: Interview
  ): Promise<void> => {
    try {
      // Make export request for single interview
      const { blob, filename } = await makeExportRequest(path, [interview]);
      
      // Handle the file export
      handleFileExport(blob, filename, newTab);
    } catch (error) {
      // Ensure error is properly typed
      const err = error instanceof Error ? error : new Error(String(error));
      toast({
        title: TOAST_MESSAGES.EXPORT_ERROR_TITLE,
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (statusData?.status === "pending") {
    return (
      <div className="h-screen flex flex-col p-4">
        <div className="mb-4">
          <Progress value={statusData.progress || 0} className="w-full" />
          <p className="text-sm text-gray-500 mt-2 text-center">
            {TOAST_MESSAGES.PROGRESS_MESSAGE}{" "}
            {statusData.progress || 0}% complete.
          </p>
        </div>
        <div className="flex-grow overflow-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Table className="w-full table-fixed h-full">
              <TableHeader className="bg-gray-100 sticky top-0 z-10">
                <TableRow>
                  <th className="w-32 px-4 py-2">
                    <Skeleton className="w-full h-8" />
                  </th>
                  <th className="w-32 px-4 py-2">
                    <Skeleton className="w-full h-8" />
                  </th>
                  <th className="px-4 py-2">
                    <Skeleton className="w-full h-8" />
                  </th>
                  <th className="px-4 py-2">
                    <Skeleton className="w-full h-8" />
                  </th>
                  <th className="px-4 py-2">
                    <Skeleton className="w-full h-8" />
                  </th>
                  <th className="px-4 py-2">
                    <Skeleton className="w-full h-8" />
                  </th>
                  <th className="px-4 py-2">
                    <Skeleton className="w-full h-8" />
                  </th>
                </TableRow>
              </TableHeader>
              <TableBody className="h-full">
                {Array.from({ length: SKELETON_ROWS_COUNT }).map((_, index) => (
                  <TableRow
                    key={index}
                    className="odd:bg-white even:bg-gray-50"
                  >
                    <td className="w-32 px-4 py-2">
                      <Skeleton className="w-full h-10" />
                    </td>
                    <td className="w-32 px-4 py-2">
                      <Skeleton className="w-full h-10" />
                    </td>
                    <td className="px-4 py-2">
                      <Skeleton className="w-full h-10" />
                    </td>
                    <td className="px-4 py-2">
                      <Skeleton className="w-full h-10" />
                    </td>
                    <td className="px-4 py-2">
                      <Skeleton className="w-full h-10" />
                    </td>
                    <td className="px-4 py-2">
                      <Skeleton className="w-full h-10" />
                    </td>
                    <td className="px-4 py-2">
                      <Skeleton className="w-full h-10" />
                    </td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  if (startError || statusError) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 p-4">
      <div className="flex-1 overflow-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table className="w-full table-fixed">
            <TableHeader className="bg-gray-100 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-32 px-4 py-2">Role</TableHead>
                <TableHead className="w-32 px-4 py-2">Industry</TableHead>
                <TableHead className="px-4 py-2">{QUESTION_LABELS.QUESTION_ONE}</TableHead>
                <TableHead className="px-4 py-2">{QUESTION_LABELS.QUESTION_TWO}</TableHead>
                <TableHead className="px-4 py-2">
                  {QUESTION_LABELS.QUESTION_THREE}
                </TableHead>
                <TableHead className="px-4 py-2">{QUESTION_LABELS.QUESTION_FOUR}</TableHead>
                <TableHead className="px-4 py-2">{QUESTION_LABELS.QUESTION_FIVE}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interviews.map((interview, index) => (
                <ContextMenu key={index}>
                  <ContextMenuTrigger asChild>
                    <TableRow className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors">
                      <TableCell className="capitalize px-4 py-2 w-32">
                        {interview.role}
                      </TableCell>
                      <TableCell className="capitalize px-4 py-2 w-32">
                        {interview.industry}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <div className={`${QUESTION_CELL_MAX_HEIGHT} overflow-y-auto`}>
                          <ReactMarkdown>
                            {interview.question_one}
                          </ReactMarkdown>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <div className={`${QUESTION_CELL_MAX_HEIGHT} overflow-y-auto`}>
                          <ReactMarkdown>
                            {interview.question_two}
                          </ReactMarkdown>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <div className={`${QUESTION_CELL_MAX_HEIGHT} overflow-y-auto`}>
                          <ReactMarkdown>
                            {interview.question_three}
                          </ReactMarkdown>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <div className={`${QUESTION_CELL_MAX_HEIGHT} overflow-y-auto`}>
                          <ReactMarkdown>
                            {interview.question_four}
                          </ReactMarkdown>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <div className={`${QUESTION_CELL_MAX_HEIGHT} overflow-y-auto`}>
                          <ReactMarkdown>
                            {interview.question_five}
                          </ReactMarkdown>
                        </div>
                      </TableCell>
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    {EXPORT_FORMATS.map((format) => (
                      <ContextMenuItem
                        key={format.label}
                        onClick={() =>
                          handleExport(format.path, format.newTab, interview)
                        }
                      >
                        {format.label}
                      </ContextMenuItem>
                    ))}
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
