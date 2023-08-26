import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentVoteValidator } from "@/lib/validators/vote";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { commentId, voteType } = CommentVoteValidator.parse(body);

    const session = await getAuthSession();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            id: existingVote.id,
          },
        });
        return new NextResponse("OK");
      } else {
        await db.commentVote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            type: voteType,
          },
        });

        return new NextResponse("OK");
      }
    }

    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
      },
    });

    return new NextResponse("OK");
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed.", { status: 422 });
    }
    return new NextResponse(
      "Could not register your vote, please try again later!",
      {
        status: 500,
      }
    );
  }
}
