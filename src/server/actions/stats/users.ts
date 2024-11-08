"use server";

import { db } from "@/server/db/prisma";

/**
 * Get the number of total Namu user
 * @returns {Promise<number>} The number of users in the database
 */
export const getUserCount = async () => db.user.count();

/**
 * Get the total number of users in the previous version of the app
 * @returns {Promise<number>} The number of users in the legacy database
 */
export const getLegacyUserCount = async () => db.legacyUser.count();

/**
 * Get the number of users who have migrated to the new version of the app
 * @returns {Promise<number>} The number of migrated users
 */
export const getMigratedUserCount = async () => {
  return db.legacyUser.count({
    where: {
      newAccountId: { not: null },
    },
  });
};
