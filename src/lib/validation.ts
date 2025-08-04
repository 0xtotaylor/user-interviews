/**
 * Validation utilities for form inputs and data validation.
 * Provides reusable validation functions with consistent error messages.
 */

import { 
  EXPERIENCE_RANGE_PATTERN, 
  COMPANY_SIZE_PATTERN 
} from '@/constants/app';

/**
 * Validates that a string is not empty after trimming whitespace.
 * 
 * @param value - The string to validate
 * @param fieldName - Name of the field for error messages
 * @returns Validation result with success flag and optional error message
 */
export function validateRequired(
  value: string, 
  fieldName: string
): { isValid: boolean; error?: string } {
  const trimmedValue = value.trim();
  
  if (!trimmedValue) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }
  
  return { isValid: true };
}

/**
 * Validates that a range string follows the pattern "number-number".
 * 
 * @param value - The range string to validate (e.g., "2-7")
 * @param fieldName - Name of the field for error messages
 * @returns Validation result with success flag and optional error message
 */
export function validateRange(
  value: string, 
  fieldName: string
): { isValid: boolean; error?: string } {
  const trimmedValue = value.trim();
  
  if (!trimmedValue) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }
  
  const pattern = fieldName.toLowerCase().includes('experience') 
    ? EXPERIENCE_RANGE_PATTERN 
    : COMPANY_SIZE_PATTERN;
    
  if (!new RegExp(pattern).test(trimmedValue)) {
    return {
      isValid: false,
      error: `${fieldName} must be in format "number-number" (e.g., "2-7")`
    };
  }
  
  return { isValid: true };
}

/**
 * Validates interview count is within acceptable bounds.
 * 
 * @param count - Number of interviews requested
 * @param min - Minimum allowed count
 * @param max - Maximum allowed count
 * @returns Validation result with success flag and optional error message
 */
export function validateInterviewCount(
  count: number,
  min: number,
  max: number
): { isValid: boolean; error?: string } {
  if (count < min) {
    return {
      isValid: false,
      error: `Minimum ${min} interviews required`
    };
  }
  
  if (count > max) {
    return {
      isValid: false,
      error: `Maximum ${max} interviews allowed`
    };
  }
  
  return { isValid: true };
}

/**
 * Validates form data for interview generation.
 * 
 * @param formData - Form data object containing user inputs
 * @returns Object with validation results for each field
 */
export function validateInterviewForm(formData: {
  role: string;
  industry: string;
  experienceRange: string;
  employeeRange: string;
  interviews: number;
}) {
  const errors: Record<string, string> = {};
  let isValid = true;
  
  // Validate required fields
  const roleValidation = validateRequired(formData.role, 'Role');
  if (!roleValidation.isValid) {
    errors.role = roleValidation.error!;
    isValid = false;
  }
  
  const industryValidation = validateRequired(formData.industry, 'Industry');
  if (!industryValidation.isValid) {
    errors.industry = industryValidation.error!;
    isValid = false;
  }
  
  // Validate range fields
  const experienceValidation = validateRange(formData.experienceRange, 'Experience range');
  if (!experienceValidation.isValid) {
    errors.experienceRange = experienceValidation.error!;
    isValid = false;
  }
  
  const employeeValidation = validateRange(formData.employeeRange, 'Company size');
  if (!employeeValidation.isValid) {
    errors.employeeRange = employeeValidation.error!;
    isValid = false;
  }
  
  // Validate interview count
  const countValidation = validateInterviewCount(formData.interviews, 5, 20);
  if (!countValidation.isValid) {
    errors.interviews = countValidation.error!;
    isValid = false;
  }
  
  return { isValid, errors };
}