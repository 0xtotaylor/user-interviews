/**
 * Interview data structure representing a complete user interview.
 * Contains role/industry information and five standardized interview questions.
 */
export interface Interview {
  /** Job role/position being interviewed for (e.g., "Software Engineer") */
  role: string;
  /** Industry sector (e.g., "Technology, Information and Internet") */
  industry: string;
  /** Question 1: Day in the life - Understanding daily responsibilities and workflow */
  question_one: string;
  /** Question 2: Pain points - Identifying current challenges and frustrations */
  question_two: string;
  /** Question 3: Existing solutions - Current tools and approaches being used */
  question_three: string;
  /** Question 4: Impact - How challenges affect work and objectives */
  question_four: string;
  /** Question 5: Ideal solution - Vision for perfect problem resolution */
  question_five: string;
}
