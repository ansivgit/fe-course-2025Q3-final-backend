import 'dotenv/config';

import { closeDbConnection, getDb, UserRepository } from '../src/data-access';
import { userDataValidation } from '../src/utils';

import type { MongoAnswer, User } from '../src/types';

const seed = async (): Promise<void> => {
  const imported: { default: Omit<User, '_id'>[] } = await import('../data/users.json');
  if (imported.default.length === 0) {
    throw new Error('Seeding data is not defined');
  }

  const seedingData = imported.default;

  if (seedingData.length === 0) {
    throw new Error('Seeding data is empty');
  } else {
    for (const item of seedingData) {
      try {
        userDataValidation(item);
        console.info(`✅ Validation passed for entity ${item.login}`);
      } catch (error) {
        console.error(`❌ Error creating entity ${item.login}:`, error);
        throw new Error('Validation failed');
      }
    }
  }

  console.info('🌱 DB seeding started...');

  const db = await getDb();
  const userRepository = new UserRepository();

  await db.collection('users').deleteMany({});
  console.info("🧹 ---> DB collection 'users' cleaned");

  for (const userData of seedingData) {
    try {
      const created: MongoAnswer = await userRepository.create(userData);
      console.info(`✅ Entity created: ${userData.login} (${created.acknowledged})`);
    } catch (error) {
      console.error(`❌ Error creating entity ${userData.login}:`, error);
    }
  }

  await closeDbConnection();
  console.info('🎉 DB seeding finished!');
};

seed()
  .catch((error: unknown) => {
    console.error('🔥 Error seeding DB:', error);
  })
  .finally(() => {
    void closeDbConnection();
  });
