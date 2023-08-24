import { getAuthSession } from "@/lib/auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { PostValidator } from "@/lib/validators/post";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id)
      return new NextResponse("Unauthorized", { status: 401 });

    const body = await request.json();

    const { subredditId, title, content } = PostValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new NextResponse("Subscribe to post.", {
        status: 400,
      });
    }

    await db.post.create({
      data: {
        title,
        content,
        subredditId,
        authorId: session?.user?.id,
      },
    });

    return new NextResponse("OK");
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed.", { status: 422 });
    }
    return new NextResponse(
      "Could not post to subreddit at this time, please try again later!",
      {
        status: 500,
      }
    );
  }
}
