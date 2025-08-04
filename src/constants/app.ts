/**
 * Application-wide constants for the AI Interview Generator.
 * Centralizes magic numbers, strings, and configuration values.
 */

/** Default number of interviews to generate */
export const DEFAULT_INTERVIEW_COUNT = 5;

/** Minimum number of interviews that can be generated */
export const MIN_INTERVIEW_COUNT = 5;

/** Maximum number of interviews that can be generated */
export const MAX_INTERVIEW_COUNT = 20;

/** Step size for the interview count slider */
export const INTERVIEW_COUNT_STEP = 1;

/** Estimated time per interview in minutes (used for time calculations) */
export const MINUTES_PER_INTERVIEW = 2;

/** Polling interval for job status checks in milliseconds */
export const JOB_STATUS_POLLING_INTERVAL = 15000;

/** Maximum height for question cells in the table */
export const QUESTION_CELL_MAX_HEIGHT = 'max-h-48';

/** Number of skeleton rows to show during loading */
export const SKELETON_ROWS_COUNT = 15;

/** Experience range validation pattern */
export const EXPERIENCE_RANGE_PATTERN = '^[0-9]+-[0-9]+$';

/** Company size validation pattern */
export const COMPANY_SIZE_PATTERN = '^[0-9]+-[0-9]+$';

/** Default role placeholder text */
export const DEFAULT_ROLE_PLACEHOLDER = 'Software Engineer';

/** Default industry placeholder text */
export const DEFAULT_INDUSTRY_PLACEHOLDER = 'Technology, Information and Internet';

/** Default experience range placeholder text */
export const DEFAULT_EXPERIENCE_PLACEHOLDER = '2-7 years';

/** Default company size placeholder text */
export const DEFAULT_COMPANY_SIZE_PLACEHOLDER = '100-1000 Employees';

/** Supported export formats configuration */
export const EXPORT_FORMATS = [
  { label: 'TXT', path: '/api/tables/interviews?format=txt', newTab: false },
  { label: 'CSV', path: '/api/tables/interviews?format=csv', newTab: false },
  { label: 'XLSX', path: '/api/tables/interviews?format=xlsx', newTab: false },
  { label: 'JSON', path: '/api/tables/interviews?format=json', newTab: true },
  { label: 'HTML', path: '/api/tables/interviews?format=html', newTab: true },
] as const;

/** Interview question labels for table headers */
export const QUESTION_LABELS = {
  QUESTION_ONE: 'Q1: Day in the life',
  QUESTION_TWO: 'Q2: Pain points',
  QUESTION_THREE: 'Q3: Existing solutions',
  QUESTION_FOUR: 'Q4: Impact',
  QUESTION_FIVE: 'Q5: Ideal solution',
} as const;

/** Toast messages */
export const TOAST_MESSAGES = {
  SUCCESS_TITLE: 'Success!',
  SUCCESS_DESCRIPTION: 'Your interviews have been generated.',
  ERROR_TITLE: 'Error',
  EXPORT_ERROR_TITLE: 'Export Error',
  PROGRESS_MESSAGE: 'Please do not close this tab. Generating interviews...',
} as const;

/** Button text constants */
export const BUTTON_TEXT = {
  GENERATING: 'Generating',
  GENERATE: 'Generate',
  DOWNLOAD_EXAMPLES: 'Download Examples',
  DOWNLOAD_INTERVIEWS: 'Download Interviews',
} as const;

/** API endpoints */
export const API_ENDPOINTS = {
  CHECKOUT: '/api/checkout',
  TABLES_INTERVIEWS: '/api/tables/interviews',
  START_INTERVIEWS: '/api/v1/ideation/start-interviews',
  INTERVIEW_STATUS: '/api/v1/ideation/interview-status',
} as const;