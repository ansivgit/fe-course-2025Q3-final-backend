import { z } from 'zod';

export const QuizWidgetSchema = z.object({
  id: z.string(),
  type: z.literal('quiz'),
  tags: z.array(z.string()),
  payload: z.object({
    question: z.string(),
    options: z.array(z.object({ id: z.string(), name: z.string(), value: z.string() })),
    correctAnswersIds: z.array(z.string()),
    explanation: z.string().optional(),
  }),
});

export type QuizWidget = z.infer<typeof QuizWidgetSchema>;

const QuizWidgetsSchema = z.array(QuizWidgetSchema);

export type ValidationResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      errors: { path: (string | number | symbol)[]; message: string }[];
    };

export function validateQuizWidgets(data: unknown): ValidationResult<unknown[]> {
  const result = QuizWidgetsSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
