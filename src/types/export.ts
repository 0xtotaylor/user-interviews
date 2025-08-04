import { Interview } from "./interview";

/**
 * Export configuration interface for downloading interview data.
 * Defines the parameters needed to export interviews in various formats.
 */
export interface Export {
  /** API endpoint path for the export request */
  path: string;
  /** Array of interview objects to be exported */
  interviews: Interview[];
  /** Whether to open the export in a new browser tab (for viewable formats like HTML/JSON) */
  newTab?: boolean;
  /** Optional default filename for the exported file */
  defaultFileName?: string;
}
