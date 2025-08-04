import { Interview } from "./interview";

/**
 * Application context type definition for managing global interview state.
 * This interface defines the shape of the context that will be used throughout
 * the application to manage interview generation state and data.
 */
export interface AppContextType {
  /** Array of generated interview objects containing role, industry, and questions */
  interviews: Interview[];
  /** Boolean flag indicating if an interview generation process is currently active */
  interviewing: boolean;
  /** State setter function to update the interviewing status */
  setInterviewing: React.Dispatch<React.SetStateAction<boolean>>;
  /** State setter function to update the interviews array */
  setInterviews: React.Dispatch<React.SetStateAction<Interview[]>>;
}
