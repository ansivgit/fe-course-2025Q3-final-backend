import 'dotenv/config';

import { closeDbConnection, DataRepository, getDb } from '../src/data-access';
import type { Widget } from '../src/schemas';
import { getWidgetSchema } from '../src/schemas';
import { validateWidgets } from '../src/utils';

import type { MongoAnswer } from '../src/types';

const seed = async (): Promise<void> => {
  const quizImported: { default: unknown[] } = await import('../data/widgets/quiz.json');
  const matchImported: { default: unknown[] } = await import('../data/widgets/match-game.json');

  const seedingData: unknown[] = [...quizImported.default, ...matchImported.default];

  if (seedingData.length === 0) {
    throw new Error('Seeding data is empty');
  }

  const validQuizWidgets = validateWidgets(quizImported.default, getWidgetSchema('quiz'));
  const validMatchWidgets = validateWidgets(matchImported.default, getWidgetSchema('match-game'));

  const validWidgets: Widget[] = [...validQuizWidgets, ...validMatchWidgets];

  console.info('🌱 DB seeding started...');

  const db = await getDb();
  const widgetRepository = new DataRepository();

  await db.collection('widgets').deleteMany({});
  console.info("🧹 ---> DB collection 'users' cleaned");

  for (const [index, widgetData] of validWidgets.entries()) {
    try {
      const created: MongoAnswer = await widgetRepository.create(widgetData);
      console.info(`✅ Widget #${index} created (${created.insertedId})`);
    } catch (error) {
      console.error(`❌ Error creating widget #${index}:`, error);
    }
  }

  await closeDbConnection();
  console.info('🎉 Widgets seeding finished!');
};

seed()
  .catch((error: unknown) => {
    console.error('🔥 Error seeding widgets:', error);
  })
  .finally(() => {
    void closeDbConnection();
  });
