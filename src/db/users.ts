import { db } from './index.js';
import { users } from './schema.js';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string) {
  await db
    .insert(users)
    .values({
      id: uid,
      email,
      displayName: displayName || null,
    })
    .onConflictDoNothing({ target: users.id });

  const [user] = await db.select().from(users).where(eq(users.id, uid));
  return user;
}
