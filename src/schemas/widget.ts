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

export type Widget = QuizWidget;


