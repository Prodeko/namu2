import { DepositMethod, DeviceType, LoginMethod } from "@prisma/client";

export const translatePrismaDeviceType = (deviceType: DeviceType): string => {
  const translations: Record<DeviceType, string> = {
    MOBILE: "Mobile",
    DESKTOP: "Desktop",
    GUILDROOM_TABLET: "Guildroom Tablet",
    UNKNOWN: "Unknown",
  };
  return translations[deviceType];
};

export const translatePrismaDepositMethod = (
  depositMethod: DepositMethod,
): string => {
  const translations: Record<DepositMethod, string> = {
    STRIPE: "Stripe",
    MANUAL_MOBILEPAY: "MobilePay",
    ACCOUNT_MIGRATION: "Account Migration",
  };
  return translations[depositMethod];
};

export const translatePrismaLoginMethod = (
  loginMethod: LoginMethod,
): string => {
  const translations: Record<LoginMethod, string> = {
    PASSOWRD: "Password",
    RFID: "RFID",
  };
  return translations[loginMethod];
};
