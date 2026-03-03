import { Router } from 'express';

import { WidgetController } from '../controllers';

import { ROUTES } from '../constants';

const widgetRouter = Router();

const widgetController = new WidgetController();

widgetRouter.get(
  ROUTES.WIDGETS_BY_TYPE,
  widgetController.getWidgetsByType.bind(widgetController),
);

export { widgetRouter };



// import fs from 'node:fs/promises';
// import path from 'node:path';
// import { Router } from 'express';

// import { validateQuizWidgets } from '../schemas/widget';

// import { CONSTANTS } from '../constants';

// const router = Router();

// router.get('/:type', async (req, res) => {
//   const widgetType = req.params.type;
//   const filePath = path.resolve('data/widgets', `${widgetType}.json`);

//   try {
//     const rawData = await fs.readFile(filePath, 'utf8');
//     const data = JSON.parse(rawData);

//     const validationResult = validateQuizWidgets(data);

//     if (!validationResult.success) {
//       return res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json({
//         error: 'Invalid widget data',
//         details: validationResult.errors,
//       });
//     }

//     res.json(validationResult.data);
//   } catch (error: unknown) {
//     if (isFileNotFoundError(error)) {
//       return res.status(CONSTANTS.HTTP_STATUS_NOT_FOUND).json({ error: 'Widget file not found' });
//     }

//     console.error(error);
//     res.status(CONSTANTS.HTTP_STATUS_INTERNAL_ERROR).json({ error: 'Internal server error' });
//   }
// });

// function isFileNotFoundError(error: unknown): boolean {
//   return error instanceof Error && error.message.includes('no such file or directory');
// }

// export { router as widgetRouter };
