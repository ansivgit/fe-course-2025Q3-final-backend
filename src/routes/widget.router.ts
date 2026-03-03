import fs from 'node:fs/promises';
import path from 'node:path';
import { Router } from 'express';
import { z } from 'zod';

import { QuizWidgetSchema } from '../schemas/index';

const router = Router();

const QuizWidgetsSchema = z.array(QuizWidgetSchema);

router.get('/:type', async (req, res) => {
  const widgetType = req.params.type;
  const filePath = path.resolve('data/widgets', `${widgetType}.json`);

  try {
    const rawData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(rawData);

    const parseResult = QuizWidgetsSchema.safeParse(data);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
        code: issue.code,
      }));
      return res.status(400).json({ error: 'Invalid widget data', details: formattedErrors });
    }

    res.json(parseResult.data);
  } catch (error: unknown) {
    if (isFileNotFoundError(error)) {
      return res.status(404).json({ error: 'Widget file not found' });
    }

    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function isFileNotFoundError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('no such file or directory');
}

export { router as widgetRouter };
