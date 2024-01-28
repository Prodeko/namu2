import { NextRequest, NextResponse } from "next/server";

import { db } from "@/server/db/prisma";
import { loginInputParser } from "@/server/session";

export async function POST(req: NextRequest) {
  const body = req.body;
  const input = loginInputParser.parse(body);
  const user = await db.user.findUnique({
    where: {
      userName: input.userName,
    },
  });

  // Check if user exists
  if (!user) {
    console.debug(
      `Request unauthorized: user with username ${input.userName} does not exist`,
    );
    return NextResponse.json({ ok });

    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Invalid username or PIN code",
    });
  }

  // Check if PIN code is valid
  const pincodeIsValid = await bcrypt.compare(
    input.pinCode.toString(),
    user.pinHash,
  );
  if (!pincodeIsValid) {
    console.debug(`Request unauthorized: invalid PIN code for user ${user.id}`);
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid username or PIN code",
    });
  }

  // Create session
  const durationInMinutes = 60;
  const sessionId = await ServerSession.SaveSession(user.id, durationInMinutes);

  setCookie(ctx.resHeaders, "sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: "Lax", // Helps with CSRF
    maxAge: durationInMinutes * 1000, // Cookie expiration matches Redis
  });

  // Optionally, you can send a response back to the client
  return { message: "Login successful" };
}
