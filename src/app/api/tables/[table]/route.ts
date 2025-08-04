import * as XLSX from "xlsx";
import { type NextRequest } from "next/server";
import { Interview } from "@/types";

/**
 * Supported export formats and their configurations.
 */
const EXPORT_FORMATS = {
  CSV: 'csv',
  TXT: 'txt',
  XLSX: 'xlsx',
  JSON: 'json',
  HTML: 'html',
} as const;

type ExportFormat = typeof EXPORT_FORMATS[keyof typeof EXPORT_FORMATS];

/**
 * Content types for different export formats.
 */
const CONTENT_TYPES = {
  [EXPORT_FORMATS.CSV]: 'text/csv',
  [EXPORT_FORMATS.TXT]: 'text/plain',
  [EXPORT_FORMATS.XLSX]: 'application/vnd.ms-excel',
  [EXPORT_FORMATS.JSON]: 'application/json',
  [EXPORT_FORMATS.HTML]: 'text/html',
} as const;

/**
 * Interface for the export request body.
 */
interface ExportRequestBody {
  /** Array of interview objects to export */
  interviews: Interview[];
}

/**
 * Valid table names that can be exported.
 */
const VALID_TABLES = ['interviews'] as const;
type ValidTable = typeof VALID_TABLES[number];

/**
 * Validates that the provided table name is supported.
 * 
 * @param table - Table name to validate
 * @throws Error if table name is invalid
 */
function validateTableName(table: string): asserts table is ValidTable {
  if (!table) {
    throw new Error("Table name is required");
  }
  
  if (!VALID_TABLES.includes(table as ValidTable)) {
    throw new Error(`Table '${table}' not found. Supported tables: ${VALID_TABLES.join(', ')}`);
  }
}

/**
 * Validates the export format parameter.
 * 
 * @param format - Format string to validate
 * @returns Validated format or default to HTML
 */
function validateFormat(format: string | null): string {
  if (!format) {
    return EXPORT_FORMATS.HTML; // Default format
  }
  
  const validFormats = Object.values(EXPORT_FORMATS);
  if (!validFormats.includes(format as ExportFormat)) {
    throw new Error(`Unsupported format '${format}'. Supported formats: ${validFormats.join(', ')}`);
  }
  
  return format;
}

/**
 * Validates the request body contains interview data.
 * 
 * @param body - Request body to validate
 * @returns Validated interview data
 * @throws Error if data is missing or invalid
 */
function validateRequestBody(body: unknown): Interview[] {
  if (!body || typeof body !== 'object') {
    throw new Error("Request body is required");
  }
  
  const { interviews } = body as ExportRequestBody;
  
  if (!interviews) {
    throw new Error("No interview data provided");
  }
  
  if (!Array.isArray(interviews)) {
    throw new Error("Interview data must be an array");
  }
  
  if (interviews.length === 0) {
    throw new Error("At least one interview is required for export");
  }
  
  return interviews;
}

/**
 * POST handler for exporting interview data in various formats.
 * 
 * Supports multiple export formats:
 * - CSV: Comma-separated values for spreadsheet applications
 * - TXT: Tab-separated text format
 * - XLSX: Excel spreadsheet format
 * - JSON: JavaScript Object Notation for programmatic use
 * - HTML: Web-viewable table format
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing table name
 * @returns Response with exported data or error message
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    // Extract and validate parameters
    const searchParams = request.nextUrl.searchParams;
    const formatParam = searchParams.get("format");
    const table = (await params).table;
    
    // Validate inputs
    validateTableName(table);
    const format = validateFormat(formatParam);
    
    // Parse and validate request body
    const body = await request.json();
    const interviewData = validateRequestBody(body);
    
    // Convert to worksheet for processing
    const worksheet = XLSX.utils.json_to_sheet(interviewData);
    const tableName = "Interviews"; // Display name for files

    // Generate response based on format
    switch (format) {
      case EXPORT_FORMATS.CSV: {
        const csv = XLSX.utils.sheet_to_csv(worksheet, {
          forceQuotes: true,
        });
        
        return new Response(csv, {
          status: 200,
          headers: {
            "Content-Disposition": `attachment; filename="${tableName}.csv"`,
            "Content-Type": CONTENT_TYPES.csv,
          },
        });
      }
      
      case EXPORT_FORMATS.TXT: {
        const txt = XLSX.utils.sheet_to_txt(worksheet, {
          forceQuotes: true,
        });
        
        return new Response(txt, {
          status: 200,
          headers: {
            "Content-Disposition": `attachment; filename="${tableName}.txt"`,
            "Content-Type": CONTENT_TYPES.txt,
          },
        });
      }
      
      case EXPORT_FORMATS.XLSX: {
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Interviews");
        
        const buffer = XLSX.write(workbook, { 
          type: "buffer", 
          bookType: "xlsx" 
        });
        
        return new Response(buffer, {
          status: 200,
          headers: {
            "Content-Disposition": `attachment; filename="${tableName}.xlsx"`,
            "Content-Type": CONTENT_TYPES.xlsx,
          },
        });
      }
      
      case EXPORT_FORMATS.JSON: {
        return Response.json(interviewData, {
          headers: {
            "Content-Type": CONTENT_TYPES.json,
          },
        });
      }
      
      case EXPORT_FORMATS.HTML:
      default: {
        const html = XLSX.utils.sheet_to_html(worksheet);
        
        return new Response(html, {
          status: 200,
          headers: {
            "Content-Type": CONTENT_TYPES.html,
          },
        });
      }
    }
  } catch (error) {
    // Log error for debugging (use proper logging service in production)
    console.error("Export error:", error);
    
    // Return appropriate error response
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ error: error.message }), 
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // Fallback for unknown errors
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred during export" }), 
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
