import { z } from 'zod';

import { BadRequestError } from '../errors';

import { ERROR_MESSAGES } from '../constants';

const QuizWidgetSchema = z.object({
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

const MatchWidgetSchema = z.object({
  id: z.string(),
  type: z.literal('match-game'),
  tags: z.array(z.string()),
  payload: z.array(
    z.object({
      id: z.number(),
      value: z.string(),
      content: z.string(),
    }),
  ),
});

export type QuizWidget = z.infer<typeof QuizWidgetSchema>;
export type MatchWidget = z.infer<typeof MatchWidgetSchema>;

export type Widget = QuizWidget | MatchWidget;

export type WidgetValidation<T extends Widget = Widget> = T[];

const widgetSchemas = {
  quiz: QuizWidgetSchema,
  'match-game': MatchWidgetSchema,
} as const;

type WidgetType = keyof typeof widgetSchemas;

const isWidgetType = (type: string): type is WidgetType => {
  return type in widgetSchemas;
};

export const getWidgetSchema = (type: string): z.ZodType<Widget> => {
  if (!isWidgetType(type)) {
    throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
  }

  return widgetSchemas[type];
};
