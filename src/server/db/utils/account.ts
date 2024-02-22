import { CreateAccountCredentials } from "@/common/types";
import { db } from "@/server/db/prisma";
import { createPincodeHash } from "@/server/db/utils/auth";
import { Role } from "@prisma/client";

const createAccount = async ({
  accountCredentials,
  role,
}: {
  accountCredentials: CreateAccountCredentials;
  role: Role;
}) => {
  const { firstName, lastName, userName, pinCode } = accountCredentials;
  const pinHash = await createPincodeHash(pinCode);
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
  const pinHash = await createPincodeHash(newPincode);
  return db.user.update({
    where: {
      id: userId,
    },
    data: {
      pinHash,
    },
  });
};
