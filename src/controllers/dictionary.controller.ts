import type { Request, Response } from 'express';
import { TOPICS, DIFFICULTIES } from '../constants/dictionaries.js';

export const dictionaryController = (_request: Request, res: Response): void => {
  res.json({
    topics: TOPICS,
    difficulties: DIFFICULTIES,
  });
};