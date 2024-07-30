import { CreateAccountCredentials } from "@/common/types";
import { createAccount } from "@/server/db/queries/account";
import { GenericClient } from "@/server/db/utils/dbTypes";
import { Role } from "@prisma/client";

export const createUserAccount = async (
  client: GenericClient,
  accountCredentials: CreateAccountCredentials,
) => {
  return createAccount({ client, accountCredentials, role: Role.USER });
};

export const createAdminAccount = async (
  client: GenericClient,
  accountCredentials: CreateAccountCredentials,
) => {
  return createAccount({ client, accountCredentials, role: Role.ADMIN });
};

export const createSuperAdminAccount = async (
  client: GenericClient,
  accountCredentials: CreateAccountCredentials,
) => {
  return createAccount({ client, accountCredentials, role: Role.SUPERADMIN });
};
