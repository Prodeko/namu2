"use Server";

import { getCurrentBalance } from "@/server/db/queries/account";

export const getCurrentUserBalance = async () => {
  return await getCurrentBalance();
};
