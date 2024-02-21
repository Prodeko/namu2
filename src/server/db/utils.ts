import bcrypt from "bcrypt";

import { ClientProduct, CreateAccountCredentials } from "@/common/types";
import { db } from "@/server/db/prisma";
import { Product, Role } from "@prisma/client";

const parseProduct = (product: Product): ClientProduct => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.sellingPrice.toNumber(),
    imageFilePath: product.imageUrl,
    stock: product.stock,
  };
};

export const getClientProducts = async () => {
  const products = await db.product.findMany();
  return products.map(parseProduct);
};

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
