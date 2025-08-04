/**
 * Utility functions for handling interview data exports.
 * Provides reusable functions for downloading files and handling export logic.
 */

/**
 * Extracts filename from Content-Disposition header.
 * 
 * @param contentDisposition - The Content-Disposition header value
 * @param defaultFileName - Fallback filename if header parsing fails
 * @returns The extracted or default filename
 */
export function extractFilenameFromHeader(
  contentDisposition: string,
  defaultFileName: string = 'Interview'
): string {
  const filenameRegex = /filename="(.+)"/;
  const matches = filenameRegex.exec(contentDisposition);
  
  return matches?.[1] || defaultFileName;
}

/**
 * Downloads a blob as a file with the specified filename.
 * Creates a temporary download link and triggers the download.
 * 
 * @param blob - The blob data to download
 * @param filename - The filename for the downloaded file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Opens a blob in a new browser tab.
 * Useful for viewable formats like HTML or JSON.
 * 
 * @param blob - The blob data to open
 */
export function openBlobInNewTab(blob: Blob): void {
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, '_blank');
  
  // Note: We don't immediately revoke the URL here as the new tab needs time to load
  // The browser will handle cleanup when the tab is closed
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 1000);
}

/**
 * Handles file export based on the specified method (download or new tab).
 * 
 * @param blob - The blob data to handle
 * @param filename - The filename for downloaded files
 * @param openInNewTab - Whether to open in new tab or download
 */
export function handleFileExport(
  blob: Blob,
  filename: string,
  openInNewTab: boolean
): void {
  if (openInNewTab) {
    openBlobInNewTab(blob);
  } else {
    downloadBlob(blob, filename);
  }
}

/**
 * Makes an export API request and handles the response.
 * 
 * @param path - API endpoint path
 * @param interviews - Interview data to export
 * @returns Promise resolving to response blob and filename
 * @throws Error if the export request fails
 */
export async function makeExportRequest(
  path: string,
  interviews: unknown[]
): Promise<{ blob: Blob; filename: string }> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interviews }),
  });

  if (!response.ok) {
    throw new Error(`Export failed with status: ${response.status}`);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('Content-Disposition') || '';
  const filename = extractFilenameFromHeader(contentDisposition);

  return { blob, filename };
}