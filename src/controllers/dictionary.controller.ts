import type { Request, Response } from 'express';

import { DIFFICULTIES, TOPICS } from '../constants/dictionaries';

export const dictionaryController = (_request: Request, res: Response): void => {
  res.json({
    topics: TOPICS,
    difficulties: DIFFICULTIES,
  });
};
