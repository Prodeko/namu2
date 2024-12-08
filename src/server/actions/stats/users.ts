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

/**
 * Get the number of logins between the given dates, grouped by device type
 */
export const getLoginDataByDeviceType = async (
  startDate: Date,
  endDate: Date,
) => {
  return db.userLogin.groupBy({
    by: ["deviceType"],
    _count: {
      _all: true,
    },
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
};

/**
 * Get the number of logins between the given dates, grouped by login method
 */
export const getLoginDataByLoginMethod = async (
  startDate: Date,
  endDate: Date,
) => {
  return db.userLogin.groupBy({
    by: ["loginMethod"],
    _count: {
      _all: true,
    },
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
};
