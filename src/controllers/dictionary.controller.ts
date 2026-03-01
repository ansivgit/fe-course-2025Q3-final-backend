import { DIFFICULTIES, TOPICS } from '../constants/dictionaries.js';

import type { Request, Response } from 'express';

export const dictionaryController = (_request: Request, res: Response): void => {
  res.json({
    topics: TOPICS,
    difficulties: DIFFICULTIES,
  });
};
