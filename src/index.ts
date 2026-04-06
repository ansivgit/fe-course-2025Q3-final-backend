import { app } from './app';

import { CONSTANTS } from './constants';

const port = process.env.PORT ?? CONSTANTS.DEFAULT_PORT;

if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.info(`Server is running on http://localhost:${String(port)}`);
    console.info(`Swagger API docs: http://localhost:${String(port)}/docs`);
  });
}

// biome-ignore lint/style/noDefaultExport: we need 'default' for deploying to Vercel
export default app;
