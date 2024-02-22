import bcrypt from "bcrypt";

import { CreateAccountCredentials } from "@/common/types";
import { Role } from "@prisma/client";

import { db } from "../prisma";

const createAccount = async ({
  accountCredentials,
  role,
}: {
  accountCredentials: CreateAccountCredentials;
  role: Role;
}) => {
  const { firstName, lastName, userName, pinCode } = accountCredentials;
  const pinHash = await bcrypt.hash(pinCode, 10);
  return db.user.create({
    data: {
      firstName,
      lastName,
      userName,
      role,
      pinHash,
    },
  });
};

export const createUserAccount = async (
  accountCredentials: CreateAccountCredentials,
) => {
  return createAccount({ accountCredentials, role: Role.USER });
};

export const createAdminAccount = async (
  accountCredentials: CreateAccountCredentials,
) => {
  return createAccount({ accountCredentials, role: Role.ADMIN });
};

export const createSuperAdminAccount = async (
  accountCredentials: CreateAccountCredentials,
) => {
  return createAccount({ accountCredentials, role: Role.SUPERADMIN });
};

export const updatePincode = async (newPincode: string, userId: number) => {
  const pinHash = await bcrypt.hash(newPincode, 10);
  return db.user.update({
    where: {
      id: userId,
    },
    data: {
      pinHash,
    },
  });
};
