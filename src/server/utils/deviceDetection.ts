import { cookies, headers } from "next/headers";

import { DeviceType } from "@prisma/client";

/**
 * Server-side device detection using the guildroom cookie and the User-Agent header.
 * Use this in server components and server actions when you need the device type
 * without it being passed from the client.
 */
export async function getServerDeviceType(): Promise<DeviceType> {
  const cookieStore = await cookies();
  if (cookieStore.get("is_guildroom_device")?.value === "1") {
    return DeviceType.GUILDROOM_TABLET;
  }

  const headersList = await headers();
  const ua = headersList.get("user-agent") ?? "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
  return isMobile ? DeviceType.MOBILE : DeviceType.DESKTOP;
}
