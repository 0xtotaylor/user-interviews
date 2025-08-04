import React, { createContext, useContext, useState, ReactNode } from "react";

import { AppContextType, Interview } from "@/types";

/**
 * Application context for managing global interview state.
 * Provides access to interview data and generation status throughout the app.
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Props interface for the AppProvider component.
 */
interface AppProviderProps {
  /** Child components that will have access to the app context */
  children: ReactNode;
}

/**
 * AppProvider component that wraps the application and provides global state management.
 * 
 * This provider manages:
 * - Interview generation status (interviewing boolean)
 * - Generated interview data (interviews array)
 * - State setters for updating the above values
 * 
 * @param props - The component props
 * @param props.children - Child components to render within the provider
 * @returns JSX element wrapping children with context provider
 */
export function AppProvider({ children }: AppProviderProps) {
  // State for tracking whether an interview generation is in progress
  const [interviewing, setInterviewing] = useState<boolean>(false);
  
  // State for storing generated interview data
  const [interviews, setInterviews] = useState<Interview[]>([]);

  // Context value object containing state and setters
  const value: AppContextType = {
    interviews,
    interviewing,
    setInterviews,
    setInterviewing,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Custom hook to access the app context.
 * 
 * This hook provides access to the global interview state and functions
 * to update that state. Must be used within an AppProvider.
 * 
 * @throws {Error} When used outside of an AppProvider
 * @returns {AppContextType} The app context containing interview state and setters
 * 
 * @example
 * ```tsx
 * function InterviewComponent() {
 *   const { interviews, interviewing, setInterviewing } = useApp();
 *   
 *   // Use the context values...
 * }
 * ```
 */
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error(
      "useApp must be used within an AppProvider. " +
      "Make sure to wrap your component tree with <AppProvider>."
    );
  }
  
  return context;
}
