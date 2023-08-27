import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { usernameValidator } from "@/lib/validators/username";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { name } = usernameValidator.parse(body);

    const username = await db.user.findFirst({
      where: {
        username: name,
      },
    });

    if (username) {
      return new NextResponse("Username taken", { status: 409 });
    }

    // update username
    await db.user.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        username: name,
      },
    });

    return new NextResponse("OK");
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed.", { status: 422 });
    }
    return new NextResponse(
      "Could not update username, please try again later!",
      {
        status: 500,
      }
    );
  }
}
