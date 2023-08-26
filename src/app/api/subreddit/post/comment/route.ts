import { z } from "zod";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { CommentValidator } from "@/lib/validators/comment";

export async function PATCH(request: Request) {
  const body = await request.json();

  const { postId, text, replyToId } = CommentValidator.parse(body);

  const session = await getAuthSession();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await db.comment.create({
    data: {
      text,
      postId,
      authorId: session.user.id,
      replyToId,
    },
  });

  return new NextResponse("OK");

  try {
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed.", { status: 422 });
    }
    return new NextResponse(
      "Could not comment at this time, please try again later!",
      {
        status: 500,
      }
    );
  }
}
